import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Tag,
  Palette,
  Move,
  AlertTriangle
} from 'lucide-react';
import { ExpenseCategory } from '../types/expenses';
import { expenseCategories as initialCategories } from '../data/expensesData';

interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
  description: string;
}

const ExpenseCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>(initialCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    icon: '📦',
    color: '#3B82F6',
    description: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const availableIcons = [
    '🏗️', '👷', '🚛', '🏠', '🍽️', '🔧', '📋', '📦',
    '💰', '⚡', '🔩', '🎯', '📊', '🛠️', '🚧', '📝',
    '💡', '🔨', '⚙️', '📈', '🎨', '🚀', '💼', '🏆'
  ];

  const availableColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280'  // Gray
  ];

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '📦',
      color: '#3B82F6',
      description: ''
    });
  };

  const handleAddCategory = () => {
    if (!formData.name.trim()) return;

    const newCategory: ExpenseCategory = {
      id: `cat_${Date.now()}`,
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
      description: formData.description.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCategories(prev => [...prev, newCategory]);
    resetForm();
    setIsAddingCategory(false);
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color,
        description: category.description || ''
      });
      setEditingCategory(categoryId);
    }
  };

  const handleUpdateCategory = () => {
    if (!formData.name.trim() || !editingCategory) return;

    setCategories(prev => prev.map(cat => 
      cat.id === editingCategory
        ? {
            ...cat,
            name: formData.name.trim(),
            icon: formData.icon,
            color: formData.color,
            description: formData.description.trim(),
            updatedAt: new Date().toISOString()
          }
        : cat
    ));

    resetForm();
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // In a real app, you'd check if the category is being used
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setDeleteConfirm(null);
  };

  const handleToggleActive = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId
        ? { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() }
        : cat
    ));
  };

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedItem(categoryId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = categories.findIndex(cat => cat.id === draggedItem);
    const targetIndex = categories.findIndex(cat => cat.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newCategories = [...categories];
    const [draggedCategory] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, draggedCategory);

    setCategories(newCategories);
    setDraggedItem(null);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setIsAddingCategory(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                to="/expenses"
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Categories</h1>
                <p className="text-gray-600 mt-1">
                  Manage expense categories, colors, and organization
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Form */}
        {(isAddingCategory || editingCategory) && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Equipment Rental"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of this category"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Icon
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {availableIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => handleInputChange('icon', icon)}
                        className={`p-2 text-lg rounded-md border-2 hover:border-blue-300 ${
                          formData.icon === icon
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="inline h-4 w-4 mr-1" />
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleInputChange('color', color)}
                        className={`w-10 h-10 rounded-md border-2 ${
                          formData.color === color
                            ? 'border-gray-800 ring-2 ring-gray-300'
                            : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium text-white"
                     style={{ backgroundColor: formData.color }}>
                  <span className="mr-2">{formData.icon}</span>
                  {formData.name || 'Category Name'}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  disabled={!formData.name.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Categories ({categories.length})
              </h3>
              <p className="text-sm text-gray-500">
                <Move className="inline h-4 w-4 mr-1" />
                Drag to reorder
              </p>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {categories.map((category, index) => (
              <div
                key={category.id}
                draggable
                onDragStart={(e) => handleDragStart(e, category.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category.id)}
                className={`px-6 py-4 hover:bg-gray-50 cursor-move ${
                  draggedItem === category.id ? 'opacity-50' : ''
                } ${
                  !category.isActive ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <span className="text-gray-400 text-sm font-mono w-8">
                        {index + 1}.
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white mr-4"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </div>
                      {!category.isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleActive(category.id)}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        category.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      onClick={() => handleEditCategory(category.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first expense category.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAddingCategory(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Category</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this category? This action cannot be undone.
                </p>
                <div className="mt-4">
                  {(() => {
                    const category = categories.find(cat => cat.id === deleteConfirm);
                    return category ? (
                      <div
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-white text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCategory(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategoriesPage;