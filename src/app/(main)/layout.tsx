'use client';
import { setJWT, setUser } from '@/lib/redux/slices/user';
import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axiosInstance from '@/lib/axiosInstance';
import _ from 'lodash';
import Navbar from '@/components/macro/Navbar';
import { reloadChats, setChats } from '@/lib/redux/slices/chats';
import { Spinner } from '@nextui-org/react';
import { reloadHelpRequests, setHelpRequests } from '@/lib/redux/slices/helpRequests';
import { IoArrowBack } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import { reloadHelperApplication } from '@/lib/redux/slices/helperApplication';
import 'react-toastify/dist/ReactToastify.min.css';
import WebSocketChat from '@/components/websocket/WebSocketChat';
import Link from 'next/link';
import { SocketProvider } from '@/components/websocket/socketContext';
import { WebsocketDaemon } from '@/components/websocket/WebsocketDaemon';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const useReducer = useSelector((state: any) => state.user);
  const { jwt: jwtRedux, user } = useReducer;
  const dispatch: any = useDispatch();
  const publicPathnames = ['/login', '/register', '/logout', '/forgot-password', '/reset-password'];

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt && !jwtRedux) {
      dispatch(setJWT(jwt));
    }
    if (publicPathnames.includes(pathname)) {
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
    }
  }, [user, pathname, jwtRedux]);

  useEffect(() => {
    if (user) {
      console.log('user', user, user.emailVerified, pathname, pathname !== '/verify-email');
      if (user.emailVerified) {
        dispatch(reloadChats());
        dispatch(reloadHelpRequests());
        dispatch(reloadHelperApplication());
      } else if (pathname !== '/verify-email') {
        router.push('/verify-email');
      }
    }
  }, [user]);

  const navbarVisible =
    !publicPathnames.includes(pathname) && pathname !== '/chat-ai' && pathname !== '/verify-email';

  const pathSegments = pathname.split('/').filter((segment) => segment);

  const goBack = () => {
    if (pathSegments.length < 1) return null;

    return (
      <div
        className='w-full flex flex-row items-center ms-2 mb-4 cursor-pointer text-primary gap-1 font-semibold'
        onClick={() => router.back()}
      >
        <IoArrowBack className='stroke-2' />
        <p>Back</p>
      </div>
    );
  };

  return (
    <>
      <header>
        <title>TechBuddy</title>
        <meta name='description' content='TechBuddy' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
      </header>

      <SocketProvider>
        <WebsocketDaemon />
        <div className='min-h-screen flex flex-col h-full justify-between'>
          {navbarVisible && <Navbar />}
          <div
            className={`flex justify-center items-center flex-col p-4 lg:p-8 ${
              navbarVisible ? '!pt-28' : 'h-screen'
            }`}
          >
            {navbarVisible && goBack()}
            {navbarVisible && _.isEmpty(user) ? <Spinner color='primary' /> : children}
            {navbarVisible && <WebSocketChat isShow={false} />}
          </div>
          <ToastContainer />
          <footer
            className={`${
              !navbarVisible && 'hidden'
            } w-full bg-primary border-t border-gray-200 p-4 text-center mt-auto `}
          >
            <div className='flex flex-col gap-4 justify-center'>
              <div className='w-full flex flex-row justify-center gap-4 text-white p-4 whitespace-nowrap flex-wrap'>
                <Link href='/'>Home</Link> |
                <Link href='/terms-and-conditions'>Terms and Conditions</Link> |
                <Link href='/privacy-policy'>Privacy Policy</Link> |
                <Link href='/cookie'>Cookie</Link>
              </div>
              <p className='text-white'>TechBuddy © {moment().format('YYYY')}</p>
            </div>
          </footer>
        </div>
      </SocketProvider>
    </>
  );
}
