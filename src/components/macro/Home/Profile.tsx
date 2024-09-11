import { getFullNames } from '@/utils';
import { Avatar, Card } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import Logo from '@/assets/techbuddy-logo.svg';
import Image from 'next/image';
const Profile = () => {
  const userReducer = useSelector((state: any) => state.user);
  const { user } = userReducer || {};
  const { email, age, type } = user || {};
  const fullname = getFullNames(user);
  return (
    <div className='w-full flex flex-row justify-center'>
      <Card>
        <div className='p-4 px-8 text-center flex flex-col items-center'>
          <Image
            src={Logo}
            alt='techbuddy-logo'
            width={100}
            height={100}
            className='object-cover'
          />
          <p className='text-primary'>{type}</p>
          <h3 className='text-lg sm:text-xl font-bold text-secondary'>{fullname}</h3>
          <p className='text-sm text-gray-500'>{email}</p>
          {age && <p className='text-secondary'>{age} years old</p>}
        </div>
      </Card>
    </div>
  );
};
export default Profile;
