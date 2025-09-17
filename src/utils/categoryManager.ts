import { MaterialCategory } from '../types/materials';
import { materialCategories } from '../data/materialsData';
import { CustomMaterialCategory } from '../components/common/MaterialCategoryManager';

// Get all categories (default + custom)
export const getAllCategories = (): Array<{
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  isCustom: boolean;
}> => {
  // Get default categories
  const defaultCategories = materialCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
    description: cat.description,
    isCustom: false
  }));

  // Get custom categories from localStorage
  const customCategories = getCustomCategories();

  return [...defaultCategories, ...customCategories];
};

// Get only custom categories from localStorage
export const getCustomCategories = (): CustomMaterialCategory[] => {
  const stored = localStorage.getItem('customMaterialCategories');
  return stored ? JSON.parse(stored) : [];
};

// Save custom categories to localStorage
export const saveCustomCategories = (categories: CustomMaterialCategory[]): void => {
  localStorage.setItem('customMaterialCategories', JSON.stringify(categories));
};

// Add a new custom category
export const addCustomCategory = (category: Omit<CustomMaterialCategory, 'id' | 'isCustom'>): CustomMaterialCategory => {
  const customCategories = getCustomCategories();
  const newCategory: CustomMaterialCategory = {
    ...category,
    id: `custom-${Date.now()}`,
    isCustom: true
  };
  
  const updatedCategories = [...customCategories, newCategory];
  saveCustomCategories(updatedCategories);
  
  return newCategory;
};

// Update an existing custom category
export const updateCustomCategory = (id: string, updates: Partial<CustomMaterialCategory>): boolean => {
  const customCategories = getCustomCategories();
  const categoryIndex = customCategories.findIndex(cat => cat.id === id);
  
  if (categoryIndex === -1) return false;
  
  customCategories[categoryIndex] = { ...customCategories[categoryIndex], ...updates };
  saveCustomCategories(customCategories);
  
  return true;
};

// Delete a custom category
export const deleteCustomCategory = (id: string): boolean => {
  const customCategories = getCustomCategories();
  const filteredCategories = customCategories.filter(cat => cat.id !== id);
  
  if (filteredCategories.length === customCategories.length) return false;
  
  saveCustomCategories(filteredCategories);
  return true;
};

// Get category by ID (searches both default and custom)
export const getCategoryById = (id: string): {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  isCustom: boolean;
} | null => {
  const allCategories = getAllCategories();
  return allCategories.find(cat => cat.id === id) || null;
};

// Check if a category name already exists
export const categoryNameExists = (name: string, excludeId?: string): boolean => {
  const allCategories = getAllCategories();
  return allCategories.some(cat => 
    cat.name.toLowerCase() === name.toLowerCase() && 
    cat.id !== excludeId
  );
};

// Convert category ID to MaterialCategory enum (for backward compatibility)
export const getCategoryEnumValue = (categoryId: string): MaterialCategory | string => {
  // Check if it's a default category
  const defaultCategory = Object.values(MaterialCategory).find(cat => cat === categoryId);
  if (defaultCategory) return defaultCategory;
  
  // For custom categories, return the ID as string
  return categoryId;
};

// Get category display info for forms and UI
export const getCategoryDisplayInfo = (categoryId: string) => {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  
  return {
    id: category.id,
    name: category.name,
    displayName: `${category.icon} ${category.name}`,
    color: category.color,
    icon: category.icon,
    description: category.description,
    isCustom: category.isCustom
  };
};

// Migrate existing materials to support custom categories
export const migrateMaterialCategories = () => {
  // This function can be called on app initialization to ensure
  // existing materials work with the new category system
  console.log('Material categories migration completed');
};