'use client';

import HelpRequestDetails from '@/components/macro/HelpRequestDetails';
import { getFullNames } from '@/utils';
import { Avatar, Button, Card } from '@nextui-org/react';
import { HelpRequest } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import HelperApplicationList from '@/components/macro/Home/HelperApplicationsList';
import HelpRequestsLink from '@/components/macro/Home/HelpRequestsLink';
import AILink from '@/components/macro/Home/AiLink';
import HelpRequestsList from '@/components/macro/Home/HelpRequestsList';
import Profile from '@/components/macro/Home/Profile';
import HomeHelper from '@/components/macro/Home/HomeHelper';
import HomeTechBuddy from '@/components/macro/Home/HomeTechBuddy';

export default function Dashboard() {
  const userReducer = useSelector((state: any) => state.user);
  const helperApplicationReducer = useSelector((state: any) => state.helperApplication);
  const { helperApplication } = helperApplicationReducer || {};
  const { user } = userReducer || {};
  const { type } = user || {};
  const helpRequestsReducer = useSelector((state: any) => state.helpRequests);
  const { helpRequests } = helpRequestsReducer || {};
  const isTechBuddy = type === 'TECHBUDDY';
  return (
    <div className='w-full flex flex-col'>
      <div className='flex flex-col gap-8 w-full'>
        {isTechBuddy ? (
          <HomeTechBuddy helpRequests={helpRequests} helperApplication={helperApplication} />
        ) : (
          <HomeHelper helpRequests={helpRequests} />
        )}
      </div>
    </div>
  );
}
