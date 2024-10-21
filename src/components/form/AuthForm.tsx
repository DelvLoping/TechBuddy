'use client';
import { Button, Checkbox, Input, Switch } from '@nextui-org/react';
import React, { useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { useSelector } from 'react-redux';
import { HELPER, TECHBUDDY } from '@/constant';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface IformData {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  age?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  type?: string;
}

export default function AuthForm({
  id,
  onSubmit,
  register = false,
  useMagicLink = false
}: {
  id: string;
  onSubmit: (formData: any) => Promise<void>;
  register?: boolean;
  useMagicLink?: boolean;
}) {
  const router = useRouter();
  const userReducer = useSelector((state: any) => state.user);
  const { jwt, user, error, loading } = userReducer || {};
  const [isMagicLink, setIsMagicLink] = useState(useMagicLink);
  const [formData, setFormData] = useState<IformData>({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    age: undefined,
    address: {
      street: undefined,
      city: undefined,
      country: undefined,
      postalCode: undefined
    },
    type: undefined
  });
  const submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit(isMagicLink ? { email: formData.email, isMagicLink } : formData);
    if (isMagicLink) {
      router.push('/magic-link-sent');
    }
  };

  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.checked ? HELPER : TECHBUDDY;
    setFormData({ ...formData, type });
  };

  return (
    <form id={id}>
      <div className='flex flex-row items-start justify-center gap-4 w-full mb-4 flex-wrap'>
        <div className='flex flex-col items-center justify-center gap-4 w-60 mb-4'>
          <Input
            label='Email'
            type='email'
            size='lg'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {!isMagicLink && (
            <Input
              label='Password'
              size='lg'
              type='password'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          )}
          {!register && (
            <div className='flex flex-row items-start justify-center gap-4 w-full mb-4 flex-wrap'>
              <Switch isSelected={isMagicLink} onChange={() => setIsMagicLink(!isMagicLink)}>
                Login with Magic Link ?
              </Switch>
            </div>
          )}
        </div>
        {register && (
          <>
            <div className='flex flex-col items-center justify-center gap-4 w-60 mb-4'>
              <Input
                label='First Name'
                size='lg'
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />
              <Input
                label='Last Name'
                size='lg'
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
              <Input
                label='Age'
                type='number'
                size='lg'
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </>
        )}
      </div>
      <div className='flex flex-row items-start justify-center gap-4 w-full mb-4 flex-wrap'>
        {register && (
          <Checkbox isSelected={formData.type === HELPER} onChange={handleChangeCheckbox}>
            I am an Helper
          </Checkbox>
        )}
      </div>
      {formData.type === HELPER && (
        <>
          <div className='flex flex-row items-start justify-center gap-4 w-full mb-4 flex-wrap'>
            <h2>Address</h2>
          </div>
          <div className='flex flex-row items-start justify-center gap-4 w-full mb-4 flex-wrap'>
            <div className='flex flex-col items-center justify-center gap-4 w-60 mb-4'>
              <Input
                label='Street'
                size='lg'
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })
                }
              />
              <Input
                label='City'
                size='lg'
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })
                }
              />
            </div>
            <div className='flex flex-col items-center justify-center gap-4 w-60 mb-4'>
              <Input
                label='Country'
                size='lg'
                value={formData.address.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value }
                  })
                }
              />
              <Input
                label='Zip'
                size='lg'
                value={formData.address.postalCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      postalCode: e.target.value
                    }
                  })
                }
              />
            </div>
          </div>
        </>
      )}
      <div className='flex flex-col items-center justify-center gap-4 w-full mb-4 flex-wrap'>
        {error && <p className='w-full text-danger text-center'>{error}</p>}
        <Button
          type='submit'
          disabled={loading}
          className='min-w-24 w-[20vw] bg-primary text-white mt-8 font-bold p-2'
          onClick={submit}
        >
          {loading ? <Spinner color='white' /> : 'Submit'}
        </Button>
        {register ? (
          <p className='text-center w-full'>
            <span className=' opacity-50'>Already have an account?</span>{' '}
            <Link href='/login'>
              <p className='text-primary'>Login</p>
            </Link>
          </p>
        ) : (
          <div className='flex flex-row gap-2 items-center'>
            <Link href='/register'>
              <p className='text-primary'>Register</p>
            </Link>{' '}
            /
            <Link href='/forgot-password'>
              <p className='text-secondary'>Forgot Password</p>
            </Link>
          </div>
        )}
      </div>
    </form>
  );
}
