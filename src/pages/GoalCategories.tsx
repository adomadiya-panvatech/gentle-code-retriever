import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import GoalCategoryForm from '../components/Content/GoalCategoryForm';
import ViewModal from '../components/Modals/ViewModal';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { goalCategoryService } from '../services/goalCategoryService';
import { useToast } from '../hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';

const GoalCategories = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, token]);

  const fetchCategories = async () => {
    if (!token) {
      // Use mock data when no token
      const filtered = mockCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const totalMockItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      setCategories(paginatedData);
      setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
      return;
    }

    setLoading(true);
    try {
      const response = await goalCategoryService.getGoalCategories(token, currentPage, itemsPerPage);
      const allCategories = response.data || response;
      const filtered = allCategories.filter((category: any) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const totalItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      setCategories(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('Error fetching goal categories:', error);
      // Fallback to mock data
      const filtered = mockCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const totalMockItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      setCategories(paginatedData);
      setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
      
      toast({
        title: "Error",
        description: "Failed to load goal categories, showing sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mockCategories = [
    {
      id: 1,
      order: 1,
      image: '/lovable-uploads/0a9970f8-7a6a-4867-944a-b714c26347f8.png',
      name: 'Eat healthier',
      goalTemplates: 20,
      filters: 8
    },
    {
      id: 2,
      order: 2,
      name: 'Control my stress',
      goalTemplates: 15,
      filters: 'none'
    },
    {
      id: 3,
      order: 3,
      name: 'Sleep better',
      goalTemplates: 14,
      filters: 'none'
    },
    {
      id: 4,
      order: 4,
      name: 'Have better relationships',
      goalTemplates: 7,
      filters: 'none'
    },
    {
      id: 5,
      order: 5,
      name: 'Exercise',
      goalTemplates: 17,
      filters: 'none'
    },
    {
      id: 6,
      order: 6,
      name: 'Create work-life balance',
      goalTemplates: 14,
      filters: 'none'
    },
    {
      id: 7,
      order: 7,
      name: 'Connect with others',
      goalTemplates: 12,
      filters: 'none'
    },
    {
      id: 8,
      order: 8,
      name: 'Have structure in your day',
      goalTemplates: 14,
      filters: 'none'
    },
    {
      id: 9,
      order: 9,
      name: 'Build confidence',
      goalTemplates: 10,
      filters: 'none'
    },
    {
      id: 10,
      order: 10,
      name: 'Manage time better',
      goalTemplates: 13,
      filters: 'none'
    },
    {
      id: 11,
      order: 11,
      name: 'Practice mindfulness',
      goalTemplates: 16,
      filters: 'none'
    },
    {
      id: 12,
      order: 12,
      name: 'Improve communication',
      goalTemplates: 9,
      filters: 'none'
    }
  ];

  const handleEdit = (category: any) => {
    setEditingCategory({ ...category, title: category.name });
    setIsFormOpen(true);
  };

  const handleView = (category: any) => {
    setViewingCategory(category);
    setShowViewModal(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Goal Categories</h1>
        <Button 
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white text-sm flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Goal Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900 w-16"></TableHead>
                <TableHead className="font-semibold text-gray-900 w-16"></TableHead>
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Goal Templates</TableHead>
                <TableHead className="font-semibold text-gray-900">Filters</TableHead>
                <TableHead className="font-semibold text-gray-900 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-8 text-center text-gray-500">
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-8 text-center text-gray-500">
                    {searchTerm ? `No categories found matching "${searchTerm}"` : 'No categories found'}
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <button className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100">
                        <span className="text-gray-400">⊚</span>
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{category.order}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category.image && (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {category.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{Array.isArray(category.goalTemplates) ? category.goalTemplates.length : 0}</TableCell>
                    <TableCell>{category.filters}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleView(category)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
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
        </CardContent>
      </Card>

      <GoalCategoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
      />

      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingCategory(null);
        }}
        title="View Goal Category"
        data={viewingCategory}
        type="category"
      />
    </div>
  );
};

export default GoalCategories;
