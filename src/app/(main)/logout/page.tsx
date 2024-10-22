'use client';

import AuthForm from '@/components/form/AuthForm';
import { logout } from '@/lib/redux/slices/user';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Page() {
  const dispatch: any = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setTimeout(() => {
        dispatch(logout());
      }, 2000);
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center gap-20 w-full p-4 px-10 md:px-20 lg:px-40 xl:px-80 h-full mb-10'>
      <h1 className='text-4xl font-bold text-danger text-center'>Logout</h1>
      <p className='w-full text-center'>Goodbye! You have been successfully logged out.</p>
    </div>
  );
}
