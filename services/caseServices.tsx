import AxiosClient from '@/api/axiosClient';

// Danh sách vụ án
export const listCase = async (limit: number, page: number) => {
  const res = await AxiosClient.get(`api/cases?limit=${limit}&page=${page}`);
  return res.data;
};
