import AxiosClient from '@/api/axiosClient';

// Lấy danh sách template
export const getTemplateList = async (page: number, limit: number) => {
  const res = await AxiosClient.get(`api/templates?page=${page}&limit=${limit}`);
  return res;
};

// Lấy danh sách template theo id
export const getTemplateById = async (caseId: string) => {
  const res = await AxiosClient.get(`api/templates/${caseId}`);
  return res;
};
