
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import PlanTemplateForm from '../components/Content/PlanTemplateForm';
import { Trash2, Link as LinkIcon } from 'lucide-react';
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

  const fetchTemplates = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await planService.getPlans(token, page, itemsPerPage);
      console.log('Plan templates response:', response);
      setTemplates(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching plan templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch plan templates",
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
