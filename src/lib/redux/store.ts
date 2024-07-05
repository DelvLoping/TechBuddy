import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import requestReducer from "./slices/request";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      request: requestReducer,
    },
  });
};


// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
