import { Button } from '@nextui-org/react';
import { Address, Chat, HelperApplication, HelpRequest } from '@prisma/client';
import moment from 'moment';
import { FaCheck, FaCheckCircle, FaCross, FaPen } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import axiosInstance from '@/lib/axiosInstance';
import { reloadHelpRequests } from '@/lib/redux/slices/helpRequests';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { formatAddress } from '@/utils';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { MdAdsClick } from 'react-icons/md';
import { reloadHelperApplication } from '@/lib/redux/slices/helperApplication';

type HelpRequestDetailsProps = {
  helpRequest: HelpRequest & {
    interventionAddress?: Address | null;
  };
};
const HelpRequestDetails = ({ helpRequest }: HelpRequestDetailsProps) => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const helperApplicationReducer = useSelector((state: any) => state.helperApplication);
  const { helperApplication } = helperApplicationReducer || {};
  const userReducer = useSelector((state: any) => state.user);
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
  const [chat, setChat] = useState<Chat | null>(null);
  const isOwner = user.id === userId;
  useEffect(() => {
    if (id) {
      axiosInstance.get(`/chat?helpRequestId=${id}`).then((res) => {
        if (res.data) {
          setChat(res.data.chats[0]);
        }
      });
    }
  }, [id]);

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
  const apply = async () => {
    try {
      await axiosInstance.post(`/helper-application`, { requestId: id });
      toast.success('Applied successfully');
      dispatch(reloadHelperApplication());
    } catch (error) {
      toast.error('Failed to apply');
    }
  };

  const helperApplied = _.find(
    helperApplication,
    (application: HelperApplication) => application.requestId === id
  );
  const isAlreadyApplied = helperApplied && helperApplied.helperId === user.id;

  const renderAplly = () => {
    switch (helperApplied.status) {
      case 'PROPOSED':
        return <div className='text-primary flex flex-row items-center gap-2'>Applied</div>;
      case 'ACCEPTED':
        return (
          <div className='text-success flex flex-row items-center gap-2'>
            Accepted
            <FaCheck className='h-4 w-4 sm:h-5 sm:w-5' />
          </div>
        );
      case 'REJECTED':
        return (
          <div className='text-danger flex flex-row items-center gap-2'>
            Rejected
            <FaCross className='h-4 w-4 sm:h-5 sm:w-5' />
          </div>
        );
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
      {interventionType === 'VIRTUAL' && chat && (
        <div className='flex flex-row items-center justify-center sm:justify-end w-full gap-2'>
          <Button
            className='bg-white text-primary border border-primary p-2 w-fit rounded-xl flex flex-col items-center justify-center h-fit text-sm:text-base'
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <HiOutlineVideoCamera className='h-4 w-4 sm:h-5 sm:w-5' />
            Intervention Meet
          </Button>
        </div>
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
          {isOwner && (
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
          )}
        </>
      )}
      {!isOwner && user.type !== 'TECHBUDDY' && (
        <div className='flex flex-row items-center justify-center w-full gap-2'>
          {isAlreadyApplied ? (
            <div className='text-sm sm:text-base text-success flex flex-row items-center gap-2'>
              {renderAplly()}
            </div>
          ) : (
            <Button
              className='bg-primary text-white p-2 w-fit rounded-xl flex flex-col items-center justify-center h-fit text-sm:text-base'
              onClick={apply}
            >
              <MdAdsClick className='h-4 w-4 sm:h-5 sm:w-5' />
              Apply
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default HelpRequestDetails;
