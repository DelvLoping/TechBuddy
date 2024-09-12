import markdownToHtml, { shouldDisplayDate, shouldDisplayTime } from '@/utils';
import { AIMessage, Message } from '@prisma/client';
import moment from 'moment';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import ChatBot from '@/assets/images/chatbot.png';
import Image from 'next/image';

type UIMessageProps = {
  message: Message | AIMessage;
  userId: number;
  nextMessage: Message | AIMessage | null;
  isAI?: boolean;
};
const UIMessage = ({ message, userId, nextMessage, isAI }: UIMessageProps) => {
  if (_.isEmpty(message)) {
    return null;
  }
  const isShouldDisplayTime = shouldDisplayTime(message, nextMessage);
  const isShouldDisplayDate = shouldDisplayDate(message, nextMessage);
  const [displayTime, setDisplayTime] = useState(false);
  const [contentHtml, setContentHtml] = useState<string | null>(null);

  useEffect(() => {
    const convertMarkdown = async () => {
      let htmlContent = message.content;
      if (message.content && isAI) {
        htmlContent = await markdownToHtml(message.content);
      }
      setContentHtml(htmlContent);
    };

    convertMarkdown();
  }, [message.content]);

  const onClick = () => {
    setDisplayTime(!displayTime);
  };

  let alignClass = '';
  let colorClass = '';
  if (isAI) {
    if ('sender' in message && message.sender === 'AI') {
      alignClass = 'items-start';
      colorClass = 'bg-gray-100';
    } else {
      alignClass = 'items-end';
      colorClass = 'bg-primary text-white';
    }
  } else {
    if ('userId' in message && message.userId !== userId) {
      alignClass = 'items-start';
      colorClass = 'bg-gray-100';
    } else {
      alignClass = 'items-end';
      colorClass = 'bg-primary text-white';
    }
  }

  return (
    <>
      <div key={message.id} className={`w-full flex flex-col ${alignClass}`}>
        <div className='flex flex- gap-1'>
          {isAI && 'sender' in message && message.sender === 'AI' && (
            <Image
              src={ChatBot}
              alt='chatbot'
              width={10}
              height={10}
              className='rounded-full h-7 w-7 border border-gray-200'
            />
          )}
          <p
            className={`w-fit rounded-xl p-2 text-wrap text-sm sm:text-base ${colorClass}`}
            onClick={onClick}
            dangerouslySetInnerHTML={{ __html: contentHtml || message.content }}
          />
        </div>
        {(isShouldDisplayTime || displayTime) && (
          <span className='text-xs text-gray-400'>{moment(message.sendDate).format('HH:mm')}</span>
        )}
      </div>
      {isShouldDisplayDate && (
        <span className='text-xs text-gray-400'>
          {moment(message.sendDate).format('DD/MM/YYYY')}
        </span>
      )}
    </>
  );
};
export default UIMessage;
