import { getFullNames } from '@/utils';
import { IoClose } from 'react-icons/io5';
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb';
import UIMessage from '../websocket/UIMessage';
import _, { set } from 'lodash';
import { Chat, Message, User } from '@prisma/client';
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState
} from 'react';
import { Button } from '@nextui-org/react';
import { IoIosSend } from 'react-icons/io';

type ChatComponentProps = {
  className?: string;
  sidebarClassName?: string;
  formClassName?: string;
  inputClassName?: string;
  show: boolean;
  isShow: boolean;
  chats: Chat[];
  id: number;
  selectedChat: number;
  messages: Message[];
  typingStatus?: string;
  disabled?: boolean;
  onSelectedChatChange: (chatId: number) => void;
  onSendMessage: (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>,
    message: string
  ) => void;
  onInputChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  onClose: (show: boolean) => void;
};
const ChatComponent = ({
  className,
  sidebarClassName,
  formClassName,
  inputClassName,
  show,
  isShow,
  chats,
  id,
  selectedChat,
  messages,
  typingStatus,
  disabled = false,
  onSelectedChatChange,
  onSendMessage,
  onInputChange,
  onBlur,
  onClose
}: ChatComponentProps) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [show, messages, typingStatus]);

  const currentChat: Chat & { user1?: User; user2?: User } = _.find(chats, { id: selectedChat });
  const currentChatTarget =
    !_.isEmpty(currentChat) && currentChat?.user1Id === id
      ? currentChat?.user2
      : currentChat?.user1;

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    onInputChange && onInputChange(e);
  };

  const handleSendMessage = (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    console.log('handleSendMessage');
    onSendMessage(e, messageInput);
    setMessageInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSelectedChatChange = (chatId: number) => {
    onSelectedChatChange(chatId);
    setMessageInput('');
  };

  return (
    <>
      {(isShow || show) && (
        <div
          className={`flex flex-row items-center sm:h-[35rem] sm:w-[29rem] top-0 left-0 h-screen w-screen z-[99999] sm:flex ${className}`}
        >
          <div
            className={`h-full ${
              showSidebar ? 'w-[40%]' : 'hidden'
            } flex flex-col sm:rounded-l-xl sm:border-gray-200 sm:border-l sm:border-b sm:border-t overflow-hidden bg-gray-100 ${sidebarClassName}
        `}
          >
            {_.map(chats, (chat: Chat & { user1: User; user2: User }) => {
              const targetUser = chat.user1Id === id ? chat.user2 : chat.user1;
              return (
                <div
                  key={chat.id}
                  className={`w-full p-2 cursor-pointer break-all truncate text-sm sm:text-base
                ${selectedChat === chat.id ? 'bg-primary text-white' : ''}`}
                  onClick={() => handleSelectedChatChange(chat.id)}
                >
                  {getFullNames(targetUser)}
                </div>
              );
            })}
          </div>

          <div
            className={`flex flex-col sm:rounded-r-xl sm:border sm:border-gray-200 w-full h-full bg-white ${
              !showSidebar && 'sm:rounded-l-xl'
            }`}
          >
            <div className='relative w-full flex justify-center items-center text-center border-b border-gray-200 p-2 px-8 font-semibold min-h-10 text-sm sm:text-base'>
              {showSidebar ? (
                <TbLayoutSidebarLeftCollapseFilled
                  className='absolute top-2 left-2 h-6 w-6 cursor-pointer opacity-50'
                  onClick={() => setShowSidebar(false)}
                />
              ) : (
                <TbLayoutSidebarLeftExpandFilled
                  className='absolute top-2 left-2 h-6 w-6 cursor-pointer opacity-50'
                  onClick={() => setShowSidebar(true)}
                />
              )}
              {currentChat && getFullNames(currentChatTarget)}
              <IoClose
                className='cursor-pointer sm:hidden absolute right-2 top-2 h-6 w-6 opacity-50'
                onClick={() => onClose(false)}
              />
            </div>
            <div className='flex-1 flex flex-col gap-2 py-4 px-4 overflow-y-auto bg-white justify-between'>
              <div className='flex-1 flex flex-col gap-2 items-center'>
                {_.map(messages, (msg, index) => (
                  <UIMessage
                    key={msg.id}
                    message={msg}
                    userId={id}
                    nextMessage={messages[index + 1]}
                  />
                ))}
              </div>
              {_.isEmpty(messages) && (
                <div className='w-full flex justify-center text-gray-400'>No messages</div>
              )}

              <div ref={messagesEndRef}>
                {typingStatus && (
                  <div className='w-full text-center text-sm text-gray-400'>{typingStatus}</div>
                )}
              </div>
            </div>

            <form
              className={`w-full flex items-start gap-2 bg-gray-100 p-2 rounded-br-xl ${
                !showSidebar && 'sm:rounded-bl-xl'
              } ${formClassName}`}
              onSubmit={handleSendMessage}
            >
              <textarea
                className={`w-full p-2 rounded-lg border border-gray-300 resize-none text-gray-900 text-sm focus:outline-none ${
                  !messageInput ? 'h-10' : 'h-auto'
                } ${inputClassName}`}
                value={messageInput}
                onChange={handleInputChange}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
              />
              <Button
                className='bg-primary text-white p-2 rounded-xl cursor-pointer'
                disabled={!messageInput || disabled}
                type='submit'
              >
                <IoIosSend />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatComponent;
