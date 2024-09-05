import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import _, { set } from "lodash";
import axiosInstance from "@/lib/axiosInstance";
import { getFullNames } from "@/utils";
import { useSelector } from "react-redux";
import UIMessage from "./UIMessage";
import Button from "../ui/Button";
import { IoIosSend } from "react-icons/io";
import { IoChatbubble, IoClose } from "react-icons/io5";
import { FaWindowMinimize } from "react-icons/fa";

const socket = io("http://localhost:3001");
type ChatProps = {
  isShow: boolean;
};
const Chat = ({ isShow = true }: ChatProps) => {
  const messagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const useReducer = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const { user } = useReducer;
  const { id } = user || {};

  useEffect(() => {
    if (selectedChat && id) {
      if (socket) {
        socket.removeAllListeners("chatHistory");
        socket.removeAllListeners("message");
        socket.removeAllListeners("typing");
      }
      if (!_.isEmpty(messages)) {
        setMessages([]);
      }
      socket.emit("joinChat", selectedChat, id);

      const handleChatHistory = (historicalMessages) => {
        setMessages(historicalMessages);
      };

      const handleMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      const handleTyping = ({ userId, isTyping }) => {
        if (userId !== id) {
          setTypingStatus(isTyping ? `Typing...` : "");
        }
      };

      socket.on("chatHistory", handleChatHistory);
      socket.on("message", handleMessage);
      socket.on("typing", handleTyping);
      return () => {
        socket.off("chatHistory", handleChatHistory);
        socket.off("message", handleMessage);
        socket.off("typing", handleTyping);
      };
    }
  }, [selectedChat, id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [show, messages, typingStatus]);

  useEffect(() => {
    axiosInstance.get("/chat").then((res) => {
      setConversations(res.data.chats);
      setSelectedChat(res.data.chats[0]?.id);
    });
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && selectedChat) {
      socket.emit("message", {
        chatId: selectedChat,
        userId: id,
        content: messageInput,
      });
      setMessageInput("");
    }
  };

  const onBlur = () => {
    socket.emit("typing", {
      chatId: selectedChat,
      userId: id,
      isTyping: false,
    });
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    socket.emit("typing", { chatId: selectedChat, userId: id, isTyping: true });
  };
  const handleSelectedChatChange = (chatId) => {
    setSelectedChat(chatId);
    setMessageInput("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const currentChat = _.find(conversations, { id: selectedChat });
  const currentChatTarget =
    !_.isEmpty(currentChat) && currentChat?.user1Id === id
      ? currentChat?.user2
      : currentChat?.user1;
  const disabled = !selectedChat || !messageInput;

  return (
    <div
      className={`fixed bottom-4 sm:!bottom-4 right-4 sm:!right-4 z-50 flex flex-col gap-2 items-end ${
        show && "!bottom-0 !right-0 "
      }`}
    >
      {(isShow || show) && (
        <div className="flex flex-row items-center sm:h-[35rem] top-0 left-0 h-screen w-screen sm:w-fit z-[99999] sm:flex">
          <div className="h-full w-[30%] sm:w-36 flex flex-col gap-2 sm:rounded-l-xl sm:border-gray-200 sm:border-l sm:border-b sm:border-t overflow-hidden bg-gray-100">
            {_.map(conversations, (chat, index) => {
              const targetUser = chat.user1Id === id ? chat.user2 : chat.user1;
              return (
                <div
                  key={chat.id}
                  className={`w-full p-2 cursor-pointer break-all text-wrap ${
                    selectedChat === chat.id ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => handleSelectedChatChange(chat.id)}
                >
                  {getFullNames(targetUser)}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:rounded-r-xl sm:border sm:border-gray-200 w-[70%] sm:w-[20rem] h-full bg-white">
            <div className="w-full flex justify-center items-center text-center border-b border-gray-200 p-2 font-semibold min-h-10">
              {currentChat && getFullNames(currentChatTarget)}
              <IoClose
                className="cursor-pointer sm:hidden absolute right-2 top-2 h-6 w-6 opacity-50"
                onClick={() => setShow(false)}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2 py-4 px-4 overflow-y-auto bg-white justify-between">
              <div className="flex-1 flex flex-col gap-2 items-center">
                {_.map(messages, (msg, index) => (
                  <UIMessage
                    key={msg.id}
                    message={msg}
                    userId={id}
                    nextMessage={messages[index + 1]}
                  />
                ))}
              </div>
              {_.isEmpty(messages) && (
                <div className="w-full flex justify-center text-gray-400">
                  No messages
                </div>
              )}

              <div ref={messagesEndRef}>
                {typingStatus && (
                  <div className="w-full text-center text-sm text-gray-400">
                    {typingStatus}
                  </div>
                )}
              </div>
            </div>

            <form
              className="w-full flex items-start gap-2 bg-gray-100 p-2 rounded-br-xl"
              onSubmit={handleSendMessage}
            >
              <textarea
                className={`w-full p-2 rounded-lg border border-gray-300 resize-none text-gray-900 text-sm focus:outline-none ${
                  !messageInput ? "h-10" : "h-auto"
                }`}
                value={messageInput}
                onChange={handleInputChange}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
              />
              <Button
                className="bg-primary text-white p-2 rounded-xl"
                disabled={disabled}
                type="submit"
              >
                <IoIosSend />
              </Button>
            </form>
          </div>
        </div>
      )}
      {!isShow && (
        <Button
          className={`bg-primary text-white p-4 rounded-full border border-white ${
            show && "hidden sm:block"
          }`}
          onClick={() => setShow(!show)}
        >
          {show ? (
            <FaWindowMinimize className="h-6 w-10" />
          ) : (
            <IoChatbubble className="h-10 w-10" />
          )}
        </Button>
      )}
    </div>
  );
};

export default Chat;
