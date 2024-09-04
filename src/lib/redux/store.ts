import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import requestReducer from "./slices/request";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer the types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
