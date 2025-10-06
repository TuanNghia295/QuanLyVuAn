import {listCase} from '@/services/caseServices';
import {useInfiniteQuery} from '@tanstack/react-query';

export function useListCase(limit = 10) {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['listCase'],
    queryFn: ({pageParam = 1}) => listCase(limit, pageParam),
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
