import { HelperApplication } from '@prisma/client';
import _ from 'lodash';
import HelperApplicationDetails from '@/components/macro/HelperApplicationDetails';
import { Card } from '@nextui-org/react';

type HelperApplicationListProps = {
  helperApplication: HelperApplication[];
};
const HelperApplicationList = ({ helperApplication }: HelperApplicationListProps) => {
  return (
    <div className='w-full flex flex-col sm:flex-row justify-center gap-4'>
      <div className='w-full sm:w-2/3 md:w-3/4'>
        <Card>
          <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-row justify-between items-center'>
              <h3 className='text-lg sm:text-2xl text-secondary font-bold'>Helper Applications</h3>
            </div>
            {_.map(helperApplication, (request: HelperApplication) => (
              <HelperApplicationDetails key={request.id} helperApplication={request} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
export default HelperApplicationList;
