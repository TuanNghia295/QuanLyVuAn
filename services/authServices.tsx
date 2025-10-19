import AxiosClient from '@/api/axiosClient';

type loginProps = {
  username: string;
  password: string;
};

type registerProps = {
  fullName: string;
  phone: string;
  password: string;
  referralCode: string;
};

type createNotificationsTokenProps = {
  userId: string;
  tokenExpo: string;
};

// Api đăng nhập
export const login = async (values: loginProps) => {
  const res = await AxiosClient.post('api/v1/auth/login', values);
  return res;
};

// Api đăng xuất
export const logout = async () => {
  const res = await AxiosClient.post('api/v1/auth/logout');
  return res;
};

// Api đăng ký
export const register = async (data: registerProps) => {
  const res = await AxiosClient.post('api/v1/auth/register', data);
  return res;
};

// Api create notifications token
export const createNotificationsToken = async (data: createNotificationsTokenProps) => {
  const res = await AxiosClient.post('api/v1/notifications/create-token', data);
  return res;
};
