import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserState } from "../types";
import axios from "axios";
import { UserType } from "@prisma/client";
import { RootState } from "../store";

const initialState: UserState = {
  user: null,
  jwt: null,
  error: null,
  loading: false,
};

const login = createAsyncThunk<
  { token: string; user: UserType },
  { username: string; password: string },
  { rejectValue: { message: string } }
>(
  "auth/login",
  async (
    formData: { username: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      const response = await axios.post("/api/auth/login", formData);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          return rejectWithValue({ message: error.response.data.message });
        } else {
          return rejectWithValue({
            message: "An error occurred while trying to log in.",
          });
        }
      } else {
        throw new Error("different error than axios");
      }
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const register = createAsyncThunk<
  { message: string; user: UserType; token: string },
  {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    age: number | null;
    address: string | null;
    type: string | null;
  },
  { rejectValue: { message: string } }
>("auth/register", async (formData, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setError(null));
    dispatch(setLoading(true));
    const response = await axios.post("/api/auth/register", formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue({ message: error.response.data.message });
      } else {
        return rejectWithValue({
          message: "An error occurred while trying to register.",
        });
      }
    } else {
      throw new Error("different error than axios");
    }
  } finally {
    dispatch(setLoading(false));
  }
});

const logout = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: { message: string }; state: RootState }
>("auth/logout", async (_, { rejectWithValue, dispatch, getState }) => {
  try {
    dispatch(setError(null));
    const jwt = getState().user.jwt;
    dispatch(setUser(null));
    dispatch(setJWT(null));
    const response = await axios.post("/api/auth/logout", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue({ message: error.response.data.message });
      } else {
        return rejectWithValue({
          message: "An error occurred while trying to log out.",
        });
      }
    } else {
      throw new Error("different error than axios");
    }
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setJWT: (state, action) => {
      state.jwt = action.payload;
      localStorage.setItem("jwt", action.payload);
    },
    removeJWT: (state) => {
      console.log(state.jwt)
      state.jwt = null;
      localStorage.removeItem("jwt");
      console.log('ici')
      console.log(state.jwt)
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const { user, token } = action.payload;
      if (token) {
        state.jwt = token;
        localStorage.setItem("jwt", token);
        state.user = user;
      } else {
        state.error = "Invalid token";
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload?.message;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      const { user, token } = action.payload;
      if (token) {
        state.jwt = token;
        localStorage.setItem("jwt", token);
        state.user = user;
      } else {
        state.error = "Invalid token";
      }
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.payload?.message;
    });
  },
});

export const { setUser, setJWT, removeJWT, setError, setLoading } =
  userSlice.actions;
export default userSlice.reducer;
export { login, register, logout };
