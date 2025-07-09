import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/companyService';
import { useToast } from '../hooks/use-toast';

const Companies = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [statsReport, setStatsReport] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for demonstration
  const mockCompanies = [
    { name: 'A/B Test: Dynamic Home onboarding', created: '2021/05/20' },
    { name: 'A/B Test: In context onboarding', created: '2021/05/19' },
    { name: 'A/B Test: Front loaded onboarding', created: '2021/05/19' },
    { name: 'Wellness Testers', created: '2021/05/13' },
    { name: 'Option 2', created: '2021/04/03' },
    { name: 'None', created: '2020/03/24' },
    { name: 'Family Health Centers of San Diego', created: '2019/09/11' },
    { name: 'Hub International', created: '2019/07/30' },
    { name: 'Arena Pharmaceuticals', created: '2019/07/25' },
    { name: '1.1 Friends and Family', created: '2019/05/31' },
    { name: 'Impact Hub Ottawa', created: '2019/05/30' },
    { name: 'App8', created: '2019/05/30' },
    { name: 'Rewind', created: '2019/05/30' },
    { name: '41 Orange', created: '2019/05/30' },
    { name: 'Inmarsat', created: '2019/05/29' },
    { name: 'Continuum Global Solutions', created: '2019/05/23' },
    { name: 'Ian Martin', created: '2019/05/17' },
    { name: 'Lloyd Pest Control', created: '2019/05/10' },
    { name: 'TechCorp Industries', created: '2019/04/25' },
    { name: 'Global Wellness Inc', created: '2019/04/15' }
  ];

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      let allData = [];
      if (!token) {
        allData = mockCompanies;
      } else {
        const response = await companyService.getCompanies(token);
        if (Array.isArray(response.data)) {
          allData = response.data;
        } else if (Array.isArray(response)) {
          allData = response;
        } else {
          allData = mockCompanies;
        }
      }
      setAllCompanies(allData);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCompanies(allData.slice(startIndex, endIndex));
    } catch (error) {
      setAllCompanies(mockCompanies);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCompanies(mockCompanies.slice(startIndex, endIndex));
      toast({
        title: "Error",
        description: "Failed to load companies, showing sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCompanies(allCompanies.slice(startIndex, endIndex));
  }, [currentPage, allCompanies]);

  const handleCreateCompany = () => {
    console.log('Creating company:', { companyName, companyCode, statsReport });
    setCompanyName('');
    setCompanyCode('');
    setStatsReport(false);
    setShowNewCompanyDialog(false);
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setStatsReport(checked);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function for mm-dd-yyyy date format
  function formatDate(dateStr) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Companies</h1>
        <Button 
          onClick={() => setShowNewCompanyDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Company
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="p-8 text-center text-gray-500">
                    Loading companies...
                  </TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="p-8 text-center text-gray-500">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company, index) => (
                  <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell className="text-gray-600">{formatDate(company.createdAt || company.created)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {allCompanies.length > itemsPerPage && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {getPaginationRange(currentPage, Math.ceil(allCompanies.length / itemsPerPage)).map((page, idx) =>
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
                      onClick={() => currentPage < Math.ceil(allCompanies.length / itemsPerPage) && handlePageChange(currentPage + 1)}
                      className={currentPage === Math.ceil(allCompanies.length / itemsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">New Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Name</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Code</Label>
              <Input
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                placeholder="SIGN UP CODE"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Stats Report</Label>
              <div className="col-span-3">
                <Checkbox
                  checked={statsReport}
                  onCheckedChange={handleCheckboxChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewCompanyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCompany} className="bg-orange-500 hover:bg-orange-600">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
