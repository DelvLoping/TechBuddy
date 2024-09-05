'use client';

import React, { useState, useEffect } from 'react';
import "@/components/chat/ChatAi.css";
import { Input, Button } from "@nextui-org/react";
import axiosInstance from "@/lib/axiosInstance";

interface Message {
    id: number;
    content: string;
    sender: 'USER' | 'AI';
}

interface AIChat {
    id: number;
    messages: Message[];
}

const ChatAi: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const aiChatId = 1;

    useEffect(() => {
        fetchMessages();
    }, []);

    // Fonction pour récupérer les messages de l'API
    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get('/ai-message?aiChatId=' + aiChatId);
            const data = res.data;

            if (data.aiChats && Array.isArray(data.aiChats[0]?.messages)) {
                setMessages(data.aiChats[0].messages);
            } else {
                console.error("Les données récupérées ne sont pas conformes", data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
        }
    };

    // Fonction pour envoyer un message à l'API
    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            const res = await axiosInstance.post('/api/ai-chat', {
                question: input,
                answer: "Response from bot",
            });

            const newMessage = res.data;

            if (newMessage.aiChat && Array.isArray(newMessage.aiChat.messages)) {
                setMessages([...messages, ...newMessage.aiChat.messages]);
            } else {
                console.error("Erreur lors de l'ajout d'un nouveau message", newMessage);
            }

            setInput('');
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    };

    return (
        <div className="chatAi-container">
            <div className="chatAi-card">
                {messages.map((msg) => (
                    <div
                        className={`chatAi-message ${msg.sender === 'USER' ? 'user-message' : 'ai-message'}`}
                        key={msg.id}
                    >
                        <strong>{msg.sender === 'USER' ? 'You' : 'AI'}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <div className="chatAi-form">
                <Input
                    type="text"
                    label="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button
                    className="chatAi-button"
                    color="primary"
                    onClick={sendMessage}
                    style={{ height: '55px' }}
                >
                    Envoyer
                </Button>
            </div>
        </div>
    );
};

export default ChatAi;
