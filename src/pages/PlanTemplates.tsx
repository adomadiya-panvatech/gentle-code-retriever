import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import PlanTemplateForm from '../components/Content/PlanTemplateForm';
import ViewModal from '../components/Modals/ViewModal';
import { Trash2, Link as LinkIcon, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as planService from '../services/planService';

// Helper function for mm-dd-yyyy date format
function formatDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

function getPaginationRange(current, total) {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l > 2) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}

const PlanTemplates = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  const fetchTemplates = async (page = 1) => {
    let allTemplates = [];
    setLoading(true);
    try {
      const response = await planService.getPlans(token);
      allTemplates = response.data || response;
    } catch (error) {
      console.error('Error fetching plan templates:', error);
      allTemplates = [];
      toast({
        title: "Error",
        description: "Failed to fetch plan templates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    const totalItems = allTemplates.length;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = allTemplates.slice(startIndex, endIndex);
    setTemplates(paginatedData);
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  };

  useEffect(() => {
    fetchTemplates(currentPage);
  }, [currentPage, token]);

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleView = (template: any) => {
    setViewingTemplate(template);
    setShowViewModal(true);
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
                        <TableCell>{Array.isArray(template.planned_events) ? template.planned_events.length : 0}</TableCell>
                        <TableCell>{Array.isArray(template.taxonomy_ids) ? template.taxonomy_ids.length : 0}</TableCell>
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
                      {getPaginationRange(currentPage, totalPages).map((page, idx) =>
                        page === '...'
                          ? (
                            <PaginationItem key={"ellipsis-" + idx}>
                              <span className="px-2">...</span>
                            </PaginationItem>
                          )
                          : (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                      )}
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
        onClose={() => {
          setIsFormOpen(false);
          setEditingTemplate(null);
        }}
        template={editingTemplate}
      />

      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingTemplate(null);
        }}
        title="View Plan Template"
        data={viewingTemplate}
        type="template"
      />
    </div>
  );
};

export default PlanTemplates;
