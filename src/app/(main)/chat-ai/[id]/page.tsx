import React from 'react';
import ChatAi from '@/components/chat/ChatAi';
import { useRouter } from 'next/router';

const ChatAiPage = () => {
    const router = useRouter();
    const { id } = router.query;

    return <ChatAi chatId={id} />;
};

export default ChatAiPage;
