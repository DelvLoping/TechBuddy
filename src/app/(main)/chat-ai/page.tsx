'use client';

import ChatComponent from '@/components/macro/ChatComponent';
import axiosInstance from '@/lib/axiosInstance';
import { AIChat, AIMessage } from '@prisma/client';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Page() {
  const useReducer = useSelector((state: any) => state.user);
  const { user } = useReducer || {};
  const { id } = user || {};
  const [loading, setLoading] = useState(false);
  const [aiChats, setAiChats] = useState<AIChat[] | null>(null);
  const [selectedChat, setSelectedChat] = useState<number | null>(0);
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');

  useEffect(() => {
    if (user) {
      setLoading(true);
      axiosInstance
        .get('/ai-chat')
        .then((res) => {
          const chatsList = res.data.aiChats;
          if (chatsList.length > 0) {
            const newAiChats = _.orderBy(chatsList, ['creationDate'], ['desc']);
            setAiChats(newAiChats);
          }
        })
        .catch((err) => {
          toast.error('Error fetching AI Chats');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (!_.isEmpty(aiChats)) {
      setSelectedChat(_.first(aiChats)?.id);
    }
  }, [aiChats]);

  useEffect(() => {
    if (selectedChat) {
      setLoading(true);
      axiosInstance
        .get(`/ai-message?aiChatId=${selectedChat}`)
        .then((res) => {
          setMessages(res.data.aIMessages);
        })
        .catch((err) => {
          toast.error('Error fetching AI Messages');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedChat]);

  const onSelectedChatChange = (chatId: number) => {
    setMessages([]);
    setSelectedChat(chatId);
    setShow(true);
  };

  const onSendMessage = async (e: React.FormEvent<HTMLFormElement>, message: string) => {
    e.preventDefault();
    try {
      if (message) {
        setLoading(true);
        let currentChat = _.find(aiChats, (chat) => chat.id === selectedChat);
        if (!currentChat) {
          currentChat = await axiosInstance.post('/ai-chat', { message }).then((res) => {
            if (res.data) {
              return res.data.aiChat;
            }
          });
          const newAiChats = _.orderBy(
            [currentChat, ...(aiChats || [])],
            ['creationDate'],
            ['desc']
          );
          setAiChats(newAiChats);
          setSelectedChat(currentChat.id);
        }
        setTypingStatus('Typing...');
        let oldMessages = messages;
        await axiosInstance
          .post('/ai-message', { aiChatId: currentChat.id, content: message, sender: 'USER' })
          .then((res) => {
            if (res.data) {
              oldMessages = [...oldMessages, res.data.aIMessage];
              setMessages(oldMessages);
            }
          });

        const context = _.map(oldMessages, (msg: AIMessage) => {
          return {
            role: msg.sender === 'USER' ? 'user' : 'assistant',
            content: msg.content
          };
        });
        const aiResponse = await axiosInstance
          .post('/ai', { userPrompt: message, context })
          .then((res) => {
            if (res.data) {
              return res.data;
            }
          });
        const lastAssitantResponse: { role: string; content: string } = _.last(
          aiResponse.updatedContext.filter(
            (msg: { role: string; content: string }) => msg.role === 'assistant'
          )
        );
        await axiosInstance
          .post('/ai-message', {
            aiChatId: currentChat.id,
            content: lastAssitantResponse.content,
            sender: 'AI'
          })
          .then((res) => {
            if (res.data) {
              oldMessages = [...oldMessages, res.data.aIMessage];
              setMessages(oldMessages);
            }
          });
        setTypingStatus('');
      }
    } catch (err: any) {
      console.log(err);
      toast.error('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed !w-screen !h-screen !p-0'>
      <ChatComponent
        className='!w-full !h-full'
        sidebarClassName='!w-[15%] !min-w-[10rem] !rounded-none'
        messagesDivClassName='!rounded-none'
        formClassName='!p-10 !justify-center !bg-transparent'
        inputClassName='!max-w-[30rem] rounded-xl'
        messagesCoreClassName='max-w-[55rem] mx-auto'
        listMessagesClassName='!gap-8'
        isShow={true}
        show={show}
        chats={aiChats}
        userId={id}
        selectedChat={selectedChat}
        messages={messages}
        typingStatus={typingStatus}
        disabled={loading}
        loading={loading}
        onSelectedChatChange={onSelectedChatChange}
        onSendMessage={onSendMessage}
        onClose={() => setShow(false)}
        isAI={true}
      />
    </div>
  );
}
