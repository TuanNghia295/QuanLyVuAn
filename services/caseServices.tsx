import AxiosClient from '@/api/axiosClient';

export interface CaseUpdatePayload {
  name: string;
  description: string;
  order: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  tasks: {
    name: string;
  }[];
}

// Danh sách vụ án
export const listCase = async (limit: number, page: number, q?: string) => {
  const res = await AxiosClient.get(`api/v1/cases?limit=${limit}&page=${page}&q=${q}&order=desc`);
  return res.data;
};

// Chi tiết vụ án
export const caseDetail = async (caseId: string) => {
  const res = await AxiosClient.get(`api/v1/cases/${caseId}`);
  return res;
};

// Chỉnh sửa vụ án
export const updateCase = async (caseId: string, body: CaseUpdatePayload) => {
  console.log('body', body);
  const res = await AxiosClient.put(`api/v1/cases/${caseId}`, body);
  return res.data;
};

// Lấy kế hoạch vụ án hiển thị theo id
export const planCaseById = async (caseId: string) => {
  const res = await AxiosClient.get(`api/v1/cases/${caseId}/plan`);
  return res;
};
