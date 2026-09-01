'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Calendar, Save, X, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const MemoryMap = dynamic(() => import('@/components/Map'), { ssr: false });
import { memoriesApi, Memory, UpdateMemoryData } from '@/lib/memories-api';
import { categoriesApi } from '@/lib/categories-api';
import { useAuthStore } from '@/store/auth-store';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const MOODS = [
  { value: 'HAPPY', emoji: '😊' },
  { value: 'SAD', emoji: '😢' },
  { value: 'EXCITED', emoji: '🤩' },
  { value: 'PEACEFUL', emoji: '😌' },
  { value: 'NOSTALGIC', emoji: '😊' },
  { value: 'LOVE', emoji: '❤️' },
  { value: 'ANGRY', emoji: '😡' },
  { value: 'TIRED', emoji: '😴' },
  { value: 'NEUTRAL', emoji: '😐' },
];

export default function EditMemoryPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    latitude: 0,
    longitude: 0,
    locationName: '',
    memoryDate: '',
    mood: 'HAPPY',
    categoryId: '',
  });
  
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    }
  };

  const loadMemory = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await memoriesApi.getById(id);
      setMemory(data);
      setFormData({
        title: data.title,
        content: data.content || '',
        latitude: data.latitude,
        longitude: data.longitude,
        locationName: data.locationName || '',
        memoryDate: data.memoryDate.split('T')[0],
        mood: data.mood,
        categoryId: data.categoryId,
      });
      setSelectedLocation({ lat: data.latitude, lng: data.longitude });
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load memory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    loadCategories();
    
    if (params.id) {
      loadMemory(params.id as string);
    }
  }, [isAuthenticated, router, params.id]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setSelectedLocation({ lat, lng });
    setIsSelectingLocation(false);
  };

  const handleLocationName = (locationName: string) => {
    setFormData(prev => ({
      ...prev,
      locationName,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!memory) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const updateData: UpdateMemoryData = {
        title: formData.title,
        content: formData.content,
        latitude: formData.latitude,
        longitude: formData.longitude,
        locationName: formData.locationName,
        memoryDate: formData.memoryDate,
        mood: formData.mood,
        categoryId: formData.categoryId,
      };
      
      await memoriesApi.update(memory.id, updateData);
      router.push(`/memories/${memory.id}`);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to update memory');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-slate-600 dark:text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error && !memory) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!memory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Edit Memory</h1>
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Map Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h2>
                <button
                  type="button"
                  onClick={() => setIsSelectingLocation(!isSelectingLocation)}
                  className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-hover"
                >
                  {isSelectingLocation ? 'Cancel' : 'Change Location'}
                </button>
              </div>
              {selectedLocation && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
            <div className="h-80">
              <MemoryMap
                memories={[]}
                onLocationSelect={handleLocationSelect}
                onSelectMode={isSelectingLocation}
                center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [memory.latitude, memory.longitude]}
                zoom={13}
                showSearch={true}
                enableReverseGeocoding={true}
                onLocationName={handleLocationName}
                showCurrentLocationButton={true}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="What happened here?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                rows={4}
                placeholder="Tell me more about this memory..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Location Name
              </label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="e.g., Central Park, New York"
              />
            </div>
          </div>

          {/* Date and Mood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </label>
              <input
                type="date"
                value={formData.memoryDate}
                onChange={(e) => setFormData({ ...formData, memoryDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mood
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {MOODS.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
