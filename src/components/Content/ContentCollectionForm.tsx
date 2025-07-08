
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Camera } from 'lucide-react';

interface ContentCollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  collection?: any;
}

const ContentCollectionForm: React.FC<ContentCollectionFormProps> = ({ isOpen, onClose, collection }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    backgroundColor: '#000000',
    fontColor: '#000000',
    isPrivate: false
  });

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || '',
        description: collection.description || '',
        backgroundColor: collection.backgroundColor || '#000000',
        fontColor: collection.fontColor || '#000000',
        isPrivate: collection.isPrivate ?? false
      });
    }
  }, [collection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Collection form submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{collection ? 'Edit Collection' : 'Add Collection'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name (required)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short Description"
                className="min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 border border-gray-300 rounded"
                  style={{ backgroundColor: formData.backgroundColor }}
                ></div>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontColor">Font color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 border border-gray-300 rounded"
                  style={{ backgroundColor: formData.fontColor }}
                ></div>
                <Input
                  id="fontColor"
                  type="color"
                  value={formData.fontColor}
                  onChange={(e) => setFormData({ ...formData, fontColor: e.target.value })}
                  className="w-20"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Design guidelines:</strong> Choose a dark background color that complements the main image. 
                Leave the font color white unless necessary for readability against the background.
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 text-white">
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>CONTENT (DRAG TO REORDER)</Label>
              <Input
                placeholder="Search articles, recipes, or videos..."
                className="mb-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: !!checked })}
                />
                <Label htmlFor="isPrivate">Private</Label>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">
                Set Tags here after saving this content collection.
              </p>
            </div>

            {/* Preview */}
            <div className="flex justify-center">
              <div className="w-64 h-40 bg-gray-200 rounded flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentCollectionForm;
