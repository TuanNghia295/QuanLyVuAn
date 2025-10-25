import AxiosClient from '@/api/axiosClient';

// Api lấy danh sách thông báo
export const notiList = async (limit: number, page: number) => {
  const res = await AxiosClient.get(`/api/v1/notifications?limit=${limit}&page=${page}&order=desc`);
  return res;
};

// Api đếm thông báo chưa đọc
export const unreadNoti = async () => {
  const res = await AxiosClient.get('/api/v1/notifications/unread-count');
  return res;
};

// Api đánh dấu thông báo đọc
export const readNoti = async (notificationId: string) => {
  const res = await AxiosClient.patch(`/api/v1/notifications/${notificationId}/read`);
  return res;
};

// Api đánh dấu tất cả đã đọc
export const readAllNoti = async () => {
  const res = await AxiosClient.patch(`/api/v1/notifications/mark-all-read`);
  return res;
};

// Xóa thông báo theo id
export const deleteNotiById = async (notificationId: string) => {
  console.log('notificationId deleteNotiById', notificationId);
  const res = await AxiosClient.delete(`/api/v1/notifications/${notificationId}`);
  return res;
};
