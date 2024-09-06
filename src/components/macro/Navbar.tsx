import { getFullNames } from '@/utils';
import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { FaPowerOff } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const router = useRouter();
  const useReducer = useSelector((state) => state.user);
  const { user } = useReducer || {};
  const fullName = getFullNames(user);
  return (
    <div className='w-full bg-white fixed px-4 pt-4 z-50'>
      <div className=' bg-white flex justify-between items-center shadow-md p-4 rounded-lg top-6 left-4 lg:left-8 border border-gray-200 gap-4 '>
        <FaHome onClick={() => router.push('/')} className='cursor-pointer text-primary h-8 w-8' />
        <h1 className='text-base sm:text-lg font-semibold opacity-80 text-center truncate'>
          Welcome, {fullName}
        </h1>
        <FaPowerOff
          onClick={() => router.push('/logout')}
          className='cursor-pointer text-danger h-7 w-7'
        />
      </div>
    </div>
  );
};
export default Navbar;
