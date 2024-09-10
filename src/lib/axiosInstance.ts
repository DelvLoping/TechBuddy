import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { removeJWT } from './redux/slices/user';
import { store } from './redux/store';
const axiosInstance = axios.create({
  baseURL: '/api'
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
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
      if (typeof window !== 'undefined') {
        store.dispatch(removeJWT());
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
