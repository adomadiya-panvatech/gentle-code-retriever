import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { personalizationRuleService } from '../services/personalizationRuleService';
import { useAuth } from '../context/AuthContext';

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

const PersonalizationRules = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewRuleDialog, setShowNewRuleDialog] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { token } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockRules = [
    {
      name: 'Feeling overwhelmed',
      conditions: '1 condition',
      actions: '2 actions',
      state: 'Enabled',
      lastUpdated: 'May 27, 2022 4:45 PM',
      taxonomies: '5e948601964fd4784000216'
    },
    {
      name: 'Feeling blah',
      conditions: '1 condition',
      actions: '2 actions',
      state: 'Enabled',
      lastUpdated: 'May 27, 2022 4:45 PM',
      taxonomies: '6291343c3f9f8aacc9433cb4'
    },
    {
      name: 'Join Community Group: Working on my fitness',
      conditions: '1 condition',
      actions: '1 action',
      state: 'Enabled',
      lastUpdated: 'Jan 6, 2022 4:45 PM',
      taxonomies: ''
    },
    {
      name: 'Join Community Group: Looking on the bright side',
      conditions: '1 condition',
      actions: '1 action',
      state: 'Enabled',
      lastUpdated: 'Jan 6, 2022 4:45 PM',
      taxonomies: ''
    },
    {
      name: 'Join Community Group: Working 9 to 5',
      conditions: '1 condition',
      actions: '1 action',
      state: 'Enabled',
      lastUpdated: 'Jan 6, 2022 4:45 PM',
      taxonomies: ''
    },
    {
      name: 'Join Community Group: Burnt-out mamas',
      conditions: '1 condition',
      actions: '1 action',
      state: 'Enabled',
      lastUpdated: 'Jan 6, 2022 4:45 PM',
      taxonomies: ''
    },
    {
      name: 'What topics are you interested in? connect',
      conditions: '1 condition',
      actions: '2 actions',
      state: 'Enabled',
      lastUpdated: 'Nov 26, 2021 4:45 PM',
      taxonomies: '5fbd3a8b96c4fd645300028a'
    },
    {
      name: 'What topics are you interested in? eating',
      conditions: '1 condition',
      actions: '2 actions',
      state: 'Enabled',
      lastUpdated: 'Nov 26, 2021 4:45 PM',
      taxonomies: '567058fb521891476e000003'
    }
  ];

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      try {
        if (!token) {
          setRules(mockRules);
        } else {
          const data = await personalizationRuleService.getPersonalizationRules(token);
          setRules(data.data || data); // support both array and paginated response
        }
      } catch (error) {
        setRules(mockRules);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
    // eslint-disable-next-line
  }, [token]);

  const handleCreateRule = () => {
    console.log('Creating new rule:', newRuleName);
    setNewRuleName('');
    setShowNewRuleDialog(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredRules = rules.filter(rule =>
    (rule.name || rule.rule_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rule.taxonomies || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRules = filteredRules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Personalization Rules</h1>
        <Button 
          onClick={() => setShowNewRuleDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Rule
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search name, question, taxonomy"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Conditions</TableHead>
                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                <TableHead className="font-semibold text-gray-900">State</TableHead>
                <TableHead className="font-semibold text-gray-900">Last updated</TableHead>
                <TableHead className="font-semibold text-gray-900">Taxonomies</TableHead>
                <TableHead className="font-semibold text-gray-900"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-8 text-center text-gray-500">
                    Loading personalization rules...
                  </TableCell>
                </TableRow>
              ) : paginatedRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-8 text-center text-gray-500">
                    No personalization rules found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRules.map((rule, index) => (
                  <TableRow key={rule.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium">{rule.rule_name}</TableCell>
                    <TableCell>
                      <span className="text-blue-600">{Object.keys(rule.conditions || {}).length} condition</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600">{Object.keys(rule.actions || {}).length} action{Object.keys(rule.actions || {}).length !== 1 ? 's' : ''}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-700">{rule.state}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(rule.updatedAt || rule.updated)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{rule.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
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

      <Dialog open={showNewRuleDialog} onOpenChange={setShowNewRuleDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Create a new rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Name*</Label>
              <Input
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="Name"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewRuleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRule} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalizationRules;
