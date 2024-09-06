'use client';
import { setJWT, setUser } from '@/lib/redux/slices/user';
import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axiosInstance from '@/lib/axiosInstance';
import _ from 'lodash';
import Chat from '@/components/websocket/Chat';
import Navbar from '@/components/macro/Navbar';
import { setChats } from '@/lib/redux/slices/chats';
import { Spinner } from '@nextui-org/react';
import { setHelpRequests } from '@/lib/redux/slices/helpRequests';
import { IoArrowBack } from 'react-icons/io5';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const useReducer = useSelector((state) => state.user);
  const { jwt: jwtRedux, user } = useReducer;
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt && !jwtRedux) {
      dispatch(setJWT(jwt));
    }
    if (pathname === '/login' || pathname === '/register') {
      if (jwt) {
        router.push('/');
      }
    } else {
      if (!jwt) {
        router.push('/login');
      }
    }
  }, [useReducer, pathname]);

  useEffect(() => {
    if (!user && jwtRedux) {
      axiosInstance.get('/user/current').then((res) => {
        dispatch(setUser(res.data));
      });
      axiosInstance.get('/chat').then((res) => {
        dispatch(setChats(res.data.chats));
      });
      axiosInstance.get('/help-request').then((res) => {
        dispatch(setHelpRequests(res.data.helpRequests));
      });
    }
  }, [user, pathname, jwtRedux]);

  const navbarVisible = pathname !== '/login' && pathname !== '/register' && pathname !== '/logout';

  const pathSegments = pathname.split('/').filter((segment) => segment);

  const renderBreadcrumb = () => {
    if (pathSegments.length < 2) return null;

    const breadcrumb = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;
      return (
        <span key={href} className={`mr-2 text-primary ${isLast && 'font-bold'}`}>
          {!isLast ? (
            <a href={href} className='hover:underline'>
              {segment}
            </a>
          ) : (
            segment
          )}
          {!isLast && ' / '}
        </span>
      );
    });

    return <div className='w-full flex flex-row items-start ms-2 mb-4'>{breadcrumb}</div>;
  };

  return (
    <div className='min-h-screen flex flex-col h-full'>
      {navbarVisible && <Navbar />}
      <div
        className={`flex justify-center items-center flex-col p-4 lg:p-8 ${
          navbarVisible ? '!pt-24' : 'h-screen'
        }`}
      >
        {navbarVisible && renderBreadcrumb()}
        {navbarVisible && _.isEmpty(user) ? <Spinner color='primary' /> : children}
        {navbarVisible && <Chat isShow={false} />}
      </div>
      <footer
        className={`${
          !navbarVisible && 'hidden'
        } w-full bg-primary border-t border-gray-200 p-4 text-center mt-auto`}
      >
        <p className='text-white'>TechBuddy © {moment().format('YYYY')}</p>
      </footer>
    </div>
  );
}
