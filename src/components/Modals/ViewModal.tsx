
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type: string;
}

const ViewModal = ({ isOpen, onClose, title, data, type }: ViewModalProps) => {
  if (!data) return null;

  const renderContent = () => {
    switch (type) {
      case 'content':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <p className="text-gray-900">{data.title || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Badge>{data.type || 'Unknown'}</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Badge className="bg-green-100 text-green-800">{data.status || 'Published'}</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-600">{data.description || 'No description available'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-gray-600">{data.updated_at || data.created_at || 'Unknown'}</p>
            </div>
          </div>
        );
      
      case 'collection':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{data.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-600">{data.description || 'No description available'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Items</label>
              <p className="text-gray-900">{data.content || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activities</label>
              <p className="text-gray-900">{data.activities || 'none'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
              <Badge>{data.private || 'Public'}</Badge>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{data.name || data.title || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Badge>{data.type || 'Unknown'}</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <p className="text-gray-600">{data.size || 'Unknown'}</p>
            </div>
            {data.url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                <img src={data.url} alt={data.name} className="max-w-full h-48 object-cover rounded" />
              </div>
            )}
          </div>
        );

      case 'category':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{data.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <p className="text-gray-900">{data.order || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Templates</label>
              <p className="text-gray-900">{data.goalTemplates || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filters</label>
              <p className="text-gray-900">{data.filters || 'none'}</p>
            </div>
            {data.image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <img src={data.image} alt={data.name} className="w-16 h-16 object-cover rounded" />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <p className="text-gray-900">{String(value) || 'N/A'}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;
