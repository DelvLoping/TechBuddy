import axios, { AxiosRequestConfig } from "axios";
import { removeJWT, setJWT } from "./redux/slices/user";
import { makeStore } from "./redux/store";

const store = makeStore();

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        store.dispatch(setJWT('1'))
        store.dispatch(removeJWT());
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
