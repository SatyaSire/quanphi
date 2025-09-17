import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag } from 'lucide-react';

export interface CustomMaterialCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  isCustom: boolean;
}

interface MaterialCategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (category: CustomMaterialCategory) => void;
}

const PREDEFINED_COLORS = [
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
  'bg-cyan-100 text-cyan-800'
];

const PREDEFINED_ICONS = [
  '🏗️', '🔩', '🎨', '🪵', '⚡', '🔧', '📦', '🧱', '🪟', '🚪',
  '🔨', '⚙️', '🪜', '🧰', '🔌', '💡', '🪣', '🧽', '🪚', '📏'
];

const MaterialCategoryManager: React.FC<MaterialCategoryManagerProps> = ({
  isOpen,
  onClose,
  onCategoryAdded
}) => {
  const [categories, setCategories] = useState<CustomMaterialCategory[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: PREDEFINED_COLORS[0],
    icon: PREDEFINED_ICONS[0],
    description: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      loadCustomCategories();
    }
  }, [isOpen]);

  const loadCustomCategories = () => {
    const stored = localStorage.getItem('customMaterialCategories');
    if (stored) {
      setCategories(JSON.parse(stored));
    }
  };

  const saveCategoriesToStorage = (updatedCategories: CustomMaterialCategory[]) => {
    localStorage.setItem('customMaterialCategories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (categories.some(cat => 
      cat.name.toLowerCase() === formData.name.toLowerCase() && 
      cat.id !== editingId
    )) {
      newErrors.name = 'Category name already exists';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const newCategory: CustomMaterialCategory = {
      id: editingId || `custom-${Date.now()}`,
      name: formData.name.trim(),
      color: formData.color,
      icon: formData.icon,
      description: formData.description.trim(),
      isCustom: true
    };
    
    let updatedCategories;
    if (editingId) {
      updatedCategories = categories.map(cat => 
        cat.id === editingId ? newCategory : cat
      );
    } else {
      updatedCategories = [...categories, newCategory];
      onCategoryAdded(newCategory);
    }
    
    saveCategoriesToStorage(updatedCategories);
    resetForm();
  };

  const handleEdit = (category: CustomMaterialCategory) => {
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
      description: category.description
    });
    setEditingId(category.id);
    setIsAddingNew(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      saveCategoriesToStorage(updatedCategories);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: PREDEFINED_COLORS[0],
      icon: PREDEFINED_ICONS[0],
      description: ''
    });
    setIsAddingNew(false);
    setEditingId(null);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">🏷️ Manage Material Categories</h2>
                <p className="text-sm text-gray-600">Add, edit, or remove custom material categories</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Add New Category Button */}
          {!isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="mb-6 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Category</span>
            </button>
          )}

          {/* Add/Edit Form */}
          {isAddingNew && (
            <div className="mb-6 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter category name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${color} ${
                        formData.color === color ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      Sample
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-2 text-xl border rounded-lg hover:bg-gray-100 ${
                        formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${formData.color}`}>
                  {formData.icon} {formData.name || 'Category Name'}
                </span>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingId ? 'Update' : 'Save'} Category</span>
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Custom Categories ({categories.length})
            </h3>
            
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No custom categories yet</p>
                <p className="text-sm">Click "Add New Category" to create your first custom category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${category.color}`}>
                        {category.icon} {category.name}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCategoryManager;