
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search, Plus, Link as LinkIcon, Eye, Edit3 } from 'lucide-react';
import TipForm from '../components/Content/TipForm';
import ArticleForm from '../components/Content/ArticleForm';
import HTMLCardForm from '../components/Content/HTMLCardForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as tipService from '../services/tipService';
import * as contentService from '../services/contentService';

const ContentLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showTipForm, setShowTipForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showHTMLCardForm, setShowHTMLCardForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [tips, setTips] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  const contentTypes = [
    { id: 'all', label: 'All', color: 'bg-gray-100 text-gray-800' },
    { id: 'article', label: 'Article', color: 'bg-green-100 text-green-800' },
    { id: 'video', label: 'Video', color: 'bg-blue-100 text-blue-800' },
    { id: 'tip', label: 'Tip', color: 'bg-purple-100 text-purple-800' },
    { id: 'Wellness-article', label: 'Wellness Article', color: 'bg-orange-100 text-orange-800' },
    { id: 'html-card', label: 'HTML Card', color: 'bg-pink-100 text-pink-800' },
  ];

  const fetchTips = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await tipService.getTips(token);
      setTips(response.data || response);
    } catch (error) {
      console.error('Error fetching tips:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tips",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await contentService.getContent(token);
      setContent(response.data || response);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips(currentPage);
    fetchContent(currentPage);
  }, [currentPage, token]);

  // Combine all content items
  const allContentItems = [
    ...tips.map(tip => ({ ...tip, type: 'tip' })),
    ...content.map(item => ({ ...item, type: 'article' }))
  ];

  const filteredContent = allContentItems.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Calculate pagination for filtered content
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const calculatedTotalPages = Math.ceil(filteredContent.length / itemsPerPage);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (item.type === 'tip') {
      setShowTipForm(true);
    } else if (item.type === 'article') {
      setShowArticleForm(true);
    } else if (item.type === 'html') {
      setShowHTMLCardForm(true);
    }
  };

  const handleView = (item: any) => {
    console.log('Viewing item:', item);
    // Implement view functionality
  };

  const handleAddTip = () => {
    setEditingItem(null);
    setShowTipForm(true);
  };

  const handleAddArticle = () => {
    setEditingItem(null);
    setShowArticleForm(true);
  };

  const handleAddHTMLCard = () => {
    setEditingItem(null);
    setShowHTMLCardForm(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Content Library</h1>
        <div className="flex gap-2">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddTip}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tip
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddArticle}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Wellness Article
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddHTMLCard}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add HTML Card
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search articles, recipes, or videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              {contentTypes.map((type) => (
                <Badge
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "secondary"}
                  className={`cursor-pointer ${
                    selectedType === type.id 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-700">Taxonomy descendants: Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-700">Taxonomy Operator: Or</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">Pending</Badge>
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
              <Badge className="bg-green-100 text-green-800">Rejected</Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300">
                Search
              </Button>
              <Button variant="ghost" className="text-gray-600">
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading content...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                      <th className="text-left p-4 font-medium text-gray-900">Type</th>
                      <th className="text-left p-4 font-medium text-gray-900">Title</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Updated</th>
                      <th className="text-left p-4 font-medium text-gray-900">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedContent.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-gray-500">
                          No content found
                        </td>
                      </tr>
                    ) : (
                      paginatedContent.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <LinkIcon className="w-4 h-4" />
                              </Button>
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
                                onClick={() => handleEdit(item)}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-gray-100 text-gray-800">
                              {item.type.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-4 text-blue-600 font-medium">{item.title || 'Untitled'}</td>
                          <td className="p-4">
                            <Badge className="bg-green-100 text-green-800">
                              {item.status || 'Published'}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600">{item.updated_at || item.created_at || 'Unknown'}</td>
                          <td className="p-4 text-gray-600">{item.views || 0}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {calculatedTotalPages > 1 && (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {[...Array(Math.min(5, calculatedTotalPages))].map((_, i) => {
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
                          onClick={() => currentPage < calculatedTotalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === calculatedTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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

      {/* Form Dialogs */}
      <TipForm
        isOpen={showTipForm}
        onClose={() => {
          setShowTipForm(false);
          setEditingItem(null);
        }}
        tip={editingItem}
      />

      <ArticleForm
        isOpen={showArticleForm}
        onClose={() => {
          setShowArticleForm(false);
          setEditingItem(null);
        }}
        article={editingItem}
      />

      <HTMLCardForm
        isOpen={showHTMLCardForm}
        onClose={() => {
          setShowHTMLCardForm(false);
          setEditingItem(null);
        }}
        card={editingItem}
      />
    </div>
  );
};

export default ContentLibrary;
