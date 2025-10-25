import {
  deleteNotiById,
  notiList,
  readAllNoti,
  readNoti,
  unreadNoti,
} from '@/services/notificationServices';
import {useUserStore} from '@/store/userStore';
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

export const useListNoti = (limit = 10) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['notiList'],
    queryFn: ({pageParam = 1}) => notiList(limit, pageParam),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    getNextPageParam: lastPage => {
      const {pagination} = lastPage;
      if (pagination?.nextPage) {
        return pagination.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useUnreadNoti = () => {
  const {accessToken} = useUserStore();
  return useQuery({
    queryKey: ['unreadNoti'],
    queryFn: unreadNoti,
    enabled: !!accessToken,
  });
};

export const useReadNoti = () => {
  return useMutation({
    mutationKey: ['readNotiById'],
    mutationFn: readNoti,
    onSuccess: () => console.log('read'),
    onError: e => console.log('Error read by id', e),
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['unreadNoti'],
    mutationFn: readAllNoti,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['unreadNoti']});
    },
    onError: e => console.log('Error read ', e),
  });
};

export const useDeleteNoti = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete'],
    mutationFn: deleteNotiById,
    onSuccess: () => {
      console.log('Delete successfully');
      queryClient.invalidateQueries({queryKey: ['notiList']});
      queryClient.invalidateQueries({queryKey: ['unreadNoti']});
    },
    onError: e => console.log('Error read by id', e),
  });
};
