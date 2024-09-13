import { Card } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Faq from '@/assets/images/faq.svg';
const FaqLink = () => {
  const router = useRouter();
  return (
    <div className='w-full flex flex-row justify-center'>
      <div className='w-full sm:w-2/3 md:w-3/4  cursor-pointer' onClick={() => router.push('/faq')}>
        <Card className='w-full bg-success text-white p-4 px-8 flex flex-col sm:flex-row items-center gap-8 md:justify-center'>
          <div className='text-center sm:text-start flex flex-col items-center sm:items-start gap-2'>
            <h3 className='text-lg sm:text-xl md:text-2xl font-bold'>Any questions ?</h3>
            <p className='text-xs sm:text-sm md:text-base'>
              Click here to get answers to frequently asked questions
            </p>
          </div>
          <div className=' text-center flex flex-col items-center'>
            <Image src={Faq} alt='chatbot' width={100} height={100} />
          </div>
        </Card>
      </div>
    </div>
  );
};
export default FaqLink;
