'use client';

import React, { useState, useEffect } from 'react';
import "@/components/chat/ChatAi.css";
import { Input, Button } from "@nextui-org/react";
import axiosInstance from "@/lib/axiosInstance";

interface Message {
    id: number;
    question: string;
    answer: string;
    user: {
        name: string;
    };
}

const ChatAi: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get('/ai-chat'); // Utilisation de axios pour récupérer les messages
            const data = res.data;

            // Vérifiez si data.aiChats est un tableau
            if (Array.isArray(data.aiChats)) {
                setMessages(data.aiChats);
            } else {
                console.error("Les données récupérées ne sont pas un tableau", data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            const res = await axiosInstance.post('/ai-chat', {
                question: input,
                answer: "Response from bot", // Remplacez cela par votre logique de réponse du bot si nécessaire
            });

            const newMessage = res.data;

            if (newMessage.aiChat) {
                setMessages([...messages, newMessage.aiChat]);
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
                    <div className="chatAi-message" key={msg.id}>
                        <strong>{msg.user?.name || "Unknown"}:</strong> {msg.question} <br />
                        <em>{msg.answer}</em>
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
                    Rechercher
                </Button>
            </div>
        </div>
    );
};

export default ChatAi;
