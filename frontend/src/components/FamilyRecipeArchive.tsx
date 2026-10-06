'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface FamilyRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  originator: string;
  voiceNoteUrl: string | null;
}

export default function FamilyRecipeArchive() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState<FamilyRecipe[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: [] as string[],
    steps: [] as string[],
    originator: '',
    voiceNoteUrl: '',
  });

  useEffect(() => {
    fetchRecipes();
  }, [token]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:3001/genealogy/recipes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  const addRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/genealogy/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecipe),
      });

      setShowAddForm(false);
      setNewRecipe({
        title: '',
        description: '',
        ingredients: [],
        steps: [],
        originator: '',
        voiceNoteUrl: '',
      });
      await fetchRecipes();
    } catch (error) {
      console.error('Failed to add recipe:', error);
    }
  };

  const addIngredient = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, ''],
    });
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...newRecipe.ingredients];
    updated[index] = value;
    setNewRecipe({ ...newRecipe, ingredients: updated });
  };

  const removeIngredient = (index: number) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter((_, i) => i !== index),
    });
  };

  const addStep = () => {
    setNewRecipe({
      ...newRecipe,
      steps: [...newRecipe.steps, ''],
    });
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...newRecipe.steps];
    updated[index] = value;
    setNewRecipe({ ...newRecipe, steps: updated });
  };

  const removeStep = (index: number) => {
    setNewRecipe({
      ...newRecipe,
      steps: newRecipe.steps.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Family Traditional Recipe Archive</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Recipe
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add Family Recipe</h3>
          <form onSubmit={addRecipe} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newRecipe.title}
                onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                placeholder="Grandma's Pho"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newRecipe.description}
                onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                placeholder="Story behind this recipe..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Originator</label>
              <input
                type="text"
                value={newRecipe.originator}
                onChange={(e) => setNewRecipe({ ...newRecipe, originator: e.target.value })}
                placeholder="Grandma, Aunt, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
              {newRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="500g beef, 1 onion, etc."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                + Add Ingredient
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
              {newRecipe.steps.map((step, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                + Add Step
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voice Note URL (optional)</label>
              <input
                type="url"
                value={newRecipe.voiceNoteUrl}
                onChange={(e) => setNewRecipe({ ...newRecipe, voiceNoteUrl: e.target.value })}
                placeholder="https://example.com/voice-note.mp3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Recipe
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recipes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Family Recipes</h3>

        {recipes.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No recipes recorded yet</p>
        ) : (
          recipes.map((recipe) => {
            const ingredients = JSON.parse(recipe.ingredients);
            const steps = JSON.parse(recipe.steps);

            return (
              <div
                key={recipe.id}
                className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{recipe.title}</h4>
                    <p className="text-sm text-gray-600">By {recipe.originator}</p>
                  </div>
                  <div className="text-4xl">🍳</div>
                </div>

                {recipe.description && (
                  <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                )}

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Ingredients:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {ingredients.map((ing: string, idx: number) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Steps:</p>
                  <ol className="text-sm text-gray-600 list-decimal list-inside">
                    {steps.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                {recipe.voiceNoteUrl && (
                  <div className="mt-2">
                    <a
                      href={recipe.voiceNoteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      🎵 Listen to voice note
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">About Recipe Archive</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Step-by-step secret family recipes</li>
          <li>• Linked to family reunion memories</li>
          <li>• Ingredient lists and voice notes of Grandma's tips</li>
          <li>• Photo gallery of dishes</li>
        </ul>
      </div>
    </div>
  );
}
