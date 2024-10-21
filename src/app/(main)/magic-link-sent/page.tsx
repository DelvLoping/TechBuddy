'use client';

import { setJWT } from '@/lib/redux/slices/user';
import _, { set } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PageContent = () => {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setJWT(token));
      localStorage.setItem('jwt', token);
    }
  }, [token]);

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full p-4 px-10 md:px-20 lg:px-40 xl:px-80 h-full mb-10'>
      <h1 className='text-4xl font-bold text-primary mb-16'>Magic Link Sent</h1>

      <p className='w-full text-center'>
        Check your spam folder if you don't see the email in your inbox.
      </p>
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
