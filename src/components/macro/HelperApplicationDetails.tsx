import { Button } from '@nextui-org/react';
import { HelperApplication, HelpRequest } from '@prisma/client';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { reloadHelperApplication } from '@/lib/redux/slices/helperApplication';
import { toast } from 'react-toastify';

type HelperApplicationDetailsProps = {
  helperApplication: HelperApplication;
};
const HelperApplicationDetails = ({ helperApplication }: HelperApplicationDetailsProps) => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const userReducer = useSelector((state: any) => state.user);
  const { user } = userReducer || {};
  const [helpRequest, setHelpRequest] = useState<HelpRequest | null>(null);
  const { id } = helperApplication || {};
  useEffect(() => {
    const { requestId } = helperApplication || {};
    if (requestId) {
      if (helperApplication.requestId) {
        axiosInstance.get(`/help-request/${requestId}`).then((res) => {
          setHelpRequest(res.data.helpRequest);
        });
      }
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
  const Accept = async () => {
    try {
      const res = await axiosInstance.put(`/helper-application/${id}`, {
        status: 'ACCEPTED'
      });
      dispatch(reloadHelperApplication());
      toast.success('Helper Application Accepted');
    } catch (error) {
      console.log(error);
      toast.error('Error Accepting Helper Application');
    }
  };

  const Reject = async () => {
    try {
      const res = await axiosInstance.put(`/helper-application/${id}`, {
        status: 'REJECTED'
      });
      dispatch(reloadHelperApplication());
      toast.success('Helper Application Rejected');
    } catch (error) {
      console.log(error);
      toast.error('Error Rejecting Helper Application');
    }
  };

  return (
    <div
      key={id + 'HelperApplication'}
      className='flex flex-col p-4 border-b border-gray-300 last:border-none gap-2 '
    >
      <div className='flex flex-row justify-between items-start'></div>
      <p className='text-base '>{helpRequest?.subject}</p>
      <p className='text-sm'>{helpRequest?.description}</p>
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
