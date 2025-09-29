import {login, logout} from '@/services/authServices';
import {useUserStore} from '@/store/userStore';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'expo-router';

export function useLogin() {
  const {setUserInfo, setAccessToken} = useUserStore();
  const router = useRouter();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (data: any) => {
      if (data?.accessToken) {
        setUserInfo(data);
        setAccessToken(data.accessToken);
        router.replace('/(app)/(tabs)');
      } else {
        console.log('Login response missing accessToken', data);
      }
    },
    onError: (err: any) => {},
  });
}

// Đăng xuất
export function useLogout() {
  const router = useRouter();
  const {setUserInfo, setAccessToken} = useUserStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      setUserInfo(null);
      setAccessToken(null);
      // await AsyncStorage.removeItem('accessToken');
      console.log('Log out successfully');
      router.dismissAll();
      router.replace('/(auth)/login');
    },
    onError: e => {
      console.log('error logout', e);
    },
  });
}
