import React, { useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { useDispatch, useSelector } from 'react-redux';
import { reloadHelperApplication } from '@/lib/redux/slices/helperApplication';
import { reloadHelpRequests } from '@/lib/redux/slices/helpRequests';
import { reloadChats } from '@/lib/redux/slices/chats';

export const WebsocketDaemon = () => {
  const socket = useSocket();
  const userReducer = useSelector((state: any) => state.user);
  const { user } = userReducer || {};
  const dispatch: any = useDispatch();

  useEffect(() => {
    if (user) {
      socket.emit('registerUser', user.id);

      socket.on('update', () => {
        dispatch(reloadHelperApplication());
        dispatch(reloadHelpRequests());
        dispatch(reloadChats());
      });
    }

    return () => {
      socket && socket.disconnect();
    };
  }, [user]);

  return <></>;
};
