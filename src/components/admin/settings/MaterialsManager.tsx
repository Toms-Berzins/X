import React, { useState } from 'react';
import { Material, MaterialCategory } from '@/hooks/useSettings';
import { motion } from 'framer-motion';
import { Plus, X, Edit2, Filter } from 'lucide-react';

interface MaterialsManagerProps {
  materials: Material[];
  categories: MaterialCategory[];
  onAddMaterial: (material: Material) => void;
  onUpdateMaterial: (name: string, updates: Partial<Material>) => void;
  onDeleteMaterial: (name: string) => void;
}

export const MaterialsManager: React.FC<MaterialsManagerProps> = ({
  materials,
  categories,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
}) => {
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({});
  const [editingName, setEditingName] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.name || !newMaterial.pricePerUnit || !newMaterial.unit) return;

    onAddMaterial({
      name: newMaterial.name,
      pricePerUnit: Number(newMaterial.pricePerUnit),
      unit: newMaterial.unit,
      category: newMaterial.category,
      description: newMaterial.description,
      minQuantity: newMaterial.minQuantity,
      maxQuantity: newMaterial.maxQuantity,
    });
    setNewMaterial({});
  };

  const filteredMaterials = selectedCategory === 'all'
    ? materials
    : materials.filter(m => m.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Materials</h3>
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-40 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add New Material Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="materialName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Material Name
              </label>
              <input
                type="text"
                id="materialName"
                value={newMaterial.name || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Enter material name"
              />
            </div>
            <div>
              <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price per Unit
              </label>
              <input
                type="number"
                id="pricePerUnit"
                value={newMaterial.pricePerUnit || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, pricePerUnit: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Enter price per unit"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Unit
              </label>
              <input
                type="text"
                id="unit"
                value={newMaterial.unit || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="e.g., sq ft, linear ft"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="category"
                value={newMaterial.category || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Minimum Quantity
              </label>
              <input
                type="number"
                id="minQuantity"
                value={newMaterial.minQuantity || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, minQuantity: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Enter minimum quantity"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="maxQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Maximum Quantity
              </label>
              <input
                type="number"
                id="maxQuantity"
                value={newMaterial.maxQuantity || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, maxQuantity: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Enter maximum quantity"
                min="0"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={newMaterial.description || ''}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Enter material description"
              rows={2}
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={!newMaterial.name || !newMaterial.pricePerUnit || !newMaterial.unit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </button>
          </div>
        </form>

        {/* Materials List */}
        <div className="space-y-4">
          {filteredMaterials.map((material) => (
            <motion.div
              key={material.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              {editingName === material.name ? (
                <div className="flex-1 mr-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) => onUpdateMaterial(material.name, { name: e.target.value })}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    value={material.pricePerUnit}
                    onChange={(e) => onUpdateMaterial(material.name, { pricePerUnit: parseFloat(e.target.value) })}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    value={material.unit}
                    onChange={(e) => onUpdateMaterial(material.name, { unit: e.target.value })}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{material.name}</h4>
                    {material.category && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
                        {categories.find(c => c.id === material.category)?.name}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    ${material.pricePerUnit} per {material.unit}
                    {material.description && (
                      <span className="ml-2 text-gray-400">• {material.description}</span>
                    )}
                  </div>
                  {(material.minQuantity || material.maxQuantity) && (
                    <div className="mt-1 text-xs text-gray-400">
                      Quantity: {material.minQuantity || 0} - {material.maxQuantity || '∞'}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingName(editingName === material.name ? null : material.name)}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteMaterial(material.name)}
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