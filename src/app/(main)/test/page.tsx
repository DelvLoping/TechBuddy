"use client";
import { useEffect } from "react";
import io from "socket.io-client";

let socket;

export default function Page() {
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    // Remplacez l'URL par l'URL de votre serveur Socket.IO si elle est différente
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("connected");
    });

    // Vous pouvez ajouter d'autres gestionnaires d'événements ici si nécessaire
  };

  return null;
}
