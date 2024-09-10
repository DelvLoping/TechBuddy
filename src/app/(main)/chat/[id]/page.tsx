'use client';

import PeerPage from '@/components/peer/Peer';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();
  return (
    <div className='flex flex-col items-center gap-10 w-full p-4 h-full mb-10'>
      <PeerPage chatId={String(id)} />
    </div>
  );
}
