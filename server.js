import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {
    const userChannels = new Set();

    socket.on('joinChat', async (chatId, userId) => {
      const chat = await prisma.chat.findFirst({
        where: { id: Number(chatId) }
      });
      const isAuthorizedChat = chat.user1Id === userId || chat.user2Id === userId;
      if (!isAuthorizedChat) {
        return;
      }

      for (const channel of userChannels) {
        socket.leave(channel);
      }

      socket.join(chatId);
      userChannels.add(chatId);

      try {
        const messages = await prisma.message.findMany({
          where: { chatId: Number(chatId) },
          orderBy: { sendDate: 'asc' }
        });
        socket.emit('chatHistory', messages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    });

    socket.on('message', async ({ chatId, userId, content }) => {
      try {
        const message = await prisma.message.create({
          data: {
            chatId,
            userId,
            content
          }
        });
        io.to(chatId).emit('message', message);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('typing', ({ chatId, userId, isTyping }) => {
      io.to(chatId).to(chatId).emit('typing', { userId, isTyping });
    });

    socket.on('disconnect', () => {
      userChannels.clear();
    });
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});
