"use client";
import SocketIOClient from "@/components/websocket/SocketIOClient";

let socket;

export default function Page() {
  return (
    <>
      <SocketIOClient />
    </>
  );
}
