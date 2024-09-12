import { Card } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Search from '@/assets/images/search.svg';
import Image from 'next/image';
const HelpRequestsLink = () => {
  const router = useRouter();

  return (
    <div className='w-full flex flex-row justify-center'>
      <div
        className='w-full sm:w-2/3 md:w-3/4  cursor-pointer'
        onClick={() => router.push('/help-request/all')}
      >
        <Card className='w-full bg-purple text-white p-4 px-8 flex flex-col sm:flex-row items-center gap-4 md:justify-center'>
          <div className='text-center sm:text-start flex flex-col items-center sm:items-start gap-4'>
            <h3 className='text-lg sm:text-xl md:text-2xl font-bold'>Browse Help Requests</h3>
            <p className='text-xs sm:text-sm md:text-base text-white'>
              Browse all help requests and find the one you can help with
            </p>
          </div>
          <div className=' text-center flex flex-col items-center'>
            <Image src={Search} alt='chatbot' width={100} height={100} className='mx-4' />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpRequestsLink;
