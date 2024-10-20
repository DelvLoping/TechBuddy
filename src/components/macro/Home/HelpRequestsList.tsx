import { Button, Card } from '@nextui-org/react';
import { HelpRequest } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import _ from 'lodash';
import HelpRequestDetails from '@/components/macro/HelpRequestDetails';

type HelpRequestsListProps = {
  helpRequests: HelpRequest[];
  isTechBuddy: boolean;
};
const HelpRequestsList = ({ helpRequests, isTechBuddy }: HelpRequestsListProps) => {
  const router = useRouter();
  return (
    <div className='w-full flex flex-col sm:flex-row justify-center gap-4'>
      <div className='w-full sm:w-2/3 md:w-3/4'>
        <Card>
          <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-row justify-between items-center'>
              <h3 className='text-lg sm:text-2xl text-primary font-bold'>
                {isTechBuddy ? 'Your Help Requests' : 'Help Requests applied'}
              </h3>
              {isTechBuddy && (
                <Button
                  className='bg-primary text-white p-2 w-fit rounded-xl flex flex-row items-center justify-center h-fit text-sm:text-base'
                  onClick={() => router.push('/help-request')}
                >
                  <FaPlus className='text-white h-4 w-4 sm:h-5 sm:w-5' />
                  Add new
                </Button>
              )}
            </div>
            {_.isEmpty(helpRequests) ? (
              <div className='flex flex-row justify-center items-center opacity-50'>
                <p className='text-sm sm:text-base'>No Help Requests</p>
              </div>
            ) : (
              _.map(helpRequests, (request: HelpRequest) => (
                <HelpRequestDetails key={request.id} helpRequest={request} />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
export default HelpRequestsList;
