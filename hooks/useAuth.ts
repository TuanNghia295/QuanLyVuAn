import {login, logout, register} from '@/services/authServices';
import {useModalStore} from '@/store/useModalStore';
import {useUserStore} from '@/store/userStore';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'expo-router';

export function useLogin() {
  const {setUserInfo, setAccessToken} = useUserStore();
  const router = useRouter();
  const {showModal} = useModalStore();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (data: any) => {
      console.log('data', data);

      if (data?.accessToken) {
        setUserInfo(data);
        setAccessToken(data.accessToken);
        router.replace('/(app)/(tabs)');
      } else {
        console.log('Login response missing accessToken', data);
      }
    },
    onError: (err: any) => {
      console.log('error when trying login', err);
      switch (err?.statusCode) {
        case 401:
          showModal('Mật khẩu hoặc tài khoản không đúng');
      }
    },
  });
}

export function useRegister() {
  const {showModal} = useModalStore();
  const router = useRouter();
  return useMutation({
    mutationKey: ['register'],
    mutationFn: register,
    onSuccess: () => {
      showModal('Tạo tài khoản thành công', () => {
        router.back();
      });
    },
    onError: (error: any) => {
      console.log('🚨 error while trying register', error);

      if (!error) return;

      switch (error?.errorCode) {
        case 'U001':
          // ví dụ: user not found
          showModal('Người dùng không tồn tại');
          break;
        case 'U002':
          // user đã tồn tại
          showModal('Người dùng đã tồn tại, vui lòng dùng số khác');
          break;
        case 'U003':
          // sai mật khẩu
          showModal('Mật khẩu không đúng');
          break;
        case 'U004':
          // user đã tồn tại
          showModal('Mã giới thiệu không đúng hoặc không tòn tại');
          break;
        default:
          showModal('Đã xảy ra lỗi không xác định');
      }
    },
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
