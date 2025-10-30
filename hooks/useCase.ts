import {
  caseDetail,
  CaseUpdatePayload,
  createCase,
  listCase,
  planCaseById,
  updateCase,
  updateCaseField,
} from '@/services/caseServices';
import {useUserStore} from '@/store/userStore';
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

export function useListCase(limit = 10, q?: string) {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['listCase', q],
    queryFn: async ({pageParam = 1}) => {
      const result = await listCase(limit, pageParam, q);
      return result; // vẫn là { data, pagination }
    },
    getNextPageParam: lastPage => {
      if (lastPage.pagination?.nextPage) {
        return lastPage.pagination.currentPage + 1;
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
      queryClient.invalidateQueries({queryKey: ['listCase']});
      queryClient.invalidateQueries({queryKey: ['caseDetail', variables.id]});
    },
    onError: error => {
      console.error('Lỗi khi cập nhật vụ án:', error);
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

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['createCase'],
    mutationFn: createCase,
    onSuccess: e => {
      queryClient.invalidateQueries({queryKey: ['listCase']});
    },
    onError: e => {
      console.log('Create Case Error', e);
    },
  });
};

// Cập nhật trường động
export const useUpdateCaseField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['caseField'],
    mutationFn: async ({id, body}: {id: string; body: CaseUpdatePayload}) => {
      return await updateCaseField(id, body);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({queryKey: ['listCase']});
      queryClient.invalidateQueries({queryKey: ['caseDetail', variables.id]});
    },
    onError: error => {
      console.error('Lỗi khi cập nhật vụ án:', error);
    },
  });
};
