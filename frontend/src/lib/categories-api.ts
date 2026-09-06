import api from './api';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  usageCount?: number;
  _count?: {
    memories: number;
  };
}

export interface CreateCategoryData {
  name: string;
  icon: string;
  color?: string;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  color?: string;
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

  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
