'use client';
import { useSelector } from 'react-redux';
import _ from 'lodash';
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
