'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import axiosInstance from "@/lib/axiosInstance";

const Sidebar = ({ onChangeBackgroundColor, completedChats, onLoadPreviousChat }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetchChats();
    }, []);

    // Récupérer les chats de l'API
    const fetchChats = async () => {
        try {
            const response = await axiosInstance.get('/ai-chat');
            setChats(response.data.aiChats);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    return (
        <div className="sidebar h-screen w-900 bg-gray-300 text-white flex flex-col shadow-lg">
            {/* Header */}
            <div className="p-4 text-xl font-bold bg-gray-300">
                Conversations
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
                {Array.isArray(completedChats) && completedChats.length > 0 ? (
                    <div className="space-y-2 p-4">
                        {completedChats.map((completedChat) => (
                            <div
                                key={completedChat.id}
                                className="chat-item p-3 rounded-lg bg-primary-200 hover:bg-gray-300 transition-colors cursor-pointer"
                                onClick={() => onLoadPreviousChat(completedChat.id)}
                            >
                                {completedChat.firstmessage || "Untitled Conversation"}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-400">No conversations found</div>
                )}
            </div>

            {/* Footer avec le bouton FaPlus */}
            <div className="sidebar-footer p-4 bg-gray-300">
                <button
                    onClick={() => onChangeBackgroundColor('gray')}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg"
                >
                    <FaPlus />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
