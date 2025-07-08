
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import GoalTemplateForm from '../components/Content/GoalTemplateForm';
import { Search, Star, Eye, Copy, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as goalTemplateService from '../services/goalTemplateService';

const GoalTemplates = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('available');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  const fetchTemplates = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await goalTemplateService.getGoalTemplates(token, page, itemsPerPage);
      console.log('Goal templates response:', response);
      setTemplates(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching goal templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch goal templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates(currentPage);
  }, [currentPage, token]);

  const handleEdit = (template: any) => {
    console.log('Editing template:', template);
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleView = (template: any) => {
    console.log('Viewing template:', template);
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    setIsFormOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredTemplates = templates.filter(template =>
    template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Goal Templates</h1>
        <Button 
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white text-sm flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Goal Template
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border-b">
          <TabsTrigger 
            value="available" 
            className="data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Available
          </TabsTrigger>
          <TabsTrigger 
            value="private"
            className="data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Private
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <Card className="border-gray-200">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">Loading goal templates...</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="font-semibold text-gray-900">Image</TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center gap-1">
                            Name
                            <span className="text-gray-400">▲</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">Activities</TableHead>
                        <TableHead className="font-semibold text-gray-900">Taxonomies</TableHead>
                        <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTemplates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                            No goal templates found. Click "Add Goal Template" to create your first template.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTemplates.map((template) => (
                          <TableRow key={template.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <TableCell>
                              {template.image && (
                                <img 
                                  src={template.image} 
                                  alt={template.name || template.title}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <span 
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() => handleView(template)}
                              >
                                {template.name || template.title}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {template.activities || 0}
                                <Search className="w-4 h-4 text-gray-400" />
                                <Star className="w-4 h-4 text-gray-400" />
                              </div>
                            </TableCell>
                            <TableCell>{template.taxonomies || 0}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEdit(template)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Edit"
                                >
                                  <Eye className="w-4 h-4 text-gray-500" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <span className="text-gray-500 font-mono">ID</span>
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Trash2 className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

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

        <TabsContent value="private" className="mt-6">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <p>No private templates found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <GoalTemplateForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        template={editingTemplate}
        isEdit={!!editingTemplate}
      />
    </div>
  );
};

export default GoalTemplates;
