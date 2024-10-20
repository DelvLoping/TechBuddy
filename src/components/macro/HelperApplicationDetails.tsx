import { Button } from '@nextui-org/react';
import { HelperApplication, HelpRequest, User } from '@prisma/client';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { reloadHelperApplication } from '@/lib/redux/slices/helperApplication';
import { toast } from 'react-toastify';
import { getFullNames } from '@/utils';
import { useSocket } from '../websocket/socketContext';

type HelperApplicationDetailsProps = {
  helperApplication: HelperApplication & { helper?: User };
};
const HelperApplicationDetails = ({ helperApplication }: HelperApplicationDetailsProps) => {
  const dispatch: any = useDispatch();
  const [helpRequest, setHelpRequest] = useState<HelpRequest | null>(null);
  const { id, helper } = helperApplication || {};
  const fullname = getFullNames(helper);
  const userReducer = useSelector((state: any) => state.user);
  const { user } = userReducer || {};
  const { requestId } = helperApplication || {};
  const socket = useSocket();

  useEffect(() => {
    if (requestId) {
      axiosInstance.get(`/help-request/${requestId}`).then((res) => {
        setHelpRequest(res.data.helpRequest);
      });
    }
  }, [helperApplication]);

  let color = '';
  switch (helperApplication.status) {
    case 'PROPOSED':
      color = 'text-primary';
      break;
    case 'ACCEPTED':
      color = 'text-success';
      break;
    case 'REJECTED':
      color = 'text-danger';
      break;
  }

  const handleEmitUpdate = async () => {
    const relatedUserIds = [helpRequest.userId, helperApplication.helperId];
    socket.emit('sendUpdate', relatedUserIds);
  };

  const Accept = async () => {
    try {
      await axiosInstance.put(`/helper-application/${id}`, {
        status: 'ACCEPTED'
      });
      handleEmitUpdate();
      toast.success('Helper Application Accepted');
    } catch (error) {
      toast.error('Error Accepting Helper Application');
    }
  };

  const Reject = async () => {
    try {
      await axiosInstance.put(`/helper-application/${id}`, {
        status: 'REJECTED'
      });
      handleEmitUpdate();
      toast.success('Helper Application Rejected');
    } catch (error) {
      toast.error('Error Rejecting Helper Application');
    }
  };

  return (
    <div
      key={id + 'HelperApplication'}
      className='flex flex-col p-4 border-b border-gray-300 last:border-none gap-2 '
    >
      <div className='flex flex-row justify-between items-start'></div>
      <h1 className='text-lg font-bold'>
        {fullname} <span className='font-normal'>want to help you!</span>
      </h1>
      <p className='text-base '>{helpRequest?.subject}</p>
      <p className={`text-sm ${color}`}>{helperApplication.status}</p>
      {helperApplication.status === 'PROPOSED' && (
        <div className='flex flex-row w-full justify-end items-end'>
          <div className='flex flex-row gap-2 items-center'>
            <Button
              className='bg-primary text-white cursor-pointer py-2 px-4 rounded-xl'
              onClick={Accept}
            >
              Accept
            </Button>
            <Button
              className='bg-danger text-white cursor-pointer py-2 px-4 rounded-xl'
              onClick={Reject}
            >
              Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default HelperApplicationDetails;
