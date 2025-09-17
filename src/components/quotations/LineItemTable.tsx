import React, { useState } from 'react';
import { Plus, Minus, Edit2, Save, X } from 'lucide-react';
import { QuotationLineItem } from '../../types/quotation';

interface LineItemTableProps {
  lineItems: QuotationLineItem[];
  onAddItem: (item: Omit<QuotationLineItem, 'id' | 'amount'>) => void;
  onUpdateItem: (index: number, field: keyof QuotationLineItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  editable?: boolean;
  showAddForm?: boolean;
}

const LineItemTable: React.FC<LineItemTableProps> = ({
  lineItems,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  editable = true,
  showAddForm = true
}) => {
  const [newItem, setNewItem] = useState({
    category: '',
    description: '',
    unit: 'Sqft' as const,
    quantity: 0,
    rate: 0
  });
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<QuotationLineItem | null>(null);
  
  const unitOptions = [
    'Sqft', 'Nos', 'Rft', 'Lumpsum', 'Day', 'Kg', 'Meter', 'Hour', 'Cubic Ft', 'Ton'
  ];
  
  const handleAddItem = () => {
    if (!newItem.category || !newItem.description || newItem.quantity <= 0 || newItem.rate <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }
    
    onAddItem(newItem);
    
    // Reset form
    setNewItem({
      category: '',
      description: '',
      unit: 'Sqft',
      quantity: 0,
      rate: 0
    });
  };
  
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingItem({ ...lineItems[index] });
  };
  
  const saveEdit = () => {
    if (!editingItem || editingIndex === null) return;
    
    if (!editingItem.category || !editingItem.description || editingItem.quantity <= 0 || editingItem.rate <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }
    
    // Update each field individually
    Object.keys(editingItem).forEach(key => {
      if (key !== 'id' && key !== 'amount') {
        onUpdateItem(editingIndex, key as keyof QuotationLineItem, editingItem[key as keyof QuotationLineItem]);
      }
    });
    
    setEditingIndex(null);
    setEditingItem(null);
  };
  
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingItem(null);
  };
  
  const updateEditingItem = (field: keyof QuotationLineItem, value: any) => {
    if (!editingItem) return;
    
    const updatedItem = { ...editingItem, [field]: value };
    
    // Recalculate amount if quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      updatedItem.amount = updatedItem.quantity * updatedItem.rate;
    }
    
    setEditingItem(updatedItem);
  };
  
  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <div className="space-y-4">
      {/* Add New Item Form */}
      {showAddForm && editable && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            <div>
              <input
                type="text"
                placeholder="Category"
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {unitOptions.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Rate"
                value={newItem.rate || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, rate: Number(e.target.value) }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleAddItem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                title="Add Item"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Quick calculation preview */}
          {newItem.quantity > 0 && newItem.rate > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Preview: {newItem.quantity} × ₹{newItem.rate} = ₹{(newItem.quantity * newItem.rate).toLocaleString()}
            </div>
          )}
        </div>
      )}
      
      {/* Line Items Table */}
      {lineItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium mb-1">No line items added yet</p>
          <p className="text-sm">Add items above to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  {editable && (
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lineItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500 text-center">
                      {index + 1}
                    </td>
                    
                    {/* Category */}
                    <td className="px-4 py-3">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={editingItem?.category || ''}
                          onChange={(e) => updateEditingItem('category', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                      )}
                    </td>
                    
                    {/* Description */}
                    <td className="px-4 py-3">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={editingItem?.description || ''}
                          onChange={(e) => updateEditingItem('description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-sm text-gray-700">{item.description}</span>
                      )}
                    </td>
                    
                    {/* Unit */}
                    <td className="px-4 py-3 text-center">
                      {editingIndex === index ? (
                        <select
                          value={editingItem?.unit || 'Sqft'}
                          onChange={(e) => updateEditingItem('unit', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {unitOptions.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm text-gray-600">{item.unit}</span>
                      )}
                    </td>
                    
                    {/* Quantity */}
                    <td className="px-4 py-3 text-right">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={editingItem?.quantity || ''}
                          onChange={(e) => updateEditingItem('quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-sm text-gray-700">{item.quantity.toLocaleString()}</span>
                      )}
                    </td>
                    
                    {/* Rate */}
                    <td className="px-4 py-3 text-right">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={editingItem?.rate || ''}
                          onChange={(e) => updateEditingItem('rate', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-sm text-gray-700">₹{item.rate.toLocaleString()}</span>
                      )}
                    </td>
                    
                    {/* Amount */}
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{(editingIndex === index ? (editingItem?.amount || 0) : item.amount).toLocaleString()}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    {editable && (
                      <td className="px-4 py-3 text-center">
                        {editingIndex === index ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-800 p-1 rounded transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => startEditing(index)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemoveItem(index)}
                              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                              title="Remove"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              
              {/* Total Row */}
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={editable ? 6 : 5} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                    Subtotal:
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                    ₹{total.toLocaleString()}
                  </td>
                  {editable && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      
      {/* Summary Stats */}
      {lineItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{lineItems.length}</div>
            <div className="text-blue-800">Total Items</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {lineItems.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
            </div>
            <div className="text-green-800">Total Quantity</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ₹{Math.round(total / lineItems.length).toLocaleString()}
            </div>
            <div className="text-purple-800">Avg. Item Value</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineItemTable;