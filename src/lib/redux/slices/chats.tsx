import { createSlice } from "@reduxjs/toolkit";
import { ChatsState } from "../types";

const initialState: ChatsState = {
  chats: [],
  error: null,
  loading: false,
};

export const chatsSlice = createSlice({
  name: "chats",
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
    },
  },
});

export const { setChats, setError, setLoading } = chatsSlice.actions;
export default chatsSlice.reducer;
