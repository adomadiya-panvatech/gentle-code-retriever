
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload } from 'lucide-react';

interface PlanTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  template?: any;
}

const PlanTemplateForm: React.FC<PlanTemplateFormProps> = ({ 
  isOpen, 
  onClose, 
  template 
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    image: template?.image || null,
    socialTagPreview: template?.socialTagPreview || false,
    goalTemplates: template?.goalTemplates || ''
  });

  const handleSave = () => {
    console.log('Saving plan template:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900 text-xl font-semibold">
            {template ? 'Edit Plan Template' : 'New Plan Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="w-48 h-32 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt="Template" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-gray-500 text-sm">Upload Image</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="socialTag"
              checked={formData.socialTagPreview}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, socialTagPreview: checked }))}
            />
            <label htmlFor="socialTag" className="text-sm">
              Social Tag Preview (Optional)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Templates
            </label>
            <Select value={formData.goalTemplates} onValueChange={(value) => setFormData(prev => ({ ...prev, goalTemplates: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Goal Templates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template1">Template 1</SelectItem>
                <SelectItem value="template2">Template 2</SelectItem>
              </SelectContent>
            </Select>
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

export default PlanTemplateForm;
