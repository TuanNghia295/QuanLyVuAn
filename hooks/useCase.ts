import {
  caseDetail,
  CaseUpdatePayload,
  listCase,
  planCaseById,
  updateCase,
} from '@/services/caseServices';
import {useUserStore} from '@/store/userStore';
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

export function useListCase(limit = 10, q?: string) {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['listCase', q],
    queryFn: ({pageParam = 1}) => listCase(limit, pageParam, q),
    refetchOnWindowFocus: true,
    getNextPageParam: lastPage => {
      const {pagination} = lastPage;
      if (pagination?.nextPage) {
        return pagination.currentPage + 1;
      }
      return undefined;
    },
  });
}

export const useCaseDetail = (params?: {id: string}) => {
  return useQuery({
    queryKey: ['caseDetail', params?.id],
    queryFn: () => caseDetail(params!.id),
    enabled: !!params?.id,
  });
};

export const useUpdateCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateCase'],
    mutationFn: async ({id, body}: {id: string; body: CaseUpdatePayload}) => {
      return await updateCase(id, body);
    },
    onSuccess: (_data, variables) => {
      console.log('✅ Cập nhật vụ án thành công');
      queryClient.invalidateQueries({queryKey: ['caseDetail', variables.id]});
    },
    onError: error => {
      console.error('❌ Lỗi khi cập nhật vụ án:', error);
    },
  });
};

export const usePlanCase = (id: string) => {
  const {accessToken} = useUserStore();
  return useQuery({
    queryKey: ['planCase,caseDetail', id],
    queryFn: ({queryKey}) => planCaseById(queryKey[1]), // queryKey[1] = id
    enabled: !!accessToken && !!id,
  });
};
