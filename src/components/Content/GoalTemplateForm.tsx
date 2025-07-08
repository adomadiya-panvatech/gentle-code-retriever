import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { X, Upload } from 'lucide-react';

interface GoalTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  template?: any;
  isEdit?: boolean;
}

const GoalTemplateForm: React.FC<GoalTemplateFormProps> = ({ 
  isOpen, 
  onClose, 
  template, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    isPrivate: false,
    searchTags: [],
    image: null
  });

  const [newTag, setNewTag] = useState('');
  const [htmlEditorContent, setHtmlEditorContent] = useState('');

  useEffect(() => {
    if (template) {
      console.log('Loading template data:', template);
      setFormData({
        name: template.name || '',
        shortDescription: template.shortDescription || '',
        longDescription: template.longDescription || '',
        isPrivate: template.isPrivate || false,
        searchTags: template.searchTags || [],
        image: template.image || null
      });
      setHtmlEditorContent(template.longDescription || '');
    } else {
      // Reset form for new template
      setFormData({
        name: '',
        shortDescription: '',
        longDescription: '',
        isPrivate: false,
        searchTags: [],
        image: null
      });
      setHtmlEditorContent('');
    }
  }, [template]);

  const handleSave = () => {
    const updatedFormData = {
      ...formData,
      longDescription: htmlEditorContent
    };
    console.log('Saving goal template:', updatedFormData);
    onClose();
  };

  const addSearchTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        searchTags: [...prev.searchTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeSearchTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      searchTags: prev.searchTags.filter((_, i) => i !== index)
    }));
  };

  const handleHtmlEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlEditorContent(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-900 text-xl font-semibold">
            {isEdit ? 'Edit Goal Template' : 'New Goal Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image */}
          <div className="lg:col-span-1">
            <div className="w-full h-64 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt="Template" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Upload Image</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name (required)
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Name (required)"
                className="w-full"
              />
              {!formData.name && (
                <p className="text-red-500 text-sm mt-1">Name is required!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase text-xs">
                Short Description
              </label>
              <Textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase text-xs">
                Long Description (HTML Editor)
              </label>
              <div className="border rounded-lg">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <span className="text-xs text-gray-600">HTML Editor - You can use HTML tags like &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h3&gt;, etc.</span>
                </div>
                <Textarea
                  value={htmlEditorContent}
                  onChange={handleHtmlEditorChange}
                  className="w-full h-32 border-0 rounded-t-none"
                  placeholder="Enter HTML content here..."
                />
              </div>
              
              {/* HTML Preview */}
              {htmlEditorContent && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
                  <div 
                    className="border rounded p-3 bg-gray-50 max-h-32 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: htmlEditorContent }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="private"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: !!checked }))}
              />
              <label htmlFor="private" className="text-sm font-medium">
                Private
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700 uppercase text-xs">
                  Search Tags
                </span>
                <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  ?
                </span>
              </div>
              
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addSearchTag()}
                />
                <Button onClick={addSearchTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.searchTags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button onClick={() => removeSearchTag(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <button className="text-blue-600 text-sm mt-2 hover:underline">
                + Add search tag
              </button>
            </div>

            <div className="border-t pt-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  console.log('Launch Tag Editor');
                }}
              >
                Launch Tag Editor
              </Button>
            </div>

            {isEdit && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-green-600 mb-2">Activities</h3>
                <div className="bg-green-50 p-3 rounded">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                    <span className="text-lg">+</span>
                    Add activity
                  </button>
                </div>
                <p className="text-blue-600 hover:underline cursor-pointer mt-2">
                  {template?.name || 'Template activity'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalTemplateForm;
