import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import NewGuidanceRuleDialog from '../components/GuidanceRules/NewGuidanceRuleDialog';
import EditGuidanceRuleDialog from '../components/GuidanceRules/EditGuidanceRuleDialog';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Eye, Pencil } from 'lucide-react';
import ViewModal from '../components/Modals/ViewModal';

const GuidanceRules = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [hideExpired, setHideExpired] = useState(true);
  const [showNewRuleDialog, setShowNewRuleDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('daily-checkup');
  const [tabPage, setTabPage] = useState({
    'daily-checkup': 1,
    'time-slot': 1,
    'scheduled': 1,
    'usage-event': 1,
  });
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingRule, setViewingRule] = useState(null);

  // Mock data for demonstration
  const mockRules = [
    { id: 1, name: '9 to 5_content', updated: '2022.03.02', state: 'Active', conditions: 1, actions: 1 },
    { id: 2, name: 'Affirmations/Kindness', updated: '2021.06.02', state: 'Disabled', conditions: 1, actions: 1 },
    { id: 3, name: 'BALANCE - anytime_tip', updated: '2021.05.27', state: 'Active', conditions: 1, actions: 1 },
    { id: 4, name: 'BALANCE - articles_anytime', updated: '2022.06.24', state: 'Active', conditions: 1, actions: 1 },
    { id: 5, name: 'BALANCE - collection_focus_area', updated: '2021.03.21', state: 'Active', conditions: 1, actions: 1 },
    { id: 6, name: 'BE ACTIVE - anytime_tip', updated: '2021.03.21', state: 'Active', conditions: 1, actions: 1 },
    { id: 7, name: 'BE ACTIVE - collection_focus_area', updated: '2021.03.21', state: 'Active', conditions: 1, actions: 1 },
    { id: 8, name: 'BRIGHT SIDE_content', updated: '2022.03.02', state: 'Active', conditions: 1, actions: 1 },
    { id: 9, name: 'COVID - anytime_tip', updated: '2021.06.08', state: 'Disabled', conditions: 1, actions: 1 },
    { id: 10, name: 'COVID - collection_recommendation', updated: '2021.06.08', state: 'Disabled', conditions: 1, actions: 1 },
    { id: 11, name: 'DESTRESS - activity_recommendation', updated: '2022.05.17', state: 'Disabled', conditions: 1, actions: 1 },
    { id: 12, name: 'DESTRESS - anytime_tip', updated: '2021.11.05', state: 'Active', conditions: 1, actions: 1 },
    { id: 13, name: 'DESTRESS - collection_focus_area', updated: '2022.02.28', state: 'Active', conditions: 1, actions: 1 },
    { id: 14, name: 'DESTRESS - collection_focus_area (2)', updated: '2021.11.05', state: 'Disabled', conditions: 1, actions: 2 },
    { id: 15, name: 'EAT HEALTHY - anytime_tip', updated: '2021.03.21', state: 'Active', conditions: 1, actions: 1 },
    { id: 16, name: 'FITNESS - workout_recommendation', updated: '2022.01.15', state: 'Active', conditions: 1, actions: 2 },
    { id: 17, name: 'MINDFULNESS - meditation_tip', updated: '2021.12.10', state: 'Active', conditions: 1, actions: 1 },
    { id: 18, name: 'SLEEP - bedtime_routine', updated: '2022.04.08', state: 'Active', conditions: 1, actions: 1 },
    { id: 19, name: 'HYDRATION - water_reminder', updated: '2021.09.22', state: 'Disabled', conditions: 1, actions: 1 },
    { id: 20, name: 'SOCIAL - connection_prompt', updated: '2022.07.03', state: 'Active', conditions: 1, actions: 1 }
  ];

  const fetchRules = async (page = 1) => {
    if (!token) {
      // Use mock data when no token
      const totalItems = mockRules.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockRules.slice(startIndex, endIndex);
      
      setRules(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/guidance-rules?page=${page}&limit=${itemsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRules(data.data || data);
      setTotalPages(Math.ceil((data.total || data.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching guidance rules:', error);
      // Fallback to mock data
      const totalItems = mockRules.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockRules.slice(startIndex, endIndex);
      
      setRules(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      
      toast({
        title: "Error",
        description: "Failed to load guidance rules, showing sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules(currentTab === 'daily-checkup' ? tabPage['daily-checkup'] : currentTab === 'time-slot' ? tabPage['time-slot'] : currentTab === 'scheduled' ? tabPage['scheduled'] : tabPage['usage-event']);
  }, [currentTab, tabPage, token]);

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setHideExpired(checked);
    }
  };

  const handleRuleClick = (rule: any) => {
    setSelectedRule(rule);
    setShowEditDialog(true);
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const handleTabPageChange = (tab, page) => {
    setTabPage(prev => ({ ...prev, [tab]: page }));
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

  const tabStatusMap = {
    'daily-checkup': 'Daily Checkup',
    'time-slot': 'Time Slot',
    'scheduled': 'Scheduled',
    'usage-event': 'Usage Event',
  };

  function getFilteredRules(tab) {
    return rules.filter(rule => rule.status === tabStatusMap[tab]);
  }

  function getPaginatedRules(tab) {
    const filtered = getFilteredRules(tab);
    const page = tabPage[tab] || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  function getTotalPages(tab) {
    const filtered = getFilteredRules(tab);
    return Math.ceil(filtered.length / itemsPerPage) || 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Guidance Rules</h1>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setShowNewRuleDialog(true)}
        >
          + New Rule
        </Button>
      </div>

      <Tabs defaultValue="daily-checkup" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="time-slot">Time Slot</TabsTrigger>
          <TabsTrigger value="daily-checkup">Daily Checkup</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="usage-event">Usage Event</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            checked={hideExpired}
            onCheckedChange={handleCheckboxChange}
          />
          <label className="text-sm">Hide Expired</label>
        </div>

        {['daily-checkup', 'time-slot', 'scheduled', 'usage-event'].map(tab => (
          <TabsContent value={tab} className="space-y-4" key={tab}>
            <Card className="border-gray-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-900">Rule Name</TableHead>
                      <TableHead className="font-semibold text-gray-900">Updated</TableHead>
                      <TableHead className="font-semibold text-gray-900">State</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-center">
                        <div className="flex flex-col">
                          <span>condition</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 text-center">
                        <div className="flex flex-col">
                          <span>action</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="p-8 text-center text-gray-500">
                          Loading guidance rules...
                        </TableCell>
                      </TableRow>
                    ) : getFilteredRules(tab).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="p-8 text-center text-gray-500">
                          No guidance rules found
                        </TableCell>
                      </TableRow>
                    ) : (
                      getPaginatedRules(tab).map((rule) => (
                        <TableRow key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <TableCell>
                            <span 
                              className="text-blue-600 hover:underline cursor-pointer"
                              onClick={() => handleRuleClick(rule)}
                            >
                              {rule.rule_name}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(rule.updatedAt || rule.updated)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              rule.state === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : rule.state === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {rule.state}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-blue-600">{Object.keys(rule.conditions || {}).length} condition</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => {
                                  setViewingRule(rule);
                                  setShowViewModal(true);
                                }}
                                title="View"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => handleRuleClick(rule)}
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {/* Pagination */}
                {getTotalPages(tab) > 1 && (
                  <div className="p-4 border-t">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => tabPage[tab] > 1 && handleTabPageChange(tab, tabPage[tab] - 1)}
                            className={tabPage[tab] === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {[...Array(Math.min(5, getTotalPages(tab)))].map((_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handleTabPageChange(tab, page)}
                                isActive={tabPage[tab] === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => tabPage[tab] < getTotalPages(tab) && handleTabPageChange(tab, tabPage[tab] + 1)}
                            className={tabPage[tab] === getTotalPages(tab) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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

      <NewGuidanceRuleDialog
        open={showNewRuleDialog} 
        onOpenChange={setShowNewRuleDialog}
      />
      <EditGuidanceRuleDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        rule={selectedRule}
      />
      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingRule(null);
        }}
        title="View Guidance Rule"
        data={viewingRule}
        type="guidance-rule"
      />
    </div>
  );
};

export default GuidanceRules;
