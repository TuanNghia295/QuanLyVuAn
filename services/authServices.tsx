import AxiosClient from '@/api/axiosClient';

type loginProps = {
  username: string;
  password: string;
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

// Api RefreshToken
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const res = await AxiosClient.post('api/v1/auth/refresh', {
      refreshToken,
    });
    return res;
  } catch (error) {
    console.log('❌ Refresh token failed', error);
    return null;
  }
};
