import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import {
  FileText,
  Image as ImageIcon,
  Lock,
  Globe,
  Info,
  CheckCircle,
  Folder,
  PlayCircle,
  Settings,
  List,
} from 'lucide-react'; // Ensure lucide-react is installed

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type: string;
}

const ViewModal = ({ isOpen, onClose, title, data, type }: ViewModalProps) => {
  if (!data) return null;

  console.log("data", data);

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{children}</label>
  );

  const Field = ({ label, value, icon }: { label: string; value: any; icon?: React.ReactNode }) => (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
        {icon}
        {value ?? 'N/A'}
      </div>
    </div>
  );

  function ImageWithBuffer({ item }) {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
      if (item.type === 'image') {
        if (item.file && item.file.type === 'Buffer' && Array.isArray(item.file.data)) {
          // Convert Buffer data array to Blob URL
          const byteArray = new Uint8Array(item.file.data);
          const blob = new Blob([byteArray], { type: item.mimeType || 'image/png' }); // optionally get mimeType from item or fallback
          const url = URL.createObjectURL(blob);
          setImageSrc(url);

          return () => {
            URL.revokeObjectURL(url); // Cleanup
          };
        } else if (item.url) {
          // Use URL string directly if available
          setImageSrc(item.url);
        }
      }
    }, [item]);

    if (item.type !== 'image') return null;

    return (
      <img
        src={imageSrc}
        alt={item.name}
        className="w-full h-full object-cover"
      />
    );
  }

  // Helper function for mm-dd-yyyy date format
  function formatDate(dateStr: string | Date | undefined): string {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  }

  const renderContent = () => {
    switch (type) {
      case 'content':
        return (
          <div className="space-y-4">
            <Field
              label="Description"
              value={data.description || <em className="text-gray-400">No description available</em>}
              icon={<Info size={16} />}
            />
            {/* Only render details/sections if data.content exists */}
            {data.content && typeof data.content.details === 'string' && (
              <div className="bg-white border rounded-md p-4 shadow-sm">
                <Label>Details</Label>
                <p className="text-sm text-gray-600">{data.content.details}</p>
              </div>
            )}
            {data.content && Array.isArray(data.content.sections) && data.content.sections.length > 0 && (
              <div className="bg-white border rounded-md p-4 shadow-sm">
                <Label>Sections</Label>
                <ul className="text-sm text-gray-600">
                  {data.content.sections.map((section, index) => (
                    <li key={index}>{section}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'collection':
        return (
          <div className="space-y-4">
            <Field label="Name" value={data.name} icon={<Folder size={16} />} />
            <Field label="Description" value={data.description} icon={<Info size={16} />} />
            {/* <Field label="Content Items" value={data.content ?? 0} icon={<FileText size={16} />} /> */}
            <Field
              label="Content Items"
              value={
                typeof data.content === 'number'
                  ? data.content
                  : Array.isArray(data.content?.sections)
                    ? data.content.sections.length
                    : 0
              }
              icon={<FileText size={16} />}
            />

            <Field label="Activities" value={data.activities || 'none'} icon={<PlayCircle size={16} />} />
            <Field
              label="Privacy"
              value={<Badge className="bg-slate-100 text-slate-800 flex items-center gap-1">
                {data.private ? <Lock size={14} /> : <Globe size={14} />}
                {data.private ? 'Private' : 'Public'}
              </Badge>}
              icon={data.private ? <Lock size={16} /> : <Globe size={16} />}
            />
          </div>
        );

      case 'media': {
        const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

        React.useEffect(() => {
          if (!data?.file?.data || !data?.file?.type) return;

          // Convert buffer to Uint8Array
          const byteArray = new Uint8Array(data.file.data);

          // Create Blob and Object URL
          const blob = new Blob([byteArray], { type: data.file.type });
          const url = URL.createObjectURL(blob);

          setPreviewUrl(url);

          // Cleanup
          return () => URL.revokeObjectURL(url);
        }, [data]);

        const renderMediaPreview = () => {
          if (!previewUrl) return <p className="text-sm text-gray-500 italic">Generating preview...</p>;

          const mimeType = data.file.type;

          if (data.type === 'image') {
            return <ImageWithBuffer item={data} />;
          }

          if (mimeType.startsWith('video/')) {
            return <video src={previewUrl} controls className="w-full h-64 bg-black rounded" />;
          }

          if (mimeType.startsWith('audio/')) {
            return <audio src={previewUrl} controls className="w-full mt-2" />;
          }

          if (mimeType === 'application/pdf') {
            return <iframe src={previewUrl} className="w-full h-[500px] border rounded" title="PDF Preview" />;
          }

          return <p className="text-sm text-gray-500 italic">Unsupported file type for preview.</p>;
        };

        return (
          <div className="space-y-4">
            <Field label="Name" value={data.name || data.title} icon={<ImageIcon size={16} />} />
            <Field label="Type" value={<Badge>{data.file?.type || 'Unknown'}</Badge>} icon={<List size={16} />} />
            <Field label="Size" value={data.size || 'Unknown'} icon={<FileText size={16} />} />

            <div className="bg-white border rounded-md p-4 shadow-sm">
              <Label>Preview</Label>
              {renderMediaPreview()}
            </div>
          </div>
        );
      }

      case 'category':
        return (
          <div className="space-y-4">
            <Field label="Name" value={data.name} icon={<Folder size={16} />} />
            <Field label="Order" value={data.order || 'N/A'} icon={<List size={16} />} />
            <Field label="Goal Templates" value={Array.isArray(data.goalTemplates) ? data.goalTemplates.length : 0} icon={<Settings size={16} />} />
            <Field label="Filters" value={data.filters || 'none'} icon={<List size={16} />} />
            {data.image && (
              <div className="bg-white border rounded-md p-4 shadow-sm">
                <Label>Image</Label>
                <img src={data.image} alt={data.name} className="w-16 h-16 object-cover rounded" />
              </div>
            )}
          </div>
        );

      case 'template':
        return (
          <div className="space-y-4">
            <Field label="Name" value={data.name || data.activity || 'N/A'} icon={<Folder size={16} />} />
            <Field label="Activity" value={data.activity || 'N/A'} icon={<PlayCircle size={16} />} />
            <Field label="State" value={data.state || 'N/A'} icon={<Badge>{data.state}</Badge>} />
            <Field label="Duration (weeks)" value={data.duration_in_weeks || 'N/A'} icon={<List size={16} />} />
            <Field label="Activities" value={Array.isArray(data.planned_events) ? data.planned_events.length : 0} icon={<FileText size={16} />} />
            <Field label="Taxonomies" value={Array.isArray(data.taxonomy_ids) ? data.taxonomy_ids.length : 0} icon={<Settings size={16} />} />
            <Field label="Start" value={formatDate(data.start)} icon={<Info size={16} />} />
            <Field label="End" value={formatDate(data.end)} icon={<Info size={16} />} />
            <Field label="Main Topic" value={data.main_topic || 'N/A'} icon={<Info size={16} />} />
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="bg-white border rounded-md p-4 shadow-sm">
                <Label>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <p className="text-gray-900">{String(value) || 'N/A'}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;
