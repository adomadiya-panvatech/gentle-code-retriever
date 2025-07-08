
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Camera } from 'lucide-react';

interface ArticleFormProps {
  isOpen: boolean;
  onClose: () => void;
  article?: any;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ isOpen, onClose, article }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    allowLikes: true,
    allowSave: true,
    allowClose: true,
    hideInUserHistory: false,
    tag: '',
    isPrivate: false,
    companies: []
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        description: article.description || '',
        allowLikes: article.allowLikes ?? true,
        allowSave: article.allowSave ?? true,
        allowClose: article.allowClose ?? true,
        hideInUserHistory: article.hideInUserHistory ?? false,
        tag: article.tag || '',
        isPrivate: article.isPrivate ?? false,
        companies: article.companies || []
      });
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Article form submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{article ? 'Edit Article' : 'New Article'}</DialogTitle>
            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 text-white">
                Save
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              Details
              <span className="bg-orange-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">!</span>
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              Editor
              <span className="bg-orange-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">!</span>
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-2">
              Tags
              <span className="bg-orange-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">!</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                  <div className="w-full h-32 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                
                <div className="col-span-9 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-red-600">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Article Title"
                      className="border-red-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-red-600">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Content description (required)"
                      className="min-h-32 border-red-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowLikes"
                        checked={formData.allowLikes}
                        onCheckedChange={(checked) => setFormData({ ...formData, allowLikes: !!checked })}
                      />
                      <Label htmlFor="allowLikes" className="flex items-center gap-2">
                        Allow likes
                        <span className="text-blue-600">♡</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowSave"
                        checked={formData.allowSave}
                        onCheckedChange={(checked) => setFormData({ ...formData, allowSave: !!checked })}
                      />
                      <Label htmlFor="allowSave" className="flex items-center gap-2">
                        Allow save
                        <span className="text-blue-600">🔖</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowClose"
                        checked={formData.allowClose}
                        onCheckedChange={(checked) => setFormData({ ...formData, allowClose: !!checked })}
                      />
                      <Label htmlFor="allowClose" className="flex items-center gap-2">
                        Allow close
                        <span className="text-blue-600">⊗</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hideInUserHistory"
                        checked={formData.hideInUserHistory}
                        onCheckedChange={(checked) => setFormData({ ...formData, hideInUserHistory: !!checked })}
                      />
                      <Label htmlFor="hideInUserHistory">Hide in user history</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tag">Tag</Label>
                    <Select value={formData.tag} onValueChange={(value) => setFormData({ ...formData, tag: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="wellness">Wellness</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPrivate"
                        checked={formData.isPrivate}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: !!checked })}
                      />
                      <Label htmlFor="isPrivate" className="font-medium">Private</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      This content is only searchable for the following
                    </p>
                    <p className="font-medium text-gray-900">Companies</p>
                    <div className="w-full h-20 border border-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Content Editor</Label>
                <div className="min-h-64 border border-gray-300 rounded p-4 bg-gray-50">
                  <p className="text-gray-500">Rich text editor would go here...</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tags" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Tags Management</Label>
                <div className="min-h-32 border border-gray-300 rounded p-4 bg-gray-50">
                  <p className="text-gray-500">Tag management interface would go here...</p>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleForm;
