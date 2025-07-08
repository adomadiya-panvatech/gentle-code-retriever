
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Upload } from 'lucide-react';

interface GoalCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
}

const GoalCategoryForm: React.FC<GoalCategoryFormProps> = ({ 
  isOpen, 
  onClose, 
  category 
}) => {
  const [formData, setFormData] = useState({
    title: category?.title || '',
    description: category?.description || '',
    image: category?.image || null
  });

  const handleSave = () => {
    console.log('Saving goal category:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900 text-xl font-semibold">
            Goal Category
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Name (required)"
              className="w-full"
            />
            {!formData.title && (
              <p className="text-red-500 text-sm mt-1">Name cannot be left empty!</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="w-full h-24"
            />
          </div>

          <div className="w-48 h-48 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            {formData.image ? (
              <img 
                src={formData.image} 
                alt="Category" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Upload Image</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Goal Templates</h3>
              <p className="text-gray-500">Loading Goal Templates...</p>
            </div>
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

export default GoalCategoryForm;
