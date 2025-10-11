import {myReport} from '@/services/reportServices';
import {useQuery, UseQueryResult} from '@tanstack/react-query';

// Interface mô tả dữ liệu trả về
export interface ReportData {
  pending: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
}

export function useMyReport(
  startDate?: string,
  endDate?: string,
): UseQueryResult<ReportData, Error> {
  return useQuery<ReportData, Error>({
    queryKey: ['myReport', startDate, endDate],
    queryFn: () => myReport({startDate, endDate}),
    meta: {
      onSuccess: () => console.log('Get report successfully'),
      onError: (e: any) => console.log('Failed when get report', e),
    },
  });
}
