
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, token]);

  const fetchCompanies = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await companyService.getCompanies(token);
      setCompanies(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    { name: 'Lloyd Pest Control', created: '2019/05/10' }
  ];

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
              ) : (companies.length > 0 ? companies : mockCompanies).map((company, index) => (
                <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="text-gray-600">{company.created}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
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
