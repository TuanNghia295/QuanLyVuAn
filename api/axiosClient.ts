import {END_POINTS} from '@/constants/endpoints';
import {useUserStore} from '@/store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// 🧠 Khai báo type AxiosClient chung
interface TypedAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const AxiosClient: TypedAxiosInstance = axios.create({
  baseURL: END_POINTS,
  timeout: 10000,
}) as TypedAxiosInstance;

// 🟡 Request Interceptor
AxiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 🟢 Response Interceptor — trả về data trực tiếp
AxiosClient.interceptors.response.use(
  function <T>(response: AxiosResponse<T>) {
    return response.data;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const {setAccessToken, setUserInfo} = useUserStore.getState();
      setAccessToken(null);
      setUserInfo(null);
      await AsyncStorage.removeItem('accessToken');
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default AxiosClient;
