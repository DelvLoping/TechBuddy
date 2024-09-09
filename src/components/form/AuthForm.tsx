'use client';
import { Button, Checkbox, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { useSelector } from 'react-redux';
import { HELPER, TECHBUDDY } from '@/constant';
import Link from 'next/link';

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
  register = false
}: {
  id: string;
  onSubmit: (formData: any) => Promise<void>;
  register?: boolean;
}) {
  const userReducer = useSelector((state: any) => state.user);
  const { jwt, user, error, loading } = userReducer || {};
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
    onSubmit(formData);
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label='Password'
            type='password'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        {register && (
          <>
            <div className='flex flex-col items-center justify-center gap-4 w-60 mb-4'>
              <Input
                label='First Name'
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />
              <Input
                label='Last Name'
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
              <Input
                label='Age'
                type='number'
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
      <div className='flex flex-row items-start justify-center gap-4 w-full mb-4 flex-wrap'>
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
          <p className='text-center w-full opacity-50'>
            <span className=' opacity-50'>Already have an account?</span>{' '}
            <Link href='/login'>
              <p className='text-primary'>Login</p>
            </Link>
          </p>
        ) : (
          <p className='text-center w-full'>
            <span className=' opacity-50'>Don't have an account?</span>{' '}
            <Link href='/register'>
              <p className='text-primary'>Register</p>
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
