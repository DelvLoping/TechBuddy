'use client';

import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import axiosInstance from "@/lib/axiosInstance";
import Sidebar from '../Sidebar'; // Assurez-vous d'importer correctement le composant Sidebar

interface Message {
    id: number;
    content: string;
    sender: 'USER' | 'AI';
}

interface CompletedChat {
    id: string;
    firstmessage: string; // Ajout du champ firstmessage pour stocker le premier message
    messages: Message[];
}

const ChatAi: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [titleSet, setTitleSet] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('white'); // État pour gérer la couleur de fond
    const [completedChats, setCompletedChats] = useState<CompletedChat[]>([]); // État pour stocker les conversations terminées
    const [currentChatId, setCurrentChatId] = useState<string | null>(null); // Suivi de la conversation actuelle (nouvelle ou rechargée)
    const aiChatId = 1; // ID du chat ici

    useEffect(() => {
        fetchMessages();
    }, []);

    // Fonction pour récupérer les messages de l'API
    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get(`/ai-message?aiChatId=${aiChatId}`);
            const data = res.data;

            if (data.aIMessages && Array.isArray(data.aIMessages)) {
                setMessages(data.aIMessages);
                if (data.aIMessages.length > 0) {
                    setTitleSet(true);
                }
                console.log("Messages successfully fetched:", data.aIMessages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Fonction pour envoyer un message
    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            const newMessage = { id: Date.now(), content: input, sender: 'USER' };
            const newMessages = [...messages, newMessage];

            setMessages(newMessages); // Mettre à jour les messages dans l'UI
            setInput('');

            // Si c'est le premier message, on utilise la date comme titre
            if (!titleSet) {
                const creationDate = new Date();
                const formattedDate = formatDate(creationDate);
                await updateChatTitle(formattedDate);
                setTitleSet(true);
            }

            // Sauvegarder les messages dans une ancienne conversation ou une nouvelle
            if (currentChatId) {
                // Mise à jour d'une conversation rechargée
                const updatedChats = completedChats.map(chat => 
                    chat.id === currentChatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat
                );
                setCompletedChats(updatedChats); // Mettre à jour le tableau des conversations terminées
            } else {
                // Conversation en cours (nouvelle)
                await axiosInstance.post('/ai-message', {
                    aiChatId,
                    content: input,
                    sender: "USER",
                });
            }

            // Gérer la réponse du bot après 1 seconde
            setTimeout(async () => {
                const botResponse = "This is the bot's response";
                const newBotMessage = { id: Date.now(), content: botResponse, sender: 'AI' };

                setMessages(prevMessages => [
                    ...prevMessages,
                    newBotMessage
                ]);

                // Mise à jour de la conversation rechargée ou nouvelle
                if (currentChatId) {
                    const updatedChats = completedChats.map(chat => 
                        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, newBotMessage] } : chat
                    );
                    setCompletedChats(updatedChats); // Stocker la réponse du bot dans la conversation rechargée
                } else {
                    await axiosInstance.post('/ai-message', {
                        aiChatId,
                        content: botResponse,
                        sender: "AI",
                    });
                }

                console.log("Bot response added:", botResponse);

            }, 1000);
        } catch (error) {
            console.error("Error sending the message or bot's response:", error);
        }
    };

    // Fonction pour mettre à jour le titre du chat avec la date formatée
    const updateChatTitle = async (formattedDate: string) => {
        try {
            console.log('Setting chat title to:', formattedDate);
            await axiosInstance.put(`/ai-chat/${aiChatId}`, {
                title: formattedDate,
            });
            console.log("Chat title updated with:", formattedDate);
        } catch (error) {
            console.error("Error updating chat title:", error);
        }
    };

    // Fonction pour formater la date dans un format lisible
    const formatDate = (date: Date) => {
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    // Fonction pour changer la couleur de fond du chat
    const handleChangeBackgroundColor = (color: string) => {
        setBackgroundColor(color);
        resetChat(); // Appelle la fonction pour sauvegarder et vider la conversation
    };

    // Fonction pour réinitialiser (vider) le chat et sauvegarder la conversation précédente
    const resetChat = () => {
        if (messages.length === 0) return;

        const firstMessageContent = messages[0].content; // Récupérer le contenu du premier message

        // Sauvegarder la conversation actuelle dans completedChats avec un nouvel ID et le firstmessage
        const newChat: CompletedChat = {
            id: `chat-${Date.now()}`, // Génération d'un ID unique pour la conversation
            firstmessage: firstMessageContent, // Sauvegarder le premier message
            messages: [...messages], // Copier les messages actuels
        };

        setCompletedChats(prevChats => [...prevChats, newChat]); // Ajouter la conversation au tableau des conversations terminées

        // Vider les messages et réinitialiser le titre
        setMessages([]);
        setTitleSet(false);
        setCurrentChatId(null); // Réinitialiser l'ID de la conversation en cours
        console.log("Chat reset and saved:", newChat);
    };

    // Fonction pour recharger une conversation précédente
    const loadPreviousChat = (chatId: string) => {
        const previousChat = completedChats.find(chat => chat.id === chatId);
        if (previousChat) {
            setMessages(previousChat.messages); // Charger les messages de l'ancienne conversation
            setCurrentChatId(chatId); // Définir l'ID de la conversation actuelle
            console.log("Loaded previous chat:", previousChat);
        }
    };

    return (
        <div className="chat-container" style={{display:'flex', height:'100vh'}}>
            <Sidebar 
                onChangeBackgroundColor={handleChangeBackgroundColor} 
                completedChats={completedChats}  // Passer les conversations terminées à la Sidebar
                onLoadPreviousChat={loadPreviousChat}  // Passer la fonction de chargement à la Sidebar
            />

            <div className="flex flex-col flex-grow bg-white p-4" style={{ backgroundColor }}> {/* Applique la couleur de fond */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-200">
                    {messages.length === 0 ? (
                        <p>Aucune conversation</p> // Message affiché lorsque le chat est vide
                    ) : (
                        messages.map((msg) => (
                            <div
                                className={`p-3 mb-3 rounded-lg min-w-[30%] sm:min-w-[20%] w-auto max-w-[70%] sm:max-w-[40%] whitespace-normal ${msg.sender === 'USER' ? 'bg-primary-200 ml-auto text-left' : 'bg-gray-300 mr-auto text-left'}`}
                                key={msg.id}
                            >
                                {msg.content}
                            </div>
                        ))
                    )}
                </div>

                <div className="relative flex items-center w-full mt-4">
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-gray-100 rounded-full py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-primary-300"
                    />

                    <button
                        onClick={sendMessage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-2"
                    >
                        <FaArrowUp />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatAi;
