import { Button } from '@nextui-org/react';
import { HelpRequest } from '@prisma/client';
import moment from 'moment';
import { FaCheckCircle, FaPen } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import axiosInstance from '@/lib/axiosInstance';
import { reloadHelpRequests } from '@/lib/redux/slices/helpRequests';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { formatAddress } from '@/utils';
import _ from 'lodash';

type HelpRequestDetailsProps = {
  helpRequest: HelpRequest;
};
const HelpRequestDetails = ({ helpRequest }: HelpRequestDetailsProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userReducer = useSelector((state) => state.user);
  const { user } = userReducer || {};
  const {
    id,
    userId,
    subject,
    description,
    requestDate,
    status,
    reward,
    interventionDate,
    interventionType,
    interventionAddress
  } = helpRequest;
  let color = '';
  switch (helpRequest.status) {
    case 'OPEN':
      color = 'text-primary';
      break;
    case 'COMPLETED':
      color = 'text-success';
      break;
    case 'IN_PROGRESS':
      color = 'text-warning';
      break;
  }
  const deleteHelpRequest = async () => {
    try {
      await axiosInstance.delete(`/help-request/${id}`);
      dispatch(reloadHelpRequests());
      toast.success('Help request deleted successfully');
    } catch (error) {
      toast.error('Failed to delete help request');
    }
  };

  const markAsCompleted = async () => {
    try {
      await axiosInstance.put(`/help-request/${id}`, { status: 'COMPLETED' });
      dispatch(reloadHelpRequests());
      toast.success('Help request marked as completed');
    } catch (error) {
      toast.error('Failed to mark help request as completed');
    }
  };

  return (
    <div
      key={id + 'HelpRequest'}
      className='flex flex-col p-4 border-b border-gray-300 last:border-none gap-2'
    >
      <div className='flex justify-between items-start'>
        <h4 className='text-base sm:text-xl font-semibold leading-none'>{subject}</h4>
        <p className='text-xs sm:text-sm text-gray-500 text-nowrap'>
          {moment(requestDate).format('ll')}
        </p>
      </div>
      <p className='text-sm sm:text-base text-secondary'>{description}</p>
      <p className='text-sm sm:text-base'>
        <span className='underline'>Status</span> : <span className={`${color}`}>{status}</span>
      </p>
      {reward && (
        <p className='text-sm sm:text-base'>
          <span className='italic text-gray-500'>Reward</span> : {reward}
        </p>
      )}
      {user.id === userId && (
        <>
          <p className='text-sm sm:text-base'>
            <span className=''>Intervention Date</span> : {moment(interventionDate).format('ll')}
          </p>
          <p className='text-sm sm:text-base'>
            <span className=''>Intervention Type</span> :{' '}
            <span className='font-semibold'>{interventionType}</span>
          </p>
          {interventionType === 'IN_PERSON' && !_.isEmpty(interventionAddress) && (
            <p className='text-sm sm:text-base'>
              <span className=''>Intervention Address</span> : {formatAddress(interventionAddress)}
            </p>
          )}
          <div className='flex flex-row items-center justify-between sm:justify-end w-full gap-2'>
            <Button
              className='bg-danger text-white p-2 w-fit rounded-xl flex flex-col items-center justify-center h-fit text-sm:text-base'
              onClick={deleteHelpRequest}
            >
              <MdDelete className='h-4 w-4 sm:h-5 sm:w-5' />
              Delete
            </Button>
            {helpRequest.status === 'COMPLETED' ? null : (
              <Button
                className='bg-success text-white p-2 w-fit rounded-xl flex flex-col items-center justify-center h-fit text-sm:text-base'
                onClick={markAsCompleted}
              >
                <FaCheckCircle className='text-white h-4 w-4 sm:h-5 sm:w-5' />
                Complete
              </Button>
            )}
            <Button
              className='bg-primary text-white p-2 w-fit rounded-xl flex flex-col items-center justify-center h-fit text-sm:text-base'
              onClick={() => router.push(`/help-request/${id}`)}
            >
              <FaPen className='h-4 w-4 sm:h-5 sm:w-5' />
              Edit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default HelpRequestDetails;
