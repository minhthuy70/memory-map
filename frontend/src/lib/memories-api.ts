import api from './api';

export interface Memory {
  id: string;
  title: string;
  content?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  memoryDate: string;
  mood: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  images: {
    id: string;
    imageUrl: string;
  }[];
}

export interface CreateMemoryData {
  title: string;
  content?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  memoryDate: string;
  mood: string;
  categoryId: string;
}

export interface UpdateMemoryData {
  title?: string;
  content?: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  memoryDate?: string;
  mood?: string;
  categoryId?: string;
}

export interface MemoryFilters {
  categoryId?: string;
  mood?: string;
  from?: string;
  to?: string;
  search?: string;
}

export interface Statistics {
  totalMemories: number;
  placesVisited: number;
  mostCommonMood: string;
  mostUsedCategory: string;
  memoriesByMonth: Record<string, number>;
  memoriesByCategory: Record<string, number>;
  memoriesByMood: Record<string, number>;
}

export const memoriesApi = {
  getAll: async (filters?: MemoryFilters): Promise<Memory[]> => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.mood) params.append('mood', filters.mood);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/memories?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Memory> => {
    const response = await api.get(`/memories/${id}`);
    return response.data;
  },

  create: async (data: CreateMemoryData): Promise<Memory> => {
    const response = await api.post('/memories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateMemoryData): Promise<Memory> => {
    const response = await api.put(`/memories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/memories/${id}`);
  },

  addImage: async (memoryId: string, imageUrl: string): Promise<void> => {
    await api.post(`/memories/${memoryId}/images`, { imageUrl });
  },

  deleteImage: async (memoryId: string, imageId: string): Promise<void> => {
    await api.delete(`/memories/${memoryId}/images/${imageId}`);
  },

  getStatistics: async (): Promise<Statistics> => {
    const response = await api.get('/memories/statistics');
    return response.data;
  },
};
