import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';
import { HelperApplication } from '@prisma/client';
import { helperApplicationState } from '../types';

const initialState: helperApplicationState = {
  helperApplication: [],
  error: null,
  loading: false
};

const reloadHelperApplication = createAsyncThunk<
  HelperApplication[],
  void,
  { rejectValue: { message: string } }
>('helperApplication/reloadHelperApplication', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setError(null));
    dispatch(setLoading(true));
    const response = await axiosInstance.get('/helper-application');
    return response.data.helpApplications;
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
export const helperApplicationSlice = createSlice({
  name: 'helperApplication',
  initialState,
  reducers: {
    setHelpRequests: (state, action) => {
      state.helperApplication = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(reloadHelperApplication.fulfilled, (state, action) => {
      state.helperApplication = action.payload;
    });
    builder.addCase(reloadHelperApplication.rejected, (state, action) => {
      state.error =
        action.payload?.message || 'An error occurred while trying to load help requests.';
    });
  }
});

export const { setHelpRequests, setError, setLoading } = helperApplicationSlice.actions;
export default helperApplicationSlice.reducer;
export { reloadHelperApplication };
