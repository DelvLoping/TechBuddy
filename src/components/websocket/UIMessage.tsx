import { shouldDisplayDate, shouldDisplayTime } from '@/utils';
import { Message } from '@prisma/client';
import moment from 'moment';
import { useState } from 'react';
import _ from 'lodash';

type UIMessageProps = {
  message: Message;
  userId: number;
  nextMessage: Message | null;
};
const UIMessage = ({ message, userId, nextMessage }: UIMessageProps) => {
  if (_.isEmpty(message)) {
    return null;
  }
  const isShouldDisplayTime = shouldDisplayTime(message, nextMessage);
  const isShouldDisplayDate = shouldDisplayDate(message, nextMessage);
  const [displayTime, setDisplayTime] = useState(false);

  const onClick = () => {
    setDisplayTime(!displayTime);
  };
  return (
    <>
      <div
        key={message.id}
        className={`w-full flex flex-col ${
          message.userId === userId ? 'items-end' : 'items-start'
        }`}
      >
        <p
          className={`w-fit rounded-xl p-2 break-all text-wrap text-sm sm:text-base
            ${message.userId === userId ? 'bg-primary text-white' : 'bg-gray-100'}`}
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
