'use client';
import { setJWT, setUser } from '@/lib/redux/slices/user';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axiosInstance from '@/lib/axiosInstance';
import _ from 'lodash';
import Chat from '@/components/websocket/Chat';
import Navbar from '@/components/macro/Navbar';

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
      if (!user) {
        axiosInstance.get('/user/current').then((res) => {
          dispatch(setUser(res.data));
        });
      }
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
        className={`flex justify-center items-center flex-col h-screen p-4 lg:p-8 ${
          navbarVisible && '!pt-24'
        }`}
      >
        {navbarVisible && renderBreadcrumb()}
        {children}
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
