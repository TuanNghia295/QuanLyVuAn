import {
  createInviteCode,
  getInviteCode,
  getUserList,
  updateUserInfo,
  userInfo,
} from '@/services/userServices';
import {useUserStore} from '@/store/userStore';
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

// Thông tin tài khoản
export function useUserInfo() {
  const {accessToken} = useUserStore();
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfo,
    enabled: !!accessToken, // chỉ gọi hàm khi có token
    staleTime: 5 * 60 * 1000, // Giữ cache 5 phút
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

// Sửa thông tin tài khoản
export function useUpdateUserInfo(setEditModalVisible?: (v: boolean) => void) {
  const queryClient = useQueryClient();
  const {refetch: refetchUserInfo} = useUserInfo();
  return useMutation({
    mutationKey: ['userInfo'],
    mutationFn: updateUserInfo,
    onSuccess: e => {
      queryClient.invalidateQueries({queryKey: ['userInfo']});
      console.log('update user sucessfully', e);
      refetchUserInfo();
      if (setEditModalVisible) setEditModalVisible(false); // đóng modal ngay khi thành công
    },
    onError: e => {
      console.log('update user failed', e);
    },
  });
}

// Tạo mã giới thiệu
export function useCreateInviteCode() {
  const {refetch: refetchGetInviteCode} = useGetInviteCode();
  return useMutation({
    mutationKey: ['inviteCode'],
    mutationFn: createInviteCode,
    onSuccess: data => {
      // console.log('random successfully', data);
      refetchGetInviteCode();
    },
    onError: e => {
      console.log('random invite code failed', e);
    },
  });
}

// Lấy mã giới thiệu
export function useGetInviteCode() {
  const {accessToken} = useUserStore();
  return useQuery({
    queryKey: ['inviteCode'],
    queryFn: getInviteCode,
    enabled: !!accessToken,
  });
}

// Lấy danh sách người dùng cho admin
export function useGetUserList(limit = 10) {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['users'],
    queryFn: ({pageParam = 1}) => getUserList(pageParam, limit),
    getNextPageParam: lastPage => {
      const {pagination} = lastPage;
      if (pagination?.nextPage) {
        return pagination.currentPage + 1;
      }
      return undefined;
    },
  });
}
