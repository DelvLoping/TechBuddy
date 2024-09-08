'use client';

import HelpRequestDetails from '@/components/macro/HelpRequestDetails';
import { getFullNames } from '@/utils';
import { Avatar, Button, Card } from '@nextui-org/react';
import { HelpRequest } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const userReducer = useSelector((state) => state.user);
  const { user } = userReducer || {};
  const { lastname, firstname, email, age, type } = user || {};
  const fullname = getFullNames(user);
  const helpRequestsReducer = useSelector((state) => state.helpRequests);
  const { helpRequests } = helpRequestsReducer || {};
  const router = useRouter();
  return (
    <div className='w-full flex flex-col min-h-screen'>
      <div className='flex flex-col gap-8 w-full'>
        <div className='w-full flex flex-row justify-center'>
          <Card>
            <div className='p-4 px-8 text-center flex flex-col items-center'>
              <Avatar text={`${firstname?.[0]}${lastname?.[0]}`} size='xl' className='mb-4' />
              <p className='text-primary'>{type}</p>
              <h3 className='text-lg sm:text-xl font-bold text-secondary'>{fullname}</h3>
              <p className='text-sm text-gray-500'>{email}</p>
              {age && <p className='text-secondary'>{age} years old</p>}
            </div>
          </Card>
        </div>
        <div className='w-full flex flex-col sm:flex-row justify-center gap-4'>
          <div className='w-full sm:w-2/3 md:w-3/4'>
            <Card>
              <div className='flex flex-col gap-4 p-4'>
                <div className='flex flex-row justify-between items-center'>
                  <h3 className='text-lg sm:text-2xl text-black/80 font-bold'>
                    Your help Requests
                  </h3>
                  <Button
                    className='bg-primary text-white p-2 w-fit rounded-xl flex flex-row items-center justify-center h-fit text-sm:text-base'
                    onClick={() => router.push('/help-request')}
                  >
                    <FaPlus className='text-white h-4 w-4 sm:h-5 sm:w-5' />
                    Add new
                  </Button>
                </div>
                {helpRequests.map((request: HelpRequest) => (
                  <HelpRequestDetails key={request.id} helpRequest={request} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
