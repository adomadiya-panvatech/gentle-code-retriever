
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import PlanTemplateForm from '../components/Content/PlanTemplateForm';
import { Trash2, Link as LinkIcon, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as planService from '../services/planService';

const PlanTemplates = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  // Extended mock data for better demonstration
  const mockTemplates = [
    { id: 1, name: 'Beginner Wellness Plan', activities: 5, taxonomies: 3, description: 'A starter plan for wellness journey' },
    { id: 2, name: 'Advanced Fitness Plan', activities: 12, taxonomies: 5, description: 'Comprehensive fitness program' },
    { id: 3, name: 'Mental Health Focus', activities: 8, taxonomies: 4, description: 'Focus on mental wellness' },
    { id: 4, name: 'Nutrition Basics', activities: 6, taxonomies: 2, description: 'Basic nutrition guidance' },
    { id: 5, name: 'Sleep Optimization', activities: 4, taxonomies: 2, description: 'Improve sleep quality' },
    { id: 6, name: 'Stress Management', activities: 7, taxonomies: 3, description: 'Manage daily stress' },
    { id: 7, name: 'Work-Life Balance', activities: 9, taxonomies: 4, description: 'Balance professional and personal life' },
    { id: 8, name: 'Mindfulness Practice', activities: 5, taxonomies: 2, description: 'Daily mindfulness exercises' },
    { id: 9, name: 'Healthy Habits', activities: 10, taxonomies: 5, description: 'Build lasting healthy habits' },
    { id: 10, name: 'Exercise Fundamentals', activities: 8, taxonomies: 3, description: 'Basic exercise routines' },
    { id: 11, name: 'Emotional Wellness', activities: 6, taxonomies: 3, description: 'Emotional health support' },
    { id: 12, name: 'Social Connection', activities: 4, taxonomies: 2, description: 'Building social relationships' },
    { id: 13, name: 'Energy Boost', activities: 7, taxonomies: 3, description: 'Natural energy enhancement' },
    { id: 14, name: 'Productivity Focus', activities: 8, taxonomies: 4, description: 'Increase daily productivity' },
    { id: 15, name: 'Recovery Plan', activities: 5, taxonomies: 2, description: 'Post-workout recovery' }
  ];

  const fetchTemplates = async (page = 1) => {
    if (!token) {
      // Use mock data when no token
      const totalMockItems = mockTemplates.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockTemplates.slice(startIndex, endIndex);
      
      setTemplates(paginatedData);
      setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
      return;
    }

    setLoading(true);
    try {
      const response = await planService.getPlans(token, page, itemsPerPage);
      console.log('Plan templates response:', response);
      const allTemplates = response.data || response;
      const totalItems = allTemplates.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = allTemplates.slice(startIndex, endIndex);
      
      setTemplates(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('Error fetching plan templates:', error);
      // Fallback to mock data
      const totalMockItems = mockTemplates.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockTemplates.slice(startIndex, endIndex);
      
      setTemplates(paginatedData);
      setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
      
      toast({
        title: "Error",
        description: "Failed to fetch plan templates, showing sample data",
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
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleView = (template: any) => {
    console.log('Viewing template:', template);
    toast({
      title: "Template Viewed",
      description: `Viewing ${template.name}`,
    });
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    setIsFormOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Plan Templates</h1>
        <Button 
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white text-sm flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Plan Template
        </Button>
      </div>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading plan templates...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Activities</TableHead>
                    <TableHead className="font-semibold text-gray-900">Taxonomies</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                        No plan templates found. Click "Add Plan Template" to create your first template.
                      </TableCell>
                    </TableRow>
                  ) : (
                    templates.map((template) => (
                      <TableRow key={template.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell>
                          <span 
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleEdit(template)}
                          >
                            {template.name || template.title}
                          </span>
                        </TableCell>
                        <TableCell>{template.activities || 0}</TableCell>
                        <TableCell>{template.taxonomies || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => handleView(template)}
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Trash2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <LinkIcon className="w-4 h-4 text-gray-500" />
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

      <PlanTemplateForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        template={editingTemplate}
      />
    </div>
  );
};

export default PlanTemplates;
