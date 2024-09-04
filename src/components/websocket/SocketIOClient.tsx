import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import _ from "lodash";
const socket = io("http://localhost:3001");

const SocketIOClient: React.FC = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const router = useRouter();
  const chatId = 1;

  useEffect(() => {
    if (chatId) {
      socket.emit("joinChat", chatId);

      // Listen for chat history
      socket.on("chatHistory", (historicalMessages) => {
        setMessages(historicalMessages);
      });

      // Listen for new messages
      socket.on("message", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [chatId]);

  useEffect(() => {
    // Fetch conversations for the user
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => setConversations(data.chats))
      .catch((error) => console.error("Error fetching conversations:", error));
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      socket.emit("message", { chatId, userId: 1, content: messageInput });
      setMessageInput("");
    }
  };

  return (
    <div className="chat-popup">
      <div className="conversations-list">
        {_.map(conversations, (chat) => (
          <div key={chat.id} onClick={() => setSelectedChat(chat.id)}>
            Chat with {chat.user1Id} and {chat.user2Id}
          </div>
        ))}
      </div>
      {selectedChat && (
        <div className="chat-window">
          <div className="messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.userId === 1 ? "sent" : "received"}`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default SocketIOClient;
