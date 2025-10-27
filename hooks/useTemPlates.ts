import {getTemplateById, getTemplateList} from '@/services/templateServices';
import {useUserStore} from '@/store/userStore';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';

export const useGetTemplateList = ({limit = 10}) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['templateList'],
    queryFn: ({pageParam = 1}) => getTemplateList(pageParam, limit),
    getNextPageParam: lastPage => {
      const {pagination} = lastPage;
      if (pagination?.nextPage) {
        return pagination.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useGetTemplateById = (templateId?: string) => {
  const {accessToken} = useUserStore();
  return useQuery({
    queryKey: ['getTemplateById'],
    queryFn: () => getTemplateById(templateId as string),
    enabled: !!accessToken && !!templateId,
  });
};
