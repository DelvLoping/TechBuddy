'use client';

import { setJWT } from '@/lib/redux/slices/user';
import { Spinner } from '@nextui-org/react';
import _ from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PageContent = () => {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const dispatch = useDispatch();
  const userReducer = useSelector((state: any) => state.user);
  const { error, loading } = userReducer || {};

  useEffect(() => {
    if (token) {
      dispatch(setJWT(token));
      localStorage.setItem('jwt', token);
    }
  }, [token]);

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full p-4 px-10 md:px-20 lg:px-40 xl:px-80 h-full mb-10'>
      <h1 className='text-4xl font-bold text-primary mb-16 text-center'>
        Magic Link {error ? '' : loading ? 'Sending' : 'Sent'}
      </h1>

      {!error && !loading && (
        <p className='w-full text-center'>
          Check your spam folder if you don't see the email in your inbox.
        </p>
      )}
      {error &&
        (error.includes('Invalid credentials') ? (
          <p className='w-full text-danger text-center'>
            you might have entered an incorrect email address or have not signed
          </p>
        ) : (
          <p className='w-full text-danger text-center'>{error}</p>
        ))}

      {loading && <Spinner color='primary' />}
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
