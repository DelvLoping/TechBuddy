'use client';

import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import axiosInstance from "@/lib/axiosInstance";

interface Message {
    id: number;
    content: string;
    sender: 'USER' | 'AI';
}

const ChatAi: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const aiChatId = 1; // Spécifiez ici l'ID du chat que vous voulez gérer

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get(`/ai-message?aiChatId=${aiChatId}`);
            const data = res.data;

            if (data.aIMessages && Array.isArray(data.aIMessages)) {
                setMessages(data.aIMessages);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            // Envoyer le message de l'utilisateur à l'API
            await axiosInstance.post('/ai-message', {
                aiChatId,
                content: input,
                sender: "USER",
            });

            // Ajouter immédiatement le message utilisateur à l'interface
            setMessages([...messages, { id: Date.now(), content: input, sender: 'USER' }]);
            setInput('');

            // Simuler la réponse du bot après un court délai (par exemple 1 seconde)
            setTimeout(async () => {
                const botResponse = "Voici la réponse du bot"; // Vous pouvez personnaliser cela

                // Envoyer la réponse du bot à l'API
                await axiosInstance.post('/ai-message', {
                    aiChatId,
                    content: botResponse,
                    sender: "AI",
                });

                // Ajouter immédiatement la réponse du bot à l'interface
                setMessages(prevMessages => [
                    ...prevMessages,
                    { id: Date.now(), content: botResponse, sender: 'AI' }
                ]);

            }, 1000); // 1 seconde de délai avant la réponse du bot
        } catch (error) {
            console.error("Erreur lors de l'envoi du message ou de la réponse du bot :", error);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {/* Zone de chat */}
            <div className="w-full h-[250px] sm:h-[400px] bg-gray-200 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div
                        className={`p-3 mb-3 rounded-lg min-w-[30%] sm:min-w-[20%] w-auto max-w-[70%] sm:max-w-[40%] whitespace-normal ${msg.sender === 'USER' ? 'bg-primary-200 ml-auto text-left' : 'bg-gray-300 mr-auto text-left'}`}
                        key={msg.id}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            {/* Input et flèche d'envoi */}
            <div className="relative flex items-center w-full mt-4">
                {/* Champ d'input */}
                <input
                    type="text"
                    placeholder="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 bg-gray-100 rounded-full py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-primary-300"
                />

                {/* Bouton flèche */}
                <button
                    onClick={sendMessage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-2"
                >
                    <FaArrowUp />
                </button>
            </div>
        </div>
    );
};

export default ChatAi;
