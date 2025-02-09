import React, { useState } from 'react';
import { MaterialCategory } from '@/hooks/useSettings';
import { motion } from 'framer-motion';
import { Plus, X, Edit2 } from 'lucide-react';

interface MaterialCategoriesProps {
  categories: MaterialCategory[];
  onAdd: (category: MaterialCategory) => void;
  onUpdate: (id: string, updates: Partial<MaterialCategory>) => void;
  onDelete: (id: string) => void;
}

export const MaterialCategories: React.FC<MaterialCategoriesProps> = ({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [newCategory, setNewCategory] = useState<Partial<MaterialCategory>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;

    onAdd({
      id: crypto.randomUUID(),
      name: newCategory.name,
      description: newCategory.description || '',
    });
    setNewCategory({});
  };

  const handleUpdate = (id: string, updates: Partial<MaterialCategory>) => {
    onUpdate(id, updates);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Material Categories</h3>

        {/* Add New Category Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                value={newCategory.name || ''}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <input
                type="text"
                id="categoryDescription"
                value={newCategory.description || ''}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Enter category description"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={!newCategory.name}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              {editingId === category.id ? (
                <div className="flex-1 mr-4">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleUpdate(category.id, { name: e.target.value })}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white mb-2"
                  />
                  <input
                    type="text"
                    value={category.description}
                    onChange={(e) => handleUpdate(category.id, { description: e.target.value })}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
                  )}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingId(editingId === category.id ? null : category.id)}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-2 text-red-400 hover:text-red-500 dark:hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}; 