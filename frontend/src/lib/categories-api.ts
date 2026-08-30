import api from './api';

export interface Category {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  seed: async (): Promise<Category[]> => {
    const response = await api.post('/categories/seed');
    return response.data;
  },
};
