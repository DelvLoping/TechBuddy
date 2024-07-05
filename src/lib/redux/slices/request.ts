// lib/redux/slices/request.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createRequest = createAsyncThunk(
  "request/create",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/helper-request", formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "An unexpected error occurred" });
    }
  }
);

const requestSlice = createSlice({
  name: "request",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createRequest.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createRequest.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(createRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to create request";
    });
  },
});

export default requestSlice.reducer;
