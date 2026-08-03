import apiClient from './axios';

export const reportService = {
  getExportData: async (type: string = 'csv') => {
    const res = await apiClient.get('/admin/export', { params: { type } });
    return res.data;
  }
};

export default reportService;
