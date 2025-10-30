import AxiosClient from '@/api/axiosClient';
export interface CreateCasePayload {
  templateId: string;
  applicableLaw: string;
  numberOfDefendants: string;
  crimeType: string;
  name: string;
  status: string;
  description: string;
  userId: string;
  fields: CaseFieldPayload[];
}

export interface CaseFieldPayload {
  groupId: string;
  fieldLabel: string;
  fieldName: string;
  fieldType: string;
  isEdit: boolean;
  isRequired: boolean;
  placeholder: string;
  defaultValue: string;
  description: string;
  value?: string;
}

export interface CaseUpdatePayload {
  status: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  applicableLaw: string;
  numberOfDefendants: string;
  crimeType: string;
  userId: string | null;
  isCompleted: boolean;
  tasks: string[];
  groups: CaseGroupUpdate[];
}

export interface CaseGroupUpdate {
  id: string;
  title: string;
  description: string;
  index: number;
  fields: CaseFieldUpdate[];
}

export interface CaseFieldUpdate {
  id: string;
  fieldLabel: string;
  fieldValue: string;
  placeholder: string;
  defaultValue: string;
  description: string;
  isRequired: boolean;
  isEditable: boolean;
  index: number;
  options: string[];
}

// Danh sách vụ án
export const listCase = async (limit: number, page: number, q?: string) => {
  const res = await AxiosClient.get(`api/v1/cases?limit=${limit}&page=${page}&q=${q}&order=desc`);
  return res; // ✅ vì interceptor đã return response.data
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

// Tạo vụ án
export const createCase = async (data: CreateCasePayload) => {
  try {
    const res = await AxiosClient.post('api/v1/cases', data);
    return res;
  } catch (error) {
    console.error('Error creating case:', error);
    throw error;
  }
};

// Cập nhật trường động theo ID
export const updateCaseField = async (caseId: string, body: CaseUpdatePayload) => {
  const res = await AxiosClient.put(`api/v1/cases/${caseId}`, body);
  return res;
};
