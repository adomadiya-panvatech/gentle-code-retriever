import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Upload, Eye } from 'lucide-react';
import ViewModal from '../components/Modals/ViewModal';
import { useAuth } from '../context/AuthContext';
import { communityGroupService } from '../services/communityGroupService';
import { useToast } from '../hooks/use-toast';

const CommunityGroups = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    infoCard: '',
    slackChannelId: '',
    image: null
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const mockGroups = [
    { id: 1, name: 'Kelley Marie Wellness', image: '/placeholder-image.jpg', lastUpdated: 'Nov 18, 2022 3:01 AM', created: 'Nov 18, 2022 3:01 AM' },
    { id: 2, name: 'Career-Focused Women', image: '/lovable-uploads/50965e3a-b9ef-4d7c-a90e-53cbd6a5a519.png', lastUpdated: 'Nov 4, 2022 12:30 AM', created: '' },
    { id: 3, name: 'Burned Out Mamas', image: '/lovable-uploads/ff5af5ed-03b1-4a14-8fbc-397ea41a6aef.png', lastUpdated: 'Nov 4, 2022 12:30 AM', created: '' },
    { id: 4, name: 'WD-40 Healthy Habits Challenge', image: '/lovable-uploads/7565766c-680c-4874-98d2-9ff6a0973755.png', lastUpdated: 'Oct 31, 2022 9:07 PM', created: 'Oct 31, 2022 9:07 PM' },
    { id: 5, name: 'WD-40 Fortress of Health Group', image: '/lovable-uploads/0a9970f8-7a6a-4867-944a-b714c26347f8.png', lastUpdated: 'Oct 19, 2022 9:34 PM', created: 'Oct 19, 2022 9:32 PM' },
    { id: 6, name: 'Sleep Seekers', image: '/placeholder-image.jpg', lastUpdated: 'Jul 6, 2022 1:31 AM', created: '' },
    { id: 7, name: 'Aspiring Healthy Eaters', image: '/placeholder-image.jpg', lastUpdated: 'Jul 6, 2022 1:31 AM', created: '' },
    { id: 8, name: 'Mindful Meditation Circle', image: '/placeholder-image.jpg', lastUpdated: 'Jun 15, 2022 2:15 PM', created: 'Jun 15, 2022 2:15 PM' },
    { id: 9, name: 'Fitness Enthusiasts', image: '/placeholder-image.jpg', lastUpdated: 'Jun 10, 2022 11:30 AM', created: 'Jun 10, 2022 11:30 AM' },
    { id: 10, name: 'Creative Writers Hub', image: '/placeholder-image.jpg', lastUpdated: 'May 28, 2022 4:20 PM', created: 'May 28, 2022 4:20 PM' },
    { id: 11, name: 'Tech Professionals Network', image: '/placeholder-image.jpg', lastUpdated: 'May 20, 2022 9:45 AM', created: 'May 20, 2022 9:45 AM' },
    { id: 12, name: 'Young Entrepreneurs', image: '/placeholder-image.jpg', lastUpdated: 'May 15, 2022 6:30 PM', created: 'May 15, 2022 6:30 PM' }
  ];

  const fetchGroups = async (page = 1) => {
    if (!token) {
      // Use mock data when no token
      const totalItems = mockGroups.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockGroups.slice(startIndex, endIndex);
      
      setGroups(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      return;
    }

    setLoading(true);
    try {
      const response = await communityGroupService.getCommunityGroups(token, page, itemsPerPage);
      setGroups(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching community groups:', error);
      // Fallback to mock data
      const totalItems = mockGroups.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockGroups.slice(startIndex, endIndex);
      
      setGroups(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      
      toast({
        title: "Error",
        description: "Failed to load community groups, showing sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(currentPage);
  }, [currentPage, token]);

  const handleAddGroup = () => {
    setFormData({
      name: '',
      description: '',
      infoCard: '',
      slackChannelId: '',
      image: null
    });
    setIsFormOpen(true);
  };

  const handleView = (group: any) => {
    setViewingGroup(group);
    setShowViewModal(true);
  };

  const handleSave = () => {
    console.log('Saving community group:', formData);
    setIsFormOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Community Groups</h1>
        <Button 
          onClick={handleAddGroup}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add group
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900">Image</TableHead>
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Last updated</TableHead>
                <TableHead className="font-semibold text-gray-900">Created</TableHead>
                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-gray-500">
                    Loading community groups...
                  </TableCell>
                </TableRow>
              ) : groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-gray-500">
                    No community groups found
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow key={group.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <img 
                        src={group.image} 
                        alt={group.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="text-blue-600 hover:underline cursor-pointer">
                      {group.name}
                    </TableCell>
                    <TableCell>{group.lastUpdated}</TableCell>
                    <TableCell>{group.created}</TableCell>
                    <TableCell>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleView(group)}
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Add Community Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">NAME</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">DESCRIPTION</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">INFO CARD</label>
              <Textarea
                value={formData.infoCard}
                onChange={(e) => setFormData(prev => ({ ...prev, infoCard: e.target.value }))}
                placeholder="<html>"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SLACK CHANNEL ID</label>
              <Input
                value={formData.slackChannelId}
                onChange={(e) => setFormData(prev => ({ ...prev, slackChannelId: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">IMAGE (REQUIRED)</label>
              <div className="w-32 h-32 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setIsFormOpen(false)}
            >
              Delete
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingGroup(null);
        }}
        title="View Community Group"
        data={viewingGroup}
        type="group"
      />
    </div>
  );
};

export default CommunityGroups;
