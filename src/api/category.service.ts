import apiClient from './axios';
import { Category } from '../types';

export const categoryService = {
  getCategories: async () => {
    const res = await apiClient.get<Category[]>('/categories');
    return res.data;
  }
};

export default categoryService;
