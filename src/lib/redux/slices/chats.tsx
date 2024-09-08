import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ChatsState } from '../types';
import axiosInstance from '@/lib/axiosInstance';
import { Chat } from '@prisma/client';

const initialState: ChatsState = {
  chats: [],
  error: null,
  loading: false
};

const reloadChats = createAsyncThunk<Chat[], void, { rejectValue: { message: string } }>(
  'chats/reloadChats',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      const response = await axiosInstance.get('/chat');
      return response.data.chats;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue({ message: error.response.data.message });
      } else {
        return rejectWithValue({ message: 'An error occurred while trying to load chats.' });
      }
    } finally {
      dispatch(setLoading(false));
    }
  }
);
export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(reloadChats.fulfilled, (state, action) => {
      state.chats = action.payload;
    });
    builder.addCase(reloadChats.rejected, (state, action) => {
      state.error = action.payload?.message || 'An error occurred while trying to load chats.';
    });
  }
});

export const { setChats, setError, setLoading } = chatsSlice.actions;
export default chatsSlice.reducer;
export { reloadChats };
