import AxiosClient from '@/api/axiosClient';

type UserInfo = {
  fullName?: string;
  phone?: string;
  password?: string;
  userId?: string;
};

// Api lấy thông tin người dùng
export const userInfo = async () => {
  const res = await AxiosClient.get('api/v1/users/profile');
  return res;
};

// Api cập nhật thông tin người dùng
export const updateUserInfo = async (data: UserInfo) => {
  const res = await AxiosClient.put(`api/v1/users/${data.userId}`, data);
  return res;
};

// Lấy mã giới thiệu
export const getInviteCode = async () => {
  const res = await AxiosClient.get('api/v1/users/referral-code');
  return res;
};

// Tạo mã giới thiệu
export const createInviteCode = async () => {
  const res = await AxiosClient.get('api/v1/users/referral-code/random');
  return res;
};

// Lấy danh sách người dùng cho admin
export const getUserList = async (page: number, limit = 10) => {
  const res = await AxiosClient.get(`/api/v1/users?page=${page}&limit=${limit}`);
  return res;
};

// Xóa người dùng
export const deleteUser = async (userId: string) => {
  const res = await AxiosClient.delete(`/api/v1/users/${userId}`);
  return res;
};

// Admin tạo tài khoản user
export const createUserByAdmin = async (data: UserInfo) => {
  const res = await AxiosClient.post('api/v1/users', data);
  return res;
};
