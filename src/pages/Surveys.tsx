import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search, Edit, Trash2, Link as LinkIcon, Copy, RefreshCw, Share, Eye } from 'lucide-react';
import ViewModal from '../components/Modals/ViewModal';

const Surveys = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingSurvey, setViewingSurvey] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const mockSurveys = [
    { id: 1, title: 'WD40 Leave Challenge', description: 'Confirmation question for leaving WD-40 challenge', tag: 'No' },
    { id: 2, title: '2022 Q4 Sign-up problem questions', description: '2022 Q4 Sign-up problem questions', tag: 'No' },
    { id: 3, title: 'PHQ 9a', description: 'PHQ 9a', tag: 'No' },
    { id: 4, title: 'Test Survey_Checking Off Activities', description: 'Survey engagement test 2', tag: 'No' },
    { id: 5, title: 'Test Survey_21 Day Habit', description: 'Survey engagement test 1', tag: 'No' },
    { id: 6, title: 'Sleep Survey 3', description: 'Asking users if their sleep is getting better.', tag: 'No' },
    { id: 7, title: 'Sleep Survey 2 (Sleeping bad)', description: 'Asking users if their sleep is still the same as Survey 1', tag: 'No' },
    { id: 8, title: 'Sleep Survey 2 (Sleeping meh)', description: 'Asking users if their sleep is still the same as Survey 1', tag: 'No' },
    { id: 9, title: 'Sleep Survey 1', description: 'Asking users interested in improving their sleep about their sleep.', tag: 'No' },
    { id: 10, title: 'Sleep Survey 2 (Sleeping great!)', description: 'Asking users if their sleep is still the same as Survey 1', tag: 'No' },
    { id: 11, title: 'How are you feeling today?', description: 'Repeating question for users: how are you feeling?', tag: 'No' },
    { id: 12, title: 'No Question Plan Onboarding', description: 'Plan onboarding sans any questions', tag: 'No' }
  ];

  const handleAddSurvey = () => {
    setFormData({ title: '', description: '' });
    setIsFormOpen(true);
  };

  const handleView = (survey: any) => {
    setViewingSurvey(survey);
    setShowViewModal(true);
  };

  const handleSave = () => {
    console.log('Saving survey:', formData);
    setIsFormOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredSurveys = mockSurveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSurveys = filteredSurveys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Surveys</h1>
        <Button 
          onClick={handleAddSurvey}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Add new Survey
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search surveys..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900">Title</TableHead>
                <TableHead className="font-semibold text-gray-900">Description</TableHead>
                <TableHead className="font-semibold text-gray-900">Survey Tag</TableHead>
                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSurveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-8 text-center text-gray-500">
                    {searchTerm ? `No surveys found matching "${searchTerm}"` : 'No surveys found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSurveys.map((survey) => (
                  <TableRow key={survey.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {survey.title}
                      </span>
                    </TableCell>
                    <TableCell>{survey.description}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">{survey.tag}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleView(survey)}
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <LinkIcon className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <RefreshCw className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Share className="w-4 h-4 text-gray-500" />
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
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Survey</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Survey title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Survey description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSave}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingSurvey(null);
        }}
        title="View Survey"
        data={viewingSurvey}
        type="survey"
      />
    </div>
  );
};

export default Surveys;
