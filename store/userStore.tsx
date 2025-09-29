import AxiosClient from '@/api/axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {create} from 'zustand';

type DecodeToken = {
  exp: number;
  [key: string]: any; // những key khác
};

type UserState = {
  userInfo: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUserInfo: (info: any) => void;
  setAccessToken: (token: string | null) => Promise<void>;
  setRefreshToken: (token: string | null) => Promise<void>;
  loadToken: () => Promise<void>;
  checkToken: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  userInfo: null,
  accessToken: null,
  refreshToken: null,
  setUserInfo: info => set({userInfo: info}),
  setAccessToken: async token => {
    if (token) {
      await AsyncStorage.setItem('accessToken', token);
    } else {
      await AsyncStorage.removeItem('accessToken');
    }
    set({accessToken: token});
  },
  setRefreshToken: async token => {
    if (token) {
      await AsyncStorage.setItem('refreshToken', token);
    } else {
      await AsyncStorage.removeItem('refreshToken');
    }
    set({refreshToken: token});
  },
  loadToken: async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    set({accessToken, refreshToken});
  },
  checkToken: async () => {
    const token = get().accessToken;
    if (!token) return false;
    try {
      const decoded: DecodeToken = jwtDecode(token);
      console.log('Decode 😊😊', decoded);

      const now = Date.now() / 1000; // convert sang giây
      if (decoded.exp && decoded.exp < now) {
        console.log('⏰ Access token expired → trying refresh...');
        const refreshed = await get().refreshAccessToken();
        return refreshed;
      }
      return true;
    } catch (error) {
      console.log('❌ Lỗi khi decode access token:', error);
      // Token lỗi -> xóa
      await get().logout();
      return false;
    }
  },
  refreshAccessToken: async () => {
    const refresh = get().refreshToken;
    if (!refresh) {
      console.log('⚠️ Không có refreshToken → không thể refresh');
      return false;
    }
    try {
      const res = await AxiosClient.post('api/v1/auth/refresh', {
        refreshToken: refresh,
      });
      if (res?.accessToken) {
        await get().setAccessToken(res.accessToken);
        if (res.refreshToken) {
          await get().setRefreshToken(res.refreshToken);
        }
        console.log('🔄 Refresh token thành công');
        return true;
      }
      return res;
    } catch (error) {
      console.log('❌ Refresh token thất bại', error);
      await get().logout();
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    set({accessToken: null, refreshToken: null, userInfo: null});
  },
}));
