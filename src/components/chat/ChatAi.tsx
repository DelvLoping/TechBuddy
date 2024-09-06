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
    const aiChatId = 1; // Specify the chat ID here

    // Fetch messages when component mounts
    useEffect(() => {
        fetchMessages();
    }, []);

    // Function to fetch messages from the API
    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get(`/ai-message?aiChatId=${aiChatId}`);
            const data = res.data;

            // Check if data contains an array of messages
            if (data.aIMessages && Array.isArray(data.aIMessages)) {
                setMessages(data.aIMessages);
                console.log("Messages successfully fetched:", data.aIMessages);
            }
        } catch (error) {
            console.error("Error while fetching messages:", error);
        }
    };

    // Function to send a message
    const sendMessage = async () => {
        if (!input.trim()) return; // Do nothing if input is empty

        try {
            // Send the user's message to the API
            await axiosInstance.post('/ai-message', {
                aiChatId,
                content: input,
                sender: "USER",
            });

            // Immediately add the user's message to the UI
            setMessages([...messages, { id: Date.now(), content: input, sender: 'USER' }]);
            setInput(''); // Clear input field

            // Simulate bot's response after a short delay
            setTimeout(async () => {
                const botResponse = "This is the bot's response"; // Customize this response

                // Send the bot's response to the API
                await axiosInstance.post('/ai-message', {
                    aiChatId,
                    content: botResponse,
                    sender: "AI",
                });

                // Immediately add the bot's response to the UI
                setMessages(prevMessages => [
                    ...prevMessages,
                    { id: Date.now(), content: botResponse, sender: 'AI' }
                ]);
                console.log("Bot response added:", botResponse);

            }, 1000); // 1-second delay before the bot's response
        } catch (error) {
            console.error("Error while sending the message or bot's response:", error);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {/* Chat area */}
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

            {/* Input and send button */}
            <div className="relative flex items-center w-full mt-4">
                {/* Input field */}
                <input
                    type="text"
                    placeholder="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 bg-gray-100 rounded-full py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-primary-300"
                />

                {/* Send button with arrow icon */}
                <button
                    onClick={sendMessage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-2"
                >
                    <FaArrowUp />
                </button>
            </div>
        </div>
    );
};

export default ChatAi;
