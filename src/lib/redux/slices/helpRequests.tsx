import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HelpRequestsState } from '../types';
import axiosInstance from '@/lib/axiosInstance';
import { HelpRequest } from '@prisma/client';

const initialState: HelpRequestsState = {
  helpRequests: [],
  error: null,
  loading: false
};

const reloadHelpRequests = createAsyncThunk<
  HelpRequest[],
  void,
  { rejectValue: { message: string } }
>('helpRequests/reloadHelpRequests', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setError(null));
    dispatch(setLoading(true));
    const response = await axiosInstance.get('/help-request');
    return response.data.helpRequests;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue({ message: error.response.data.message });
    } else {
      return rejectWithValue({ message: 'An error occurred while trying to load help requests.' });
    }
  } finally {
    dispatch(setLoading(false));
  }
});
export const helpRequestsSlice = createSlice({
  name: 'helpRequests',
  initialState,
  reducers: {
    setHelpRequests: (state, action) => {
      state.helpRequests = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(reloadHelpRequests.fulfilled, (state, action) => {
      state.helpRequests = action.payload;
    });
    builder.addCase(reloadHelpRequests.rejected, (state, action) => {
      state.error =
        action.payload?.message || 'An error occurred while trying to load help requests.';
    });
  }
});

export const { setHelpRequests, setError, setLoading } = helpRequestsSlice.actions;
export default helpRequestsSlice.reducer;
export { reloadHelpRequests };
