'use client';
import HelpRequestDetails from '@/components/macro/HelpRequestDetails';
import axiosInstance from '@/lib/axiosInstance';
import { HelpRequest } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Card } from '@nextui-org/react';

export default function Page() {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);

  useEffect(() => {
    axiosInstance.get('/help-request').then((res) => {
      setHelpRequests(res.data.helpRequests);
    });
  }, []);
  return (
    <div className='flex flex-col items-center gap-10 w-full p-4 px-10 md:px-20 h-full mb-10'>
      <h1 className='text-lg sm:text-4xl font-bold text-secondary'>Requests</h1>
      <Card className='w-full flex flex-col gap-4 p-4'>
        {_.map(helpRequests, (request) => (
          <HelpRequestDetails key={request.id} helpRequest={request} />
        ))}
      </Card>
    </div>
  );
}
