'use client';

import AuthForm from '@/components/form/AuthForm';
import { login } from '@/lib/redux/slices/user';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

export default function Page() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const submit = async (formData: any) => {
    if (formData.isMagicLink && !formData.email) {
      return;
    }
    dispatch(login(formData));
    if (formData.isMagicLink) {
      router.push('/magic-link-sent');
    }
  };

  return (
    <div className='flex flex-col items-center gap-10 w-full p-4 px-10 md:px-20 h-full mb-10'>
      <h1 className='text-4xl font-bold text-primary'>Login</h1>
      <p>Welcome back! Please log in to your account.</p>
      <AuthForm id='login' onSubmit={submit} useMagicLink={true} />
    </div>
  );
}
