import AxiosClient from '@/api/axiosClient';

type ReportProps = {
  startDate?: string;
  endDate?: string;
};
// Api lấy thống kê
export const myReport = async (data: ReportProps) => {
  const res = AxiosClient.get('api/reports/case/my', {
    params: {
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });
  return res;
};
