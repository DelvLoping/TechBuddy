'use client';

import React, { useState, useEffect } from 'react';

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
        const res = await fetch('/api/ai-chat');
        const data = await res.json();

        // Vérifiez si data.aiChats est un tableau
        if (Array.isArray(data.aiChats)) {
            setMessages(data.aiChats);
        } else {
            console.error("Les données récupérées ne sont pas un tableau", data);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const res = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: input, answer: "Response from bot" }),
        });

        const newMessage = await res.json();
        
        if (newMessage.aiChat) {
            setMessages([...messages, newMessage.aiChat]);
        } else {
            console.error("Erreur lors de l'ajout d'un nouveau message", newMessage);
        }
        
        setInput('');
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.messagesContainer}>
                {messages.map((msg) => (
                    <div key={msg.id} style={styles.message}>
                        <strong>{msg.user?.name || "Unknown"}:</strong> {msg.question} <br/>
                        <em>{msg.answer}</em>
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    style={styles.input}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message"
                />
                <button style={styles.sendButton} onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        width: '400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    messagesContainer: {
        height: '300px',
        overflowY: 'auto',
        marginBottom: '10px',
        border: '1px solid #ddd',
        padding: '10px',
        backgroundColor: '#fafafa',
    },
    message: {
        marginBottom: '10px',
    },
    inputContainer: {
        display: 'flex',
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginRight: '10px',
    },
    sendButton: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default ChatAi;
