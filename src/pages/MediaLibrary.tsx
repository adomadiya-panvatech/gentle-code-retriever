import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search, Upload, Trash2, Edit, Eye } from 'lucide-react';
import ViewModal from '../components/Modals/ViewModal';
import { useAuth } from '../context/AuthContext';
import { getMediaLibrarys, createMediaLibrary, deleteMediaLibrary, updateMediaLibrary } from '../services/mediaLibraryService';
import { useToast } from '../hooks/use-toast';

const MediaLibrary = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingMedia, setViewingMedia] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [mediaType, setMediaType] = useState("image"); // Default media type
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [editMediaType, setEditMediaType] = useState("image");
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const itemsPerPage = 12; // Grid layout works better with 12 items

  const mockMedia = [
    { id: 1, name: 'wellness-banner.jpg', type: 'image', size: '2.5 MB', url: '/lovable-uploads/wellness-banner.jpg', uploaded: '2023-12-01' },
    { id: 2, name: 'meditation-video.mp4', type: 'video', size: '15.2 MB', url: '/lovable-uploads/meditation-video.mp4', uploaded: '2023-12-02' },
    { id: 3, name: 'healthy-recipe.pdf', type: 'document', size: '1.8 MB', url: '/lovable-uploads/healthy-recipe.pdf', uploaded: '2023-12-03' },
    { id: 4, name: 'exercise-routine.jpg', type: 'image', size: '3.1 MB', url: '/lovable-uploads/exercise-routine.jpg', uploaded: '2023-12-04' },
    { id: 5, name: 'mindfulness-audio.mp3', type: 'audio', size: '8.7 MB', url: '/lovable-uploads/mindfulness-audio.mp3', uploaded: '2023-12-05' },
    { id: 6, name: 'nutrition-guide.pdf', type: 'document', size: '2.3 MB', url: '/lovable-uploads/nutrition-guide.pdf', uploaded: '2023-12-06' },
    { id: 7, name: 'yoga-poses.jpg', type: 'image', size: '1.9 MB', url: '/lovable-uploads/yoga-poses.jpg', uploaded: '2023-12-07' },
    { id: 8, name: 'sleep-sounds.mp3', type: 'audio', size: '12.4 MB', url: '/lovable-uploads/sleep-sounds.mp3', uploaded: '2023-12-08' },
    { id: 9, name: 'workout-tutorial.mp4', type: 'video', size: '25.6 MB', url: '/lovable-uploads/workout-tutorial.mp4', uploaded: '2023-12-09' },
    { id: 10, name: 'meal-plan.pdf', type: 'document', size: '1.5 MB', url: '/lovable-uploads/meal-plan.pdf', uploaded: '2023-12-10' },
    { id: 11, name: 'nature-sounds.mp3', type: 'audio', size: '18.3 MB', url: '/lovable-uploads/nature-sounds.mp3', uploaded: '2023-12-11' },
    { id: 12, name: 'fitness-tracker.jpg', type: 'image', size: '2.8 MB', url: '/lovable-uploads/fitness-tracker.jpg', uploaded: '2023-12-12' },
    { id: 13, name: 'wellness-tips.pdf', type: 'document', size: '3.2 MB', url: '/lovable-uploads/wellness-tips.pdf', uploaded: '2023-12-13' },
    { id: 14, name: 'relaxation-video.mp4', type: 'video', size: '22.1 MB', url: '/lovable-uploads/relaxation-video.mp4', uploaded: '2023-12-14' },
    { id: 15, name: 'healthy-lifestyle.jpg', type: 'image', size: '4.1 MB', url: '/lovable-uploads/healthy-lifestyle.jpg', uploaded: '2023-12-15' }
  ];

  const fetchMedia = async () => {
    if (!token) {
      // Use mock data when no token
      const filtered = mockMedia.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || item.type === selectedType;
        return matchesSearch && matchesType;
      });

      const totalItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);

      setMedia(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      return;
    }

    setLoading(true);
    try {
      const response = await getMediaLibrarys(token);
      const allMedia = response.data || response;
      const filtered = allMedia.filter((item: any) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || item.type === selectedType;
        return matchesSearch && matchesType;
      });

      const totalItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);

      setMedia(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('Error fetching media:', error);
      // Fallback to mock data
      const filtered = mockMedia.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || item.type === selectedType;
        return matchesSearch && matchesType;
      });

      const totalItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);

      setMedia(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));

      toast({
        title: "Error",
        description: "Failed to load media, showing sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [currentPage, searchTerm, selectedType, token]);

  const handleView = (item: any) => {
    setViewingMedia(item);
    setShowViewModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !token) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("media_type", mediaType);
    tags.forEach((tag) => formData.append("tags[]", tag));
    formData.append("file", selectedFiles[0]); // only uploading the first file

    try {
      await createMediaLibrary(formData, token);

      toast({
        title: "Upload successful",
        description: `${name} uploaded successfully.`,
      });

      // Refresh media
      fetchMedia();

      // Reset fields
      setSelectedFiles([]);
      setName("");
      setTags([]);
      setTagInput("");
      setMediaType("image");
      setIsUploadModalOpen(false);
    } catch (error: any) {
      console.error("Upload failed", error);
      toast({
        title: "Upload failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

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

  const handleDelete = async (id: number) => {
    if (!token) return;

    const confirmed = window.confirm("Are you sure you want to delete this media?");
    if (!confirmed) return;

    try {
      await deleteMediaLibrary(id.toString(), token);

      toast({
        title: "Deleted",
        description: "Media deleted successfully.",
        variant: "success",
      });

      // Refresh media list
      fetchMedia();
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Error",
        description: "Failed to delete media.",
        variant: "destructive",
      });
    }
  };

  const handleEditSave = async () => {
    if (!editingMedia || !token) return;

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("media_type", editMediaType);
    editTags.forEach(tag => formData.append("tags[]", tag));

    if (editSelectedFile) {
      formData.append("file", editSelectedFile);
    }

    try {
      // Assume you have an updateMediaLibrary API function (similar to createMediaLibrary)
      await updateMediaLibrary(editingMedia.id, formData, token);

      toast({
        title: "Update successful",
        description: `${editName} updated successfully.`,
      });

      // Refresh media list
      fetchMedia();

      // Reset and close modal
      setIsEditModalOpen(false);
      setEditingMedia(null);
      setEditSelectedFile(null);
    } catch (error: any) {
      console.error("Update failed", error);
      toast({
        title: "Update failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const mediaTypes = ['all', 'image', 'video', 'audio', 'document'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Media Library</h1>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search media files..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {mediaTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "secondary"}
                  className={`cursor-pointer capitalize ${selectedType === type
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  onClick={() => handleTypeChange(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">Loading media...</div>
        ) : media.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No media files found
          </div>
        ) : (
          media.map((item) => (
            <Card
              key={item.id}
              className="border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition-transform"
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.type === 'image' ? (
                      <ImageWithBuffer item={item} />
                    ) : item.type === 'video' && item.poster ? (
                      <img src={item.poster} alt="Video thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-4xl text-gray-400">
                        {item.type === 'video' && '🎥'}
                        {item.type === 'audio' && '🎵'}
                        {item.type === 'document' && '📄'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.size || '—'}</p>
                    <p className="text-xs text-gray-400 truncate">{item.filename}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags && item.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs lowercase">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleView(item)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditingMedia(item);
                        setEditName(item.name.replace(/\.[^/.]+$/, "")); // name without extension
                        setEditTags(item.tags || []);
                        setEditMediaType(item.type);
                        setEditSelectedFile(null);
                        setEditTagInput("");
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Dropzone */}
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Drag and drop files here or click to browse</p>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                setSelectedFiles(files);
                if (files.length === 1) setName(files[0].name.replace(/\.[^/.]+$/, ""));
              }}
            />

            {/* Name Input */}
            <input
              type="text"
              placeholder="Enter name"
              className="w-full border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Media Type Selector */}
            <select
              className="w-full border rounded p-2"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            >
              {mediaTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Tag Input */}
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center"
                  >
                    {tag}
                    <button
                      className="ml-1 text-red-500"
                      onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tag and press Enter"
                className="w-full border rounded p-2"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput("");
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleUpload}
              disabled={!selectedFiles.length}
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Optional: file replace */}
            <label htmlFor="edit-file-upload" className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Drag and drop or click to replace file (optional)</p>
              </div>
            </label>
            <input
              id="edit-file-upload"
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setEditSelectedFile(file);
                if (file) setEditName(file.name.replace(/\.[^/.]+$/, ""));
              }}
            />

            {/* Name Input */}
            <input
              type="text"
              placeholder="Enter name"
              className="w-full border rounded p-2"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            {/* Media Type Selector */}
            <select
              className="w-full border rounded p-2"
              value={editMediaType}
              onChange={(e) => setEditMediaType(e.target.value)}
            >
              {mediaTypes.filter(type => type !== "all").map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Tag Input */}
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {editTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center"
                  >
                    {tag}
                    <button
                      className="ml-1 text-red-500"
                      onClick={() => setEditTags(editTags.filter((_, i) => i !== idx))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tag and press Enter"
                className="w-full border rounded p-2"
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editTagInput.trim()) {
                    setEditTags([...editTags, editTagInput.trim()]);
                    setEditTagInput("");
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleEditSave}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingMedia(null);
        }}
        title="View Media"
        data={viewingMedia}
        type="media"
      />
    </div>
  );
};

export default MediaLibrary;
