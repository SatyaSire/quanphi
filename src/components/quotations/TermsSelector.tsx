import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp,
  Check
} from 'lucide-react';
import { defaultTermsConditions } from '../../data/quotationsData';

interface TermsSelectorProps {
  selectedTerms: string[];
  onTermsChange: (termIds: string[]) => void;
  editable?: boolean;
  showPreview?: boolean;
}

const TermsSelector: React.FC<TermsSelectorProps> = ({
  selectedTerms,
  onTermsChange,
  editable = true,
  showPreview = true
}) => {
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTerm, setEditingTerm] = useState<string | null>(null);
  const [newTerm, setNewTerm] = useState({ title: '', content: '' });
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  
  const toggleTerm = (termId: string) => {
    if (selectedTerms.includes(termId)) {
      onTermsChange(selectedTerms.filter(id => id !== termId));
    } else {
      onTermsChange([...selectedTerms, termId]);
    }
  };
  
  const toggleExpanded = (termId: string) => {
    const newExpanded = new Set(expandedTerms);
    if (newExpanded.has(termId)) {
      newExpanded.delete(termId);
    } else {
      newExpanded.add(termId);
    }
    setExpandedTerms(newExpanded);
  };
  
  const handleAddTerm = () => {
    if (!newTerm.title.trim() || !newTerm.content.trim()) {
      alert('Please fill both title and content');
      return;
    }
    
    // In a real app, this would call an API to add the term
    console.log('Adding new term:', newTerm);
    alert('Custom terms functionality would be implemented with backend API');
    
    setNewTerm({ title: '', content: '' });
    setShowAddForm(false);
  };
  
  const startEditing = (termId: string) => {
    const term = defaultTermsConditions.find(t => t.id === termId);
    if (term) {
      setEditForm({ title: term.title, content: term.content });
      setEditingTerm(termId);
    }
  };
  
  const saveEdit = () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      alert('Please fill both title and content');
      return;
    }
    
    // In a real app, this would call an API to update the term
    console.log('Updating term:', editingTerm, editForm);
    alert('Custom terms editing would be implemented with backend API');
    
    setEditingTerm(null);
    setEditForm({ title: '', content: '' });
  };
  
  const cancelEdit = () => {
    setEditingTerm(null);
    setEditForm({ title: '', content: '' });
  };
  
  const selectedTermsData = defaultTermsConditions.filter(term => 
    selectedTerms.includes(term.id)
  );
  
  return (
    <div className="space-y-6">
      {/* Terms Selection */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Terms & Conditions
          </h3>
          
          {editable && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Term
            </button>
          )}
        </div>
        
        {/* Add New Term Form */}
        {showAddForm && editable && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add Custom Term</h4>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Term title"
                  value={newTerm.title}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <textarea
                  placeholder="Term content"
                  value={newTerm.content}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddTerm}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Add Term
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTerm({ title: '', content: '' });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Terms List */}
        <div className="space-y-3">
          {defaultTermsConditions.map(term => (
            <div key={term.id} className="border rounded-lg">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {editable && (
                    <input
                      type="checkbox"
                      checked={selectedTerms.includes(term.id)}
                      onChange={() => toggleTerm(term.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  )}
                  
                  <div className="flex-1">
                    {editingTerm === term.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        />
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{term.title}</h4>
                          
                          <div className="flex items-center gap-2">
                            {selectedTerms.includes(term.id) && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Selected
                              </span>
                            )}
                            
                            {editable && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => startEditing(term.id)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                  title="Edit term"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleExpanded(term.id)}
                                  className="text-gray-600 hover:text-gray-800 p-1 rounded transition-colors"
                                  title={expandedTerms.has(term.id) ? 'Collapse' : 'Expand'}
                                >
                                  {expandedTerms.has(term.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {(expandedTerms.has(term.id) || !editable) && (
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            {term.content}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Selection Summary */}
        {selectedTerms.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{selectedTerms.length}</strong> term{selectedTerms.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>
      
      {/* Preview Selected Terms */}
      {showPreview && selectedTermsData.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview: Selected Terms</h3>
          
          <div className="space-y-4">
            {selectedTermsData.map((term, index) => (
              <div key={term.id} className="border-l-4 border-blue-600 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">
                  {index + 1}. {term.title}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">{term.content}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500">
              These terms will appear in the final quotation document.
            </p>
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      {editable && (
        <div className="flex gap-2">
          <button
            onClick={() => onTermsChange(defaultTermsConditions.map(t => t.id))}
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg transition-colors"
          >
            Select All
          </button>
          <button
            onClick={() => onTermsChange([])}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition-colors"
          >
            Clear All
          </button>
          
          {/* Common presets */}
          <button
            onClick={() => onTermsChange(['payment-terms', 'material-supply', 'completion-time'])}
            className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg transition-colors"
          >
            Standard Set
          </button>
        </div>
      )}
    </div>
  );
};

export default TermsSelector;