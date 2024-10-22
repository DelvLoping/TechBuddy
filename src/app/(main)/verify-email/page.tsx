'use client';

import axiosInstance from '@/lib/axiosInstance';
import { Button, Spinner } from '@nextui-org/react';
import _, { set } from 'lodash';
import moment from 'moment';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';

const PageContent = () => {
  const userReducer = useSelector((state: any) => state.user);
  const { user } = userReducer || {};
  const token = useSearchParams().get('token');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!_.isEmpty(user) && user.emailVerified) {
      router.push('/');
      return;
    }
    if (token) {
      verifyEmail();
    }
  }, [user, token]); // Add token to dependencies

  const verifyEmail = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/auth/verify-email', { token });
      setSuccess(true);
    } catch (error: any) {
      // Type error correctly
      if (error.response && error.response.data.message === 'Invalid token') {
        setError('Invalid token');
      } else {
        console.error('Error verifying email:', error); // Log unexpected errors
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full p-4 px-10 md:px-20 lg:px-40 xl:px-80 h-full mb-10'>
      {!error && !success && (
        <>
          <h1 className='text-4xl font-bold text-primary mb-16 text-center'> Verify Email</h1>
          {loading ? (
            <Spinner size='lg' className='text-primary' />
          ) : (
            <p className='w-full text-center text-purple font-bold'>
              Check your spam folder if you don't see the email in your inbox.
            </p>
          )}
        </>
      )}
      {error && !success && (
        <h1 className='text-4xl font-bold text-danger mb-16 text-center'>{error}</h1>
      )}
      {success ? (
        <h1 className='text-4xl font-bold text-success mb-16 text-center'>Email verified</h1>
      ) : (
        !loading && (
          <>
            <p className='w-full text-center text-sm'>
              If you still don't see the email or if the link has expired, you can request a new
              one.
            </p>
            <Button
              disabled={disableButton}
              className='bg-primary text-white font-bold p-2 mt-10'
              onClick={() => {
                axiosInstance
                  .post('/auth/resend-verification-email', { token })
                  .then(() => {
                    setDisableButton(true);
                    setTimeout(() => {
                      setDisableButton(false);
                    }, 60000);
                  })
                  .catch((err) => {
                    console.error('Error requesting new email:', err); // Log error
                  });
              }}
            >
              Request new email
            </Button>
          </>
        )
      )}
      {disableButton && (
        <p className='w-full text-center text-secondary'>
          You can request a new email in 60 seconds
        </p>
      )}
      {success && (
        <Button
          onClick={() => {
            router.push('/');
          }}
          className='bg-primary text-white font-bold p-2 mt-10'
        >
          Go to homepage
        </Button>
      )}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
