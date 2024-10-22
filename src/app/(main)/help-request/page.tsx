'use client';
import HelpRequest from '@/components/form/HelpRequest';
import HelpImage from '@/assets/images/help.svg';
import Image from 'next/image';
export default function Page() {
  return (
    <div className='flex flex-col items-center w-full gap-10 p-4 px-10 md:px-20 h-full mb-10'>
      <h1 className='text-4xl font-bold text-secondary text-center'>Request</h1>
      <p>Need Help</p>
      <div className='flex flex-col sm:flex-row items-center w-full gap-8 lg:px-20'>
        <div className='flex flex-col gap-10 w-full'>
          <HelpRequest id='userSlice' />
        </div>
        <div className='flex flex-col w-full'>
          <Image src={HelpImage} alt='help' width={500} height={500} className='w-full lg:p-16' />
        </div>
      </div>
    </div>
  );
}
