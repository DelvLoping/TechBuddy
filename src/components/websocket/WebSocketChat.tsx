import { use, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import Button from '@/components/form/Button';
import { IoChatbubble } from 'react-icons/io5';
import { FaWindowMinimize } from 'react-icons/fa';
import { Chat as ChatType } from '@prisma/client';
import ChatComponent from '@/components/macro/ChatComponent';

let socket;
type ChatProps = {
  isShow: boolean;
};
const WebSocketChat = ({ isShow = true }: ChatProps) => {
  const chatsReducer = useSelector((state: any) => state.chats);
  const { chats } = chatsReducer || {};
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const useReducer = useSelector((state: any) => state.user);
  const { user } = useReducer;
  const { id } = user || {};
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        transports: ['websocket'],
        secure: process.env.NODE_ENV === 'production'
      });
      if (selectedChat && id) {
        if (socket) {
          socket.removeAllListeners('chatHistory');
          socket.removeAllListeners('message');
          socket.removeAllListeners('typing');
        }
        if (!_.isEmpty(messages)) {
          setMessages([]);
        }
        socket.emit('joinChat', selectedChat, id);

        const handleChatHistory = (historicalMessages) => {
          setMessages(historicalMessages);
        };

        const handleMessage = (newMessage) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        const handleTyping = ({ userId, isTyping }) => {
          if (userId !== id) {
            setTypingStatus(isTyping ? `Typing...` : '');
          }
        };

        socket.on('chatHistory', handleChatHistory);
        socket.on('message', handleMessage);
        socket.on('typing', handleTyping);
        return () => {
          socket.off('chatHistory', handleChatHistory);
          socket.off('message', handleMessage);
          socket.off('typing', handleTyping);
        };
      }
    }
  }, [selectedChat, id]);

  useEffect(() => {
    if (!_.isEmpty(chats)) {
      const firstChat: ChatType = _.first(chats);
      if (firstChat && firstChat.id) {
        setSelectedChat(firstChat.id);
      }
    }
  }, [chats]);

  const onSendMessage = (e, message) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      socket.emit('message', {
        chatId: selectedChat,
        userId: id,
        content: message
      });
    }
  };

  const onBlur = () => {
    socket.emit('typing', {
      chatId: selectedChat,
      userId: id,
      isTyping: false
    });
  };

  const onInputChange = (e) => {
    socket.emit('typing', { chatId: selectedChat, userId: id, isTyping: true });
  };
  const onSelectedChatChange = (chatId) => {
    setSelectedChat(chatId);
  };

  return (
    <div
      className={`fixed bottom-4 sm:!bottom-4 right-4 sm:!right-4 z-50 flex flex-col gap-2 items-end ${
        show && '!bottom-0 !right-0 w-screen sm:w-fit'
      }`}
    >
      <ChatComponent
        className='sm:!h-[35rem] sm:!w-[29rem]'
        isShow={isShow}
        show={show}
        chats={chats}
        userId={id}
        selectedChat={selectedChat}
        messages={messages}
        typingStatus={typingStatus}
        disabled={!selectedChat}
        onSelectedChatChange={onSelectedChatChange}
        onSendMessage={onSendMessage}
        onInputChange={onInputChange}
        onBlur={onBlur}
        onClose={() => setShow(false)}
      />
      {!isShow && (
        <Button
          className={`bg-primary text-white p-3 sm:p-4 rounded-full border-2 border-white ${
            show && 'hidden sm:block'
          }`}
          onClick={() => setShow(!show)}
        >
          {show ? (
            <FaWindowMinimize className='h-6 w-10' />
          ) : (
            <IoChatbubble className={`sm:h-10 sm:w-10  h-8 w-8`} />
          )}
        </Button>
      )}
    </div>
  );
};

export default WebSocketChat;
