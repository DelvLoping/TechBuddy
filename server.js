import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { config } from 'dotenv';
config({
  path: ['.env.local', '.env']
});
console.log(process.env.DATABASE_URL);
const app = express();
const prisma = new PrismaClient();
const allowOrigin =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_ORIGIN;
app.use(
  cors({
    origin: allowOrigin,
    methods: ['GET', 'POST']
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowOrigin,
    methods: ['GET', 'POST']
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
