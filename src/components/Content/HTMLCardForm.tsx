
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Heart, RefreshCw, Video, Image, FileText, Eye, Code, Move, RotateCcw, Copy, Download } from 'lucide-react';

interface HTMLCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  card?: any;
}

const HTMLCardForm: React.FC<HTMLCardFormProps> = ({ isOpen, onClose, card }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'No link',
    template: 'flexible-card',
    mediaCarousel: {
      video: false,
      image: false,
      template: false
    },
    author: '',
    htmlCode: `<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; text-align: center; color: white;">
  <h2>Hello World!</h2>
  <p>This is a sample HTML card. Try editing the code!</p>
  <button style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Click me</button>
</div>`
  });

  const [previewHtml, setPreviewHtml] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  const exampleSnippets = [
    {
      name: "Gradient Card",
      code: `<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; text-align: center; color: white;">
  <h2>Gradient Card</h2>
  <p>Beautiful gradient background</p>
</div>`
    },
    {
      name: "Product Card",
      code: `<div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; max-width: 300px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <img src="https://via.placeholder.com/250x150" alt="Product" style="width: 100%; border-radius: 4px; margin-bottom: 12px;">
  <h3 style="margin: 0 0 8px 0; color: #333;">Product Name</h3>
  <p style="color: #666; margin: 0 0 12px 0;">Short product description here</p>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 20px; font-weight: bold; color: #e74c3c;">$29.99</span>
    <button style="background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Add to Cart</button>
  </div>
</div>`
    }
  ];

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name || '',
        type: card.type || 'No link',
        template: card.template || 'flexible-card',
        mediaCarousel: card.mediaCarousel || {
          video: false,
          image: false,
          template: false
        },
        author: card.author || '',
        htmlCode: card.htmlCode || formData.htmlCode
      });
      setPreviewHtml(card.htmlCode || formData.htmlCode);
    } else {
      setPreviewHtml(formData.htmlCode);
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('HTML Card form submitted:', formData);
    onClose();
  };

  const handlePreview = () => {
    setPreviewHtml(formData.htmlCode);
  };

  const handleReset = () => {
    const resetCode = exampleSnippets[0].code;
    setFormData({ ...formData, htmlCode: resetCode });
    setPreviewHtml(resetCode);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(formData.htmlCode);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formData.htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'html-card.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = (code: string) => {
    setFormData({ ...formData, htmlCode: code });
    setPreviewHtml(code);
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    setIsDragging(true);
    const rect = cardRef.current.getBoundingClientRect();
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragRef.current.offsetX,
      y: e.clientY - dragRef.current.offsetY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{card ? 'Edit HTML Card' : 'New HTML Card'}</DialogTitle>
            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 text-white" onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Card name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No link">No link</SelectItem>
                    <SelectItem value="External link">External link</SelectItem>
                    <SelectItem value="Internal link">Internal link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData({ ...formData, template: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible-card">flexible-card</SelectItem>
                    <SelectItem value="basic-card">basic-card</SelectItem>
                    <SelectItem value="advanced-card">advanced-card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
            </form>

            {/* Example Snippets */}
            <div className="space-y-2">
              <Label>Example Snippets</Label>
              <div className="space-y-2">
                {exampleSnippets.map((snippet, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                    <span className="font-medium text-sm">{snippet.name}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => loadExample(snippet.code)}
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HTML Editor Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              <Label className="text-lg font-semibold">HTML Editor</Label>
            </div>
            
            <Textarea
              value={formData.htmlCode}
              onChange={(e) => setFormData({ ...formData, htmlCode: e.target.value })}
              placeholder="Enter your HTML code here..."
              className="font-mono text-sm min-h-[300px] resize-none"
            />
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handlePreview} size="sm" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleReset} size="sm" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button variant="outline" onClick={handleCopyCode} size="sm" className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={handleDownload} size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <div 
              ref={cardRef}
              className={`border rounded-lg ${isDragging ? 'shadow-lg cursor-grabbing' : 'cursor-grab'}`}
              style={{
                position: isDragging ? 'fixed' : 'relative',
                left: isDragging ? `${position.x}px` : 'auto',
                top: isDragging ? `${position.y}px` : 'auto',
                zIndex: isDragging ? 1000 : 'auto'
              }}
            >
              <div 
                className="p-4 border-b cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center gap-2">
                  <Move className="w-5 h-5" />
                  <span className="font-semibold">Live Preview</span>
                  <Badge variant="secondary" className="ml-auto">
                    Draggable
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="min-h-[200px] border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 p-4">
                  {previewHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Click "Preview" to see your HTML rendered here
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Info */}
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">HTML Length:</span>
                  <span className="font-mono">{formData.htmlCode.length} chars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lines:</span>
                  <span className="font-mono">{formData.htmlCode.split('\n').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drag Status:</span>
                  <Badge variant={isDragging ? "default" : "secondary"}>
                    {isDragging ? "Dragging" : "Static"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HTMLCardForm;
