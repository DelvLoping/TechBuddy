import { createSlice } from '@reduxjs/toolkit';
import { ChatsState } from '../types';

const initialState: ChatsState = {
  chats: []
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    }
  }
});

export const { setChats } = chatsSlice.actions;
export default chatsSlice.reducer;
