import { shouldDisplayDate, shouldDisplayTime } from '@/utils';
import { AIMessage, Message } from '@prisma/client';
import moment from 'moment';
import { useState } from 'react';
import _ from 'lodash';

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

  const onClick = () => {
    setDisplayTime(!displayTime);
  };
  let alignClass = '';
  let colorClass = '';
  if (isAI) {
    if (message.sender === 'AI') {
      alignClass = 'items-start';
      colorClass = 'bg-gray-100';
    } else {
      alignClass = 'items-end';
      colorClass = 'bg-primary text-white';
    }
  } else {
    if (message.userId !== userId) {
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
        <p
          className={`w-fit rounded-xl p-2 break-all text-wrap text-sm sm:text-base
            ${colorClass} `}
          onClick={onClick}
        >
          {message.content}
        </p>
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
