'use client';

import axiosInstance from '@/lib/axiosInstance';
import { Button, Input, Spinner } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

const ResetPasswordForm = () => {
  const router = useRouter();
  const token = useSearchParams().get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [send, setSend] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid token');
    }
  }, [token]);

  const submit = async () => {
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/auth/reset-password', { token, newPassword });
      setSend(true);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !newPassword || !confirmPassword || loading || send;

  return (
    <div className='flex flex-col items-center justify-center gap-20 w-full p-4 px-10 md:px-20 lg:px-40 xl:px-80 h-full mb-10'>
      <h1 className='text-4xl font-bold text-danger text-center'>Reset Password</h1>
      {error && <p className='w-full text-center text-danger'>{error}</p>}

      {send ? (
        <div className='flex flex-col items-center justify-center gap-4 w-80 mb-4'>
          <p className='w-full text-center'>Password has been reset successfully.</p>
          <Button
            className='w-full bg-primary text-white font-bold p-2'
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center gap-4 w-80 mb-4'>
          <Input
            label='New password'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label='Confirm password'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          <Button disabled={isButtonDisabled} onClick={submit} className='bg-primary text-white'>
            {loading ? <Spinner color='white' /> : 'Reset Password'}
          </Button>
        </div>
      )}
    </div>
  );
};

const ResetPasswordPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordForm />
  </Suspense>
);

export default ResetPasswordPage;
