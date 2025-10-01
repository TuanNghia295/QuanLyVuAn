import {userInfo} from '@/services/userServices';
import {useUserStore} from '@/store/userStore';
import {useQuery} from '@tanstack/react-query';

// Thông tin tài khoản
export function useUserInfo() {
  const {accessToken} = useUserStore();
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfo,
    enabled: !!accessToken, // chỉ gọi hàm khi có token
    staleTime: 5 * 60 * 1000, // Giữ cache 5 phút
    refetchOnMount: true,
  });
}
