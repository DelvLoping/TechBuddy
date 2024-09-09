'use client';

import ChatComponent from '@/components/macro/ChatComponent';
import PeerPage from '@/components/peer/Peer';
import axiosInstance from '@/lib/axiosInstance';
import { AIChat } from '@prisma/client';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Page() {
  const useReducer = useSelector((state: any) => state.user);
  const { user } = useReducer || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiChats, setAiChats] = useState<AIChat[] | null>(null);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [chats, setChats] = useState([]);
  const [id, setId] = useState(0);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      axiosInstance
        .get('/ai-chat')
        .then((res) => {
          setAiChats(res.data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  console.log(aiChats);

  const onSelectedChatChange = (chatId: number) => {
    setSelectedChat(chatId);
    setShow(true);
  };

  const onSendMessage = async (e: React.FormEvent<HTMLFormElement>, message: string) => {
    e.preventDefault();
    console.log(message);
    try {
      if (message) {
        setLoading(true);
        setError(null);
        let currentChat = aiChats.find((chat) => chat.id === selectedChat);
        if (!currentChat) {
          currentChat = await axiosInstance.post('/ai-chat', { message }).then((res) => {
            if (res.data) {
              return res.data.aiChat;
            }
          });
        }
        await axiosInstance
          .post('/ai-message', { aiChatId: currentChat.id, content: message, sender: 'USER' })
          .then((res) => {
            setMessages([...messages, res.data]);
          });

        const aiResponse = await axiosInstance
          .post('/ai', { userPrompt: message, context: [] })
          .then((res) => {
            if (res.data) {
              return res.data;
            }
          });
        console.log(aiResponse);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed !w-screen !h-screen !p-0'>
      <ChatComponent
        className='!w-full !h-full'
        sidebarClassName='!w-[15%]'
        formClassName='!p-10 !justify-center !bg-transparent'
        inputClassName='!max-w-[30rem] rounded-xl'
        isShow={true}
        show={show}
        chats={chats}
        id={id}
        selectedChat={selectedChat}
        messages={messages}
        typingStatus={typingStatus}
        disabled={loading}
        onSelectedChatChange={onSelectedChatChange}
        onSendMessage={onSendMessage}
        onClose={() => setShow(false)}
      />
    </div>
  );
}
