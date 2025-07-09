import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Plus, Tags, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as taxonomyService from '../services/taxonomyService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Taxonomy = () => {
  const [editingTaxonomy, setEditingTaxonomy] = useState(null);
  const [taxonomies, setTaxonomies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [showForm, setShowForm] = useState(false);

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
    let allTaxonomies = [];
    if (!token) {
      allTaxonomies = mockTaxonomies;
    } else {
      setLoading(true);
      try {
        const response = await taxonomyService.getTaxonomies(token);
        allTaxonomies = response.data || response;
      } catch (error) {
        console.error('Error fetching taxonomies:', error);
        allTaxonomies = mockTaxonomies;
        toast({
          title: "Error",
          description: "Failed to fetch taxonomies, showing sample data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    allTaxonomies.sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime());
    const totalMockItems = allTaxonomies.length;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = allTaxonomies.slice(startIndex, endIndex);
    setTaxonomies(paginatedData);
    setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
  };

  useEffect(() => {
    fetchTaxonomies(currentPage);
  }, [currentPage, token]);

  const handleEdit = (taxonomy: any) => {
    setEditingTaxonomy(taxonomy);
    setShowForm(true);
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

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTaxonomy(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      if (data.id) {
        // Edit existing taxonomy
        await taxonomyService.updateTaxonomy(data.id, { name: data.name, description: data.description }, token);
        toast({
          title: 'Updated',
          description: `Taxonomy "${data.name}" updated!`,
        });
      } else {
        // Create new taxonomy
        await taxonomyService.createTaxonomy({ name: data.name, description: data.description }, token);
        toast({
          title: 'Created',
          description: `Taxonomy "${data.name}" created!`,
        });
      }
      setShowForm(false);
      setEditingTaxonomy(null);
      fetchTaxonomies(currentPage);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save taxonomy.',
        variant: 'destructive',
      });
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Taxonomy</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={() => { setEditingTaxonomy(null); setShowForm(true); }}>
          Usage Metrics
        </Button>
      </div>

      {/* Add New Category */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer" onClick={() => { setEditingTaxonomy(null); setShowForm(true); }}>
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
                <Button className="bg-black text-white hover:bg-gray-800" onClick={() => { setEditingTaxonomy(null); setShowForm(true); }}>
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
                      <TableCell>{formatDate(taxonomy.created_at || taxonomy.createdAt)}</TableCell>
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

      {/* Taxonomy Edit/Create Modal */}
      <TaxonomyForm
        open={showForm}
        onClose={handleFormClose}
        taxonomy={editingTaxonomy}
        onSave={handleFormSave}
      />
    </div>
  );
};

const TaxonomyForm = ({ open, onClose, taxonomy, onSave }: { open: boolean, onClose: () => void, taxonomy: any, onSave: (data: any) => void }) => {
  const [name, setName] = useState(taxonomy?.name || '');
  const [description, setDescription] = useState(taxonomy?.description || '');

  useEffect(() => {
    setName(taxonomy?.name || '');
    setDescription(taxonomy?.description || '');
  }, [taxonomy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...taxonomy, name, description });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{taxonomy ? 'Edit Taxonomy' : 'Add Taxonomy'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Taxonomy;
