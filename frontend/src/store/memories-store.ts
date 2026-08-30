import { create } from 'zustand';
import { Memory, MemoryFilters } from '@/lib/memories-api';
import { Category as CategoryType } from '@/lib/categories-api';

interface MemoriesState {
  memories: Memory[];
  categories: CategoryType[];
  selectedMemory: Memory | null;
  filters: MemoryFilters;
  isLoading: boolean;
  error: string | null;
  
  setMemories: (memories: Memory[]) => void;
  setCategories: (categories: CategoryType[]) => void;
  setSelectedMemory: (memory: Memory | null) => void;
  setFilters: (filters: MemoryFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMemory: (memory: Memory) => void;
  updateMemory: (id: string, memory: Memory) => void;
  deleteMemory: (id: string) => void;
}

export const useMemoriesStore = create<MemoriesState>((set) => ({
  memories: [],
  categories: [],
  selectedMemory: null,
  filters: {},
  isLoading: false,
  error: null,
  
  setMemories: (memories) => set({ memories }),
  setCategories: (categories) => set({ categories }),
  setSelectedMemory: (selectedMemory) => set({ selectedMemory }),
  setFilters: (filters) => set({ filters }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  addMemory: (memory) => set((state) => ({ 
    memories: [memory, ...state.memories] 
  })),
  
  updateMemory: (id, updatedMemory) => set((state) => ({
    memories: state.memories.map((m) => 
      m.id === id ? updatedMemory : m
    ),
  })),
  
  deleteMemory: (id) => set((state) => ({
    memories: state.memories.filter((m) => m.id !== id),
  })),
}));
