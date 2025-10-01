import AxiosClient from '@/api/axiosClient';

// Api lấy thông tin người dùng
export const userInfo = async () => {
  const res = await AxiosClient.get('api/v1/users/profile');
  return res;
};
