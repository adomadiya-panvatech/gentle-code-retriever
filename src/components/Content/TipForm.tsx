
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent } from '../ui/card';
import { Camera, Heart, Share, X } from 'lucide-react';

interface TipFormProps {
  isOpen: boolean;
  onClose: () => void;
  tip?: any;
}

const TipForm: React.FC<TipFormProps> = ({ isOpen, onClose, tip }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    authorTagline: '',
    tipType: 'Expert Tip',
    expiresAt: '',
    allowLikes: true,
    allowSave: true,
    allowClose: true,
    hideInUserHistory: false,
    isPrivate: false,
    tags: []
  });

  useEffect(() => {
    if (tip) {
      setFormData({
        title: tip.title || '',
        content: tip.content || '',
        author: tip.author || '',
        authorTagline: tip.authorTagline || '',
        tipType: tip.tipType || 'Expert Tip',
        expiresAt: tip.expiresAt || '',
        allowLikes: tip.allowLikes ?? true,
        allowSave: tip.allowSave ?? true,
        allowClose: tip.allowClose ?? true,
        hideInUserHistory: tip.hideInUserHistory ?? false,
        isPrivate: tip.isPrivate ?? false,
        tags: tip.tags || []
      });
    } else {
      setFormData({
        title: '',
        content: '',
        author: 'New Author',
        authorTagline: 'AUTHOR TAGLINE',
        tipType: 'Expert Tip',
        expiresAt: '09/03/2024',
        allowLikes: true,
        allowSave: true,
        allowClose: true,
        hideInUserHistory: false,
        isPrivate: false,
        tags: []
      });
    }
  }, [tip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tip form submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tip ? 'Edit Tip' : 'New Tip'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mobile Preview */}
          <div className="flex justify-center">
            <div className="w-80 h-96 bg-black rounded-3xl p-4 relative">
              <div className="w-full h-full bg-blue-600 rounded-2xl p-4 relative">
                <button className="absolute top-4 right-4 text-white">
                  <X className="w-5 h-5" />
                </button>
                
                <div className="bg-white rounded-lg p-4 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {formData.title || 'New tip title'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {formData.content || 'New tip text'}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{formData.author}</p>
                      <p className="text-xs text-gray-500">{formData.authorTagline}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-600">
                    <Heart className="w-4 h-4" />
                    <Share className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <Button className="flex-1 bg-blue-500 text-white">LEARN MORE</Button>
                  <Button className="flex-1 bg-blue-500 text-white">GOALS</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipType">TIP TYPE</Label>
              <Select value={formData.tipType} onValueChange={(value) => setFormData({ ...formData, tipType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Expert Tip">Expert Tip</SelectItem>
                  <SelectItem value="Quick Tip">Quick Tip</SelectItem>
                  <SelectItem value="Daily Tip">Daily Tip</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="New tip title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="New tip text"
                className="min-h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorTagline">Author Tagline</Label>
                <Input
                  id="authorTagline"
                  value={formData.authorTagline}
                  onChange={(e) => setFormData({ ...formData, authorTagline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relatedContent">RELATED CONTENT</Label>
              <Input
                placeholder="Search articles, recipes, or videos..."
                className="mb-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires at</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>TAGS</Label>
              <Button type="button" className="bg-blue-500 text-white">
                Launch Tag Editor
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowLikes"
                  checked={formData.allowLikes}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowLikes: !!checked })}
                />
                <Label htmlFor="allowLikes">Allow likes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowSave"
                  checked={formData.allowSave}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowSave: !!checked })}
                />
                <Label htmlFor="allowSave">Allow save</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowClose"
                  checked={formData.allowClose}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowClose: !!checked })}
                />
                <Label htmlFor="allowClose">Allow close</Label>
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

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-blue-500 text-white">
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TipForm;
