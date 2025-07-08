
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { assignmentService } from '../services/assignmentService';
import { useToast } from '../hooks/use-toast';

const Assignments = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [showCardPreviews, setShowCardPreviews] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAssignments();
  }, [currentPage, token]);

  const fetchAssignments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await assignmentService.getAssignments(token, currentPage, itemsPerPage);
      setAssignments(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mockAssignments = [
    { 
      user: 'carriebartell@roob.name', 
      type: 'content', 
      scheduled: 'Nov 15, 2022 9:15:00 PM', 
      expiry: 'Nov 16, 2022 12:20:00 AM' 
    },
    { 
      user: 'robinnolan@funk.name', 
      type: 'content', 
      scheduled: 'Nov 15, 2022 6:45:00 PM', 
      expiry: 'Nov 16, 2022 12:50:00 AM' 
    },
    { 
      user: 'robinnolan@funk.name', 
      type: 'content', 
      scheduled: 'Nov 14, 2022 5:35:00 PM', 
      expiry: 'Nov 15, 2022 12:40:00 AM' 
    },
    { 
      user: 'tamerarogahn@bednar.com', 
      type: 'content', 
      scheduled: 'Nov 14, 2022 4:00:00 PM', 
      expiry: 'Nov 14, 2022 8:05:00 PM' 
    },
    { 
      user: 'robinnolan@funk.name', 
      type: 'content', 
      scheduled: 'Nov 12, 2022 10:45:00 PM', 
      expiry: 'Nov 14, 2022 5:50:00 PM' 
    },
    { 
      user: 'candidakoepp@kirlin.info', 
      type: 'content', 
      scheduled: 'Nov 11, 2022 10:00:00 PM', 
      expiry: 'Nov 14, 2022 5:00:00 PM' 
    },
    { 
      user: 'robinnolan@funk.name', 
      type: 'content', 
      scheduled: 'Nov 11, 2022 9:25:00 PM', 
      expiry: 'Nov 11, 2022 9:30:00 PM' 
    },
    { 
      user: 'robinnolan@funk.name', 
      type: 'content', 
      scheduled: 'Nov 11, 2022 9:00:00 PM', 
      expiry: 'Nov 11, 2022 9:05:00 PM' 
    },
    { 
      user: 'robinnolan@funk.name', 
      type: 'content', 
      scheduled: 'Nov 11, 2022 7:15:00 PM', 
      expiry: 'Nov 11, 2022 7:20:00 PM' 
    }
  ];

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setShowCardPreviews(checked);
    }
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
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            New Assignment
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
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
                  ) : (assignments.length > 0 ? assignments : mockAssignments).map((assignment, index) => (
                    <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="text-blue-600">{assignment.user}</TableCell>
                      <TableCell>{assignment.type}</TableCell>
                      <TableCell>{assignment.scheduled}</TableCell>
                      <TableCell>{assignment.expiry}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:underline text-sm">View</button>
                          <button className="text-blue-600 hover:underline text-sm">Edit</button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No pending assignments</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewed">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No viewed assignments</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="started">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No started assignments</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No completed assignments</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skipped">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No skipped assignments</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Assignments;
