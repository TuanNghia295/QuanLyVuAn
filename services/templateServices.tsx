import AxiosClient from '@/api/axiosClient';

// Lấy danh sách template
export const getTemplateList = async (page: number, limit: number) => {
  const res = await AxiosClient.get(`api/templates?page=${page}&limit=${limit}`);
  return res;
};
