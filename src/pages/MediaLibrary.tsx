
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search, Upload, Play, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as videoService from '../services/videoService';
import * as audioFileService from '../services/audioFileService';

const MediaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [audioFiles, setAudioFiles] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('videos');
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  const fetchVideos = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await videoService.getVideos(token, page, itemsPerPage);
      setVideos(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAudioFiles = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await audioFileService.getAudioFiles(token, page, itemsPerPage);
      setAudioFiles(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching audio files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audio files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'videos') {
      fetchVideos(currentPage);
    } else if (activeTab === 'audio') {
      fetchAudioFiles(currentPage);
    }
  }, [activeTab, currentPage, token]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getFilteredData = () => {
    let data = [];
    if (activeTab === 'videos') data = videos;
    else if (activeTab === 'audio') data = audioFiles;
    else data = images;

    return data.filter(item =>
      (item.name || item.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Media Library</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload {activeTab === 'videos' ? 'video' : activeTab === 'audio' ? 'audio' : 'image'}
        </Button>
      </div>

      {/* Media Type Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-gray-100">
          <TabsTrigger 
            value="videos" 
            className="data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Videos ({videos.length})
          </TabsTrigger>
          <TabsTrigger 
            value="audio" 
            className="data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Audio ({audioFiles.length})
          </TabsTrigger>
          <TabsTrigger 
            value="images" 
            className="data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Images ({images.length})
          </TabsTrigger>
        </TabsList>

        {/* Search */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search name, tags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        <TabsContent value="videos" className="space-y-4">
          <Card className="border-gray-200">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">Loading videos...</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-900">Name</th>
                          <th className="text-left p-4 font-medium text-gray-900">Modified</th>
                          <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="p-12 text-center text-gray-500">
                              No videos found
                            </td>
                          </tr>
                        ) : (
                          filteredData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                                    <Play className="w-6 h-6 text-white bg-green-600 rounded-full p-1" />
                                  </div>
                                  <span className="font-medium text-blue-600">
                                    {item.name || item.title || 'Untitled'}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 text-gray-600">
                                {item.updated_at || item.created_at || 'Unknown'}
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 px-3 text-blue-600">
                                    ID: {item.id}
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t">
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <Card className="border-gray-200">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">Loading audio files...</div>
              ) : audioFiles.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No audio files</h3>
                    <p className="text-gray-500">Upload your first audio file to get started</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">Name</th>
                        <th className="text-left p-4 font-medium text-gray-900">Modified</th>
                        <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <span className="font-medium text-blue-600">
                              {item.name || item.title || 'Untitled'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            {item.updated_at || item.created_at || 'Unknown'}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="h-8 px-3 text-blue-600">
                                ID: {item.id}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images</h3>
                <p className="text-gray-500">Upload your first image to get started</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaLibrary;
