import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Plus, Tags, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as taxonomyService from '../services/taxonomyService';

const Taxonomy = () => {
  const [editingTaxonomy, setEditingTaxonomy] = useState(null);
  const [taxonomies, setTaxonomies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  // Mock data for demonstration
  const mockTaxonomies = [
    { id: 1, name: 'Wellness', description: 'Health and wellness content', created_at: '2023-01-15' },
    { id: 2, name: 'Fitness', description: 'Physical fitness activities', created_at: '2023-01-20' },
    { id: 3, name: 'Nutrition', description: 'Diet and nutrition guidance', created_at: '2023-02-01' },
    { id: 4, name: 'Mental Health', description: 'Mental wellness resources', created_at: '2023-02-10' },
    { id: 5, name: 'Sleep', description: 'Sleep improvement content', created_at: '2023-02-15' },
    { id: 6, name: 'Stress Management', description: 'Stress reduction techniques', created_at: '2023-03-01' },
    { id: 7, name: 'Work-Life Balance', description: 'Professional and personal balance', created_at: '2023-03-10' },
    { id: 8, name: 'Meditation', description: 'Mindfulness and meditation', created_at: '2023-03-15' },
    { id: 9, name: 'Exercise', description: 'Physical exercise routines', created_at: '2023-04-01' },
    { id: 10, name: 'Mindfulness', description: 'Present moment awareness', created_at: '2023-04-10' },
    { id: 11, name: 'Self-Care', description: 'Personal care practices', created_at: '2023-04-15' },
    { id: 12, name: 'Goal Setting', description: 'Achievement and goal planning', created_at: '2023-05-01' },
    { id: 13, name: 'Time Management', description: 'Productivity and time use', created_at: '2023-05-10' },
    { id: 14, name: 'Communication', description: 'Interpersonal communication skills', created_at: '2023-05-15' },
    { id: 15, name: 'Leadership', description: 'Leadership development', created_at: '2023-06-01' }
  ];

  const fetchTaxonomies = async (page = 1) => {
    if (!token) {
      // Use mock data when no token
      const totalMockItems = mockTaxonomies.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockTaxonomies.slice(startIndex, endIndex);
      
      setTaxonomies(paginatedData);
      setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
      return;
    }

    setLoading(true);
    try {
      const response = await taxonomyService.getTaxonomies(token, page, itemsPerPage);
      console.log('Taxonomies response:', response);
      setTaxonomies(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching taxonomies:', error);
      // Fallback to mock data on error
      const totalMockItems = mockTaxonomies.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockTaxonomies.slice(startIndex, endIndex);
      
      setTaxonomies(paginatedData);
      setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
      
      toast({
        title: "Error",
        description: "Failed to fetch taxonomies, showing sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomies(currentPage);
  }, [currentPage, token]);

  const handleEdit = (taxonomy: any) => {
    setEditingTaxonomy(taxonomy);
    toast({
      title: "Edit Taxonomy",
      description: `Opening edit form for ${taxonomy.name}`,
    });
    // Here you would open an edit modal/form
    console.log('Editing taxonomy:', taxonomy);
  };

  const handleDelete = (taxonomy: any) => {
    toast({
      title: "Delete Taxonomy",
      description: `Are you sure you want to delete ${taxonomy.name}?`,
      variant: "destructive",
    });
    console.log('Deleting taxonomy:', taxonomy);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Taxonomy</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
          Usage Metrics
        </Button>
      </div>

      {/* Add New Category */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="w-64 h-8 bg-red-100 border-l-4 border-red-500 flex items-center px-3">
                <span className="text-red-700 text-sm">New Category Name</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taxonomies Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading taxonomies...</div>
          ) : taxonomies.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-500">
                <Tags className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                <p className="text-gray-500 mb-4">
                  Start organizing your content by creating taxonomy categories
                </p>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Category
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Description</TableHead>
                    <TableHead className="font-semibold text-gray-900">Created</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxonomies.map((taxonomy) => (
                    <TableRow key={taxonomy.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell>{taxonomy.name || taxonomy.title}</TableCell>
                      <TableCell>{taxonomy.description || 'No description'}</TableCell>
                      <TableCell>{taxonomy.created_at || taxonomy.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(taxonomy)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDelete(taxonomy)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
    </div>
  );
};

export default Taxonomy;
