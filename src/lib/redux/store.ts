import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import chatsReducer from './slices/chats';
import helpRequests from './slices/helpRequests';
import helperApplication from './slices/helperApplication';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer,
    helpRequests: helpRequests,
    helperApplication: helperApplication
  }
});

// Infer the types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
