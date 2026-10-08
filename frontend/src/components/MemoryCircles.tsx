'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Circle {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  members: any[];
}

interface SharedAlbum {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  circle: any;
  contributors: any[];
}

export default function MemoryCircles() {
  const { token } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [albums, setAlbums] = useState<SharedAlbum[]>([]);
  const [showCircleForm, setShowCircleForm] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [newCircle, setNewCircle] = useState({ name: '', description: '', isPublic: false });
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '', isPublic: false, circleId: '' });

  useEffect(() => {
    fetchCircles();
    fetchAlbums();
  }, [token]);

  const fetchCircles = async () => {
    try {
      const response = await fetch('http://localhost:3001/social/circles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCircles(data);
    } catch (error) {
      console.error('Failed to fetch circles:', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch('http://localhost:3001/social/albums', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    }
  };

  const createCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/social/circles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCircle),
      });

      setShowCircleForm(false);
      setNewCircle({ name: '', description: '', isPublic: false });
      await fetchCircles();
    } catch (error) {
      console.error('Failed to create circle:', error);
    }
  };

  const createAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/social/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAlbum),
      });

      setShowAlbumForm(false);
      setNewAlbum({ title: '', description: '', isPublic: false, circleId: '' });
      await fetchAlbums();
    } catch (error) {
      console.error('Failed to create album:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Memory Circles & Collaborative Albums</h2>

      {/* Circles Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Your Circles</h3>
          <button
            onClick={() => setShowCircleForm(!showCircleForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            New Circle
          </button>
        </div>

        {showCircleForm && (
          <div className="mb-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold mb-4">Create New Circle</h4>
            <form onSubmit={createCircle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Circle Name</label>
                <input
                  type="text"
                  value={newCircle.name}
                  onChange={(e) => setNewCircle({ ...newCircle, name: e.target.value })}
                  placeholder="Family, Travel Buddies, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCircle.description}
                  onChange={(e) => setNewCircle({ ...newCircle, description: e.target.value })}
                  placeholder="Circle description..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublicCircle"
                  checked={newCircle.isPublic}
                  onChange={(e) => setNewCircle({ ...newCircle, isPublic: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isPublicCircle" className="text-sm text-gray-700">
                  Make public
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Circle
                </button>
                <button
                  type="button"
                  onClick={() => setShowCircleForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {circles.length === 0 ? (
            <p className="text-gray-500 py-4 text-center col-span-2">No circles yet</p>
          ) : (
            circles.map((circle) => (
              <div key={circle.id} className="p-4 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{circle.name}</h4>
                    {circle.description && (
                      <p className="text-sm text-gray-600">{circle.description}</p>
                    )}
                  </div>
                  {circle.isPublic && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                      Public
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>👥 {circle.members.length} members</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shared Albums Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Shared Albums</h3>
          <button
            onClick={() => setShowAlbumForm(!showAlbumForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            New Album
          </button>
        </div>

        {showAlbumForm && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-4">Create Shared Album</h4>
            <form onSubmit={createAlbum} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Album Title</label>
                <input
                  type="text"
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  placeholder="Summer Trip 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  placeholder="Album description..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Circle (optional)</label>
                <select
                  value={newAlbum.circleId}
                  onChange={(e) => setNewAlbum({ ...newAlbum, circleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">No circle</option>
                  {circles.map((circle) => (
                    <option key={circle.id} value={circle.id}>
                      {circle.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublicAlbum"
                  checked={newAlbum.isPublic}
                  onChange={(e) => setNewAlbum({ ...newAlbum, isPublic: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isPublicAlbum" className="text-sm text-gray-700">
                  Make public
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Album
                </button>
                <button
                  type="button"
                  onClick={() => setShowAlbumForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albums.length === 0 ? (
            <p className="text-gray-500 py-4 text-center col-span-2">No shared albums yet</p>
          ) : (
            albums.map((album) => (
              <div key={album.id} className="p-4 border border-green-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{album.title}</h4>
                    {album.description && (
                      <p className="text-sm text-gray-600">{album.description}</p>
                    )}
                  </div>
                  {album.isPublic && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                      Public
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>👥 {album.contributors.length} contributors</span>
                  {album.circle && (
                    <span>🔵 {album.circle.name}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">About Circles & Albums</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Custom circles: Family, Travel Buddies, Best Friends</li>
          <li>• Custom access control per memory</li>
          <li>• Shared trip albums with multi-user contribution</li>
          <li>• Contributor permissions: admin, editor, viewer</li>
        </ul>
      </div>
    </div>
  );
}
