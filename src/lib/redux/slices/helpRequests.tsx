import { createSlice } from '@reduxjs/toolkit';
import { HelpRequestsState } from '../types';

const initialState: HelpRequestsState = {
  helpRequests: []
};

export const helpRequestsSlice = createSlice({
  name: 'helpRequests',
  initialState,
  reducers: {
    setHelpRequests: (state, action) => {
      state.helpRequests = action.payload;
    }
  }
});

export const { setHelpRequests } = helpRequestsSlice.actions;
export default helpRequestsSlice.reducer;
