'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ScrapbookProject {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  layoutData: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VintageScrapbookMaker() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<ScrapbookProject[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    isPublic: false,
  });

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/audiovisual/scrapbooks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/audiovisual/scrapbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProject,
          layoutData: { elements: [], background: '#f5f5dc' },
        }),
      });

      setShowCreateForm(false);
      setNewProject({ title: '', description: '', thumbnailUrl: '', isPublic: false });
      await fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/audiovisual/scrapbooks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vintage Scrapbook & Collage Maker</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          New Scrapbook
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Create New Scrapbook</h3>
          <form onSubmit={createProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Summer 2024 Memories"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="A collection of memories from..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
              <input
                type="url"
                value={newProject.thumbnailUrl}
                onChange={(e) => setNewProject({ ...newProject, thumbnailUrl: e.target.value })}
                placeholder="https://example.com/cover.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newProject.isPublic}
                onChange={(e) => setNewProject({ ...newProject, isPublic: e.target.checked })}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make public
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <p className="text-gray-500 py-8 text-center col-span-3">No scrapbooks yet</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="border-2 border-amber-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-amber-100 flex items-center justify-center">
                  <span className="text-6xl">📒</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{project.title}</h4>
                  {project.isPublic && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                      Public
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg">
        <h4 className="font-semibold text-amber-800 mb-2">About Vintage Scrapbook</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Scrapbook canvas with washi tape stickers</li>
          <li>• Torn paper textures and dried flowers</li>
          <li>• Vintage postal stamps and photo frames</li>
          <li>• Freeform drag/rotate/layer controls</li>
        </ul>
      </div>
    </div>
  );
}
