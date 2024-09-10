import React from 'react';
import Sidebar from '@/components/Sidebar';
import ChatAi from '@/components/chat/ChatAi';

const ChatAiPage = () => {
    return (
        <div className="flex">
            {/* <Sidebar /> */}
            <div style={{ flex: 1 }}>
                <ChatAi />
            </div>
        </div>
    );
};

export default ChatAiPage;
