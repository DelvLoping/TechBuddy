'use client';

import axiosInstance from '@/lib/axiosInstance';
import { Button, Input, Spinner } from '@nextui-org/react';
import _ from 'lodash';
import { useEffect, useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [send, setSend] = useState(false);

  const submit = async () => {
    if (!email) {
      return;
    }
    try {
      await axiosInstance.post('/auth/send-reset-password', { email });
    } catch (error) {
      console.error(error);
    }
    setSend(true);
  };

  return (
    <div className='flex flex-col items-center justify-center gap-20 w-full p-4 px-10 md:px-20 lg:px-40 xl:px-80 h-full mb-10'>
      <h1 className='text-4xl font-bold text-danger text-center'>Forgot Password</h1>
      {send ? (
        <div className='flex flex-col items-center justify-center gap-4 w-80 mb-4'>
          <p className='w-full text-center'>Password reset link has been sent to your email.</p>
        </div>
      ) : (
        <>
          <p className='w-full text-center'>
            Enter your email address to receive a password reset link.
          </p>

          <div className='flex flex-col items-center justify-center gap-4 w-80 mb-4'>
            <Input
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <br />
            <Button
              disabled={send}
              onClick={submit}
              className='w-full bg-primary text-white font-bold p-2'
            >
              Send email
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
