import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import ViewModal from '../components/Modals/ViewModal';
import { Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { assignmentService } from '../services/assignmentService';
import { useToast } from '../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';

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

const Assignments = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [showCardPreviews, setShowCardPreviews] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const tabKeys = ['templates', 'pending', 'viewed', 'started', 'completed', 'skipped'];
  const [currentPage, setCurrentPage] = useState(() => Object.fromEntries(tabKeys.map(tab => [tab, 1])));
  const [totalPages, setTotalPages] = useState(() => Object.fromEntries(tabKeys.map(tab => [tab, 1])));
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState('templates');
  const [allAssignments, setAllAssignments] = useState(() => Object.fromEntries(tabKeys.map(tab => [tab, []])));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Mock data for demonstration
  const mockAssignments = [
    { user: 'carriebartell@roob.name', type: 'content', scheduled: 'Nov 15, 2022 9:15:00 PM', expiry: 'Nov 16, 2022 12:20:00 AM' },
    { user: 'robinnolan@funk.name', type: 'content', scheduled: 'Nov 15, 2022 6:45:00 PM', expiry: 'Nov 16, 2022 12:50:00 AM' },
    { user: 'robinnolan@funk.name', type: 'content', scheduled: 'Nov 14, 2022 5:35:00 PM', expiry: 'Nov 15, 2022 12:40:00 AM' },
    { user: 'tamerarogahn@bednar.com', type: 'content', scheduled: 'Nov 14, 2022 4:00:00 PM', expiry: 'Nov 14, 2022 8:05:00 PM' },
    { user: 'robinnolan@funk.name', type: 'content', scheduled: 'Nov 12, 2022 10:45:00 PM', expiry: 'Nov 14, 2022 5:50:00 PM' },
    { user: 'candidakoepp@kirlin.info', type: 'content', scheduled: 'Nov 11, 2022 10:00:00 PM', expiry: 'Nov 14, 2022 5:00:00 PM' },
    { user: 'robinnolan@funk.name', type: 'content', scheduled: 'Nov 11, 2022 9:25:00 PM', expiry: 'Nov 11, 2022 9:30:00 PM' },
    { user: 'robinnolan@funk.name', type: 'content', scheduled: 'Nov 11, 2022 9:00:00 PM', expiry: 'Nov 11, 2022 9:05:00 PM' },
    { user: 'robinnolan@funk.name', type: 'content', scheduled: 'Nov 11, 2022 7:15:00 PM', expiry: 'Nov 11, 2022 7:20:00 PM' },
    { user: 'johndoe@example.com', type: 'survey', scheduled: 'Nov 10, 2022 8:00:00 PM', expiry: 'Nov 12, 2022 8:00:00 PM' },
    { user: 'janedoe@example.com', type: 'challenge', scheduled: 'Nov 9, 2022 7:30:00 PM', expiry: 'Nov 16, 2022 7:30:00 PM' },
    { user: 'mikejohnson@example.com', type: 'content', scheduled: 'Nov 8, 2022 6:00:00 PM', expiry: 'Nov 10, 2022 6:00:00 PM' },
    { user: 'sarahsmith@example.com', type: 'tip', scheduled: 'Nov 7, 2022 5:15:00 PM', expiry: 'Nov 8, 2022 5:15:00 PM' },
    { user: 'davidwilson@example.com', type: 'content', scheduled: 'Nov 6, 2022 4:45:00 PM', expiry: 'Nov 9, 2022 4:45:00 PM' },
    { user: 'emilywhite@example.com', type: 'goal', scheduled: 'Nov 5, 2022 3:20:00 PM', expiry: 'Nov 12, 2022 3:20:00 PM' }
  ];

  const fetchAssignments = async (page = 1, status = activeTab) => {
    let allData = [];
    if (!token) {
      allData = mockAssignments;
    } else {
      setLoading(true);
      try {
        let response;
        if (status === 'templates') {
          response = await assignmentService.getAssignments(token);
        } else {
          response = await assignmentService.getAssignmentsByStatus(token, status);
        }
        allData = response.data || response;
      } catch (error) {
        console.error('Error fetching assignments:', error);
        allData = mockAssignments;
        toast({
          title: "Error",
          description: "Failed to load assignments, showing sample data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    setAllAssignments(prev => ({ ...prev, [status]: allData }));
    const totalItems = allData.length;
    setTotalPages(prev => ({ ...prev, [status]: Math.ceil(totalItems / itemsPerPage) }));
    // Set paginated assignments for current page
    const startIndex = (currentPage[status] - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setAssignments(allData.slice(startIndex, endIndex));
  };

  useEffect(() => {
    fetchAssignments(currentPage[activeTab], activeTab);
  }, [currentPage, token, activeTab]);

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setShowCardPreviews(checked);
    }
  };

  const handleView = (assignment: any) => {
    setViewingAssignment(assignment);
    setShowViewModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(prev => ({ ...prev, [activeTab]: page }));
    // Paginate from allAssignments for the current tab
    const allData = allAssignments[activeTab] || [];
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setAssignments(allData.slice(startIndex, endIndex));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(prev => ({ ...prev, [tab]: 1 }));
  };

  const handleAdd = () => {
    setEditingAssignment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (assignment: any) => {
    setEditingAssignment(assignment);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAssignment(null);
  };

  const handleFormSave = (data: any) => {
    // Here you would call your API to create or update assignment
    // For now, just close the modal and show a toast
    toast({
      title: 'Saved',
      description: `Assignment saved!`,
    });
    setIsFormOpen(false);
    setEditingAssignment(null);
    fetchAssignments(currentPage[activeTab], activeTab);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Assignments</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={showCardPreviews}
              onCheckedChange={handleCheckboxChange}
            />
            <label className="text-sm">Show card previews</label>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAdd}>
            New Assignment
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="viewed">Viewed</TabsTrigger>
          <TabsTrigger value="started">Started</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="skipped">Skipped</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900">User</TableHead>
                    <TableHead className="font-semibold text-gray-900">Type</TableHead>
                    <TableHead className="font-semibold text-gray-900">Scheduled for (UTC)</TableHead>
                    <TableHead className="font-semibold text-gray-900">Expiry Time (UTC)</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="p-8 text-center text-gray-500">
                        Loading assignments...
                      </TableCell>
                    </TableRow>
                  ) : assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="p-8 text-center text-gray-500">
                        No assignments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment, index) => (
                      <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="text-blue-600">{assignment.username}</TableCell>
                        <TableCell>{assignment.type}</TableCell>
                        <TableCell>{formatDate(assignment.scheduled_for)}</TableCell>
                        <TableCell>{formatDate(assignment.expiry_time)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => handleView(assignment)}
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEdit(assignment)}>Edit</button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages[activeTab] > 1 && (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage[activeTab] > 1 && handlePageChange(currentPage[activeTab] - 1)}
                          className={currentPage[activeTab] === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {getPaginationRange(currentPage[activeTab], totalPages[activeTab]).map((page, idx) =>
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
                                isActive={currentPage[activeTab] === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                      )}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage[activeTab] < totalPages[activeTab] && handlePageChange(currentPage[activeTab] + 1)}
                          className={currentPage[activeTab] === totalPages[activeTab] ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {['pending', 'viewed', 'started', 'completed', 'skipped'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card className="border-gray-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-900">User</TableHead>
                      <TableHead className="font-semibold text-gray-900">Type</TableHead>
                      <TableHead className="font-semibold text-gray-900">Scheduled for (UTC)</TableHead>
                      <TableHead className="font-semibold text-gray-900">Expiry Time (UTC)</TableHead>
                      <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="p-8 text-center text-gray-500">
                          Loading assignments...
                        </TableCell>
                      </TableRow>
                    ) : assignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="p-8 text-center text-gray-500">
                          No assignments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignments.map((assignment, index) => (
                        <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <TableCell className="text-blue-600">{assignment.username}</TableCell>
                          <TableCell>{assignment.type}</TableCell>
                          <TableCell>{formatDate(assignment.scheduled_for)}</TableCell>
                          <TableCell>{formatDate(assignment.expiry_time)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <button 
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => handleView(assignment)}
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEdit(assignment)}>Edit</button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {/* Pagination */}
                {totalPages[tab] > 1 && (
                  <div className="p-4 border-t">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => currentPage[tab] > 1 && handlePageChange(currentPage[tab] - 1)}
                            className={currentPage[tab] === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {getPaginationRange(currentPage[tab], totalPages[tab]).map((page, idx) =>
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
                                  isActive={currentPage[tab] === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                        )}
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => currentPage[tab] < totalPages[tab] && handlePageChange(currentPage[tab] + 1)}
                            className={currentPage[tab] === totalPages[tab] ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingAssignment(null);
        }}
        title="View Assignment"
        data={viewingAssignment}
        type="assignment"
      />

      {/* Assignment Add/Edit Modal */}
      <AssignmentForm
        open={isFormOpen}
        onClose={handleFormClose}
        assignment={editingAssignment}
        onSave={handleFormSave}
      />
    </div>
  );
};

const AssignmentForm = ({ open, onClose, assignment, onSave }: { open: boolean, onClose: () => void, assignment: any, onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    username: assignment?.username || '',
    type: assignment?.type || '',
    scheduled_for: assignment?.scheduled_for || '',
    expiry_time: assignment?.expiry_time || ''
  });
  useEffect(() => {
    setFormData({
      username: assignment?.username || '',
      type: assignment?.type || '',
      scheduled_for: assignment?.scheduled_for || '',
      expiry_time: assignment?.expiry_time || ''
    });
  }, [assignment]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{assignment ? 'Edit Assignment' : 'Add Assignment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <Input value={formData.username} onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <Input value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled For</label>
            <Input value={formData.scheduled_for} onChange={e => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Time</label>
            <Input value={formData.expiry_time} onChange={e => setFormData(prev => ({ ...prev, expiry_time: e.target.value }))} required />
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

export default Assignments;
