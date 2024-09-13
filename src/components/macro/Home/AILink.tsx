import { Card } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ChatBot from '@/assets/images/chatbot.png';

const AILink = () => {
  const router = useRouter();
  return (
    <div className='w-full flex flex-row justify-center'>
      <div
        className='w-full sm:w-2/3 md:w-3/4  cursor-pointer'
        onClick={() => router.push('/chat-ai')}
      >
        <Card className='w-full bg-primary text-white p-4 px-8 flex flex-col sm:flex-row items-center gap-4 md:justify-center'>
          <div className=' text-center flex flex-col items-center'>
            <Image src={ChatBot} alt='chatbot' width={100} height={100} />
          </div>
          <div className='text-center sm:text-start flex flex-col items-center sm:items-start gap-4'>
            <h3 className='text-lg sm:text-xl md:text-2xl font-bold'>You need help ?</h3>
            <p className='text-xs sm:text-sm md:text-base'>
              Buddy is here to help you 24/7. Click here to chat with Buddy
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default AILink;
