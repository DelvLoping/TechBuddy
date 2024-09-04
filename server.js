// server.js
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { prisma } = require("./src/lib/prisma");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("joinChat", async (chatId) => {
      socket.join(chatId);

      try {
        const messages = await prisma.message.findMany({
          where: { chatId: Number(chatId) },
          orderBy: { sendDate: "asc" },
        });
        socket.emit("chatHistory", messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    });

    socket.on("message", async ({ chatId, userId, content }) => {
      try {
        const message = await prisma.message.create({
          data: {
            chatId,
            userId,
            content,
          },
        });
        io.to(chatId).emit("message", message);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3001");
  });
});
