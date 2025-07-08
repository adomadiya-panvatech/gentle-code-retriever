
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Plus, Tags } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as taxonomyService from '../services/taxonomyService';

const Taxonomy = () => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [taxonomies, setTaxonomies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  const fetchTaxonomies = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await taxonomyService.getTaxonomies(token, page, itemsPerPage);
      console.log('Taxonomies response:', response);
      setTaxonomies(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching taxonomies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch taxonomies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomies(currentPage);
  }, [currentPage, token]);

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
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Delete</Button>
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
