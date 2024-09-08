'use client';
import HelpRequest from '@/components/form/HelpRequest';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();
  return (
    <div className='flex flex-col items-center gap-10 w-full p-4 px-10 md:px-20 h-full mb-10'>
      <h1 className='text-lg sm:text-4xl font-bold text-secondary text-center'>
        Edit your request
      </h1>
      <HelpRequest id='userSlice' idHelpRequest={id} />
    </div>
  );
}
