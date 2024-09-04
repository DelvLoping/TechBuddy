import { NextRequest, NextResponse } from "next/server";
import { Server } from "socket.io";

const SocketHandler = (req: NextRequest, res: NextResponse) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    res.socket.server.io = io;
    console.log("Socket.IO server initialized");
  }

  res.end();
};

export default SocketHandler;
