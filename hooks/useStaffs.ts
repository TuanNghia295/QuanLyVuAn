import axiosClient from '@/api/axiosClient';
import {Staff} from '@/types/staff';
import {useInfiniteQuery} from '@tanstack/react-query';

interface StaffResponse {
  code: number;
  message: string;
  data: Staff[];
  pagination: {
    limit: number;
    currentPage: number;
    nextPage: boolean;
    previousPage: boolean;
    totalRecords: number;
    totalPages: number;
  };
}

export function useStaffs() {
  return useInfiniteQuery<Staff[], Error>({
    queryKey: ['staffs'],
    queryFn: async ({pageParam = 1}) => {
      const {data} = await axiosClient.get<StaffResponse>(
        `/api/v1/users?page=${pageParam}&limit=10`,
      );
      return data;
    },
    getNextPageParam: (_lastPage, pages) => {
      if (pages.length < 3) {
        // Load first 3 pages by default
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
