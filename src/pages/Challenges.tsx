
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import ChallengeForm from '../components/Content/ChallengeForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import * as competitionService from '../services/competitionService';

const Challenges = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  const fetchChallenges = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await competitionService.getCompetitions(token);
      setChallenges(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "Error",
        description: "Failed to fetch challenges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges(currentPage);
  }, [currentPage, token]);

  const handleAdd = () => {
    setEditingChallenge(null);
    setIsFormOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedChallenges = challenges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Challenges</h1>
        <Button 
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Add Challenge
        </Button>
      </div>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading challenges...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Start</TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      <div className="flex items-center gap-1">
                        End
                        <span className="text-gray-400">▼</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900"># of participants</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedChallenges.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                        No challenges found. Click "Add Challenge" to create your first challenge.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedChallenges.map((challenge: any) => (
                      <TableRow key={challenge.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell>{challenge.name || challenge.title}</TableCell>
                        <TableCell>{challenge.start_date || challenge.created_at}</TableCell>
                        <TableCell>{challenge.end_date || 'N/A'}</TableCell>
                        <TableCell>{challenge.participants || 0}</TableCell>
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

      <ChallengeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        challenge={editingChallenge}
      />
    </div>
  );
};

export default Challenges;
