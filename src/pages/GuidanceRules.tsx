import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NewGuidanceRuleDialog from '../components/GuidanceRules/NewGuidanceRuleDialog';
import EditGuidanceRuleDialog from '../components/GuidanceRules/EditGuidanceRuleDialog';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const GuidanceRules = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [hideExpired, setHideExpired] = useState(true);
  const [showNewRuleDialog, setShowNewRuleDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRules();
  }, [currentPage, token]);

  const fetchRules = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/guidance-rules?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRules(data.data || data);
      setTotalPages(Math.ceil((data.total || data.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching guidance rules:', error);
      toast({
        title: "Error",
        description: "Failed to load guidance rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    { id: 15, name: 'EAT HEALTHY - anytime_tip', updated: '2021.03.21', state: 'Active', conditions: 1, actions: 1 }
  ];

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setHideExpired(checked);
    }
  };

  const handleRuleClick = (rule: any) => {
    setSelectedRule(rule);
    setShowEditDialog(true);
  };

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

      <Tabs defaultValue="daily-checkup" className="w-full">
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

        <TabsContent value="daily-checkup" className="space-y-4">
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
                        <span>1 condition</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      <div className="flex flex-col">
                        <span>1 action</span>
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
                  ) : (rules.length > 0 ? rules : mockRules).map((rule) => (
                    <TableRow key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell>
                        <span 
                          className="text-blue-600 hover:underline cursor-pointer"
                          onClick={() => handleRuleClick(rule)}
                        >
                          {rule.name}
                        </span>
                      </TableCell>
                      <TableCell>{rule.updated}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          rule.state === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.state}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-blue-600">{rule.conditions} condition</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-blue-600">{rule.actions} action{rule.actions > 1 ? 's' : ''}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-slot">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No time slot rules</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No scheduled rules</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage-event">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No usage event rules</p>
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

      <NewGuidanceRuleDialog
        open={showNewRuleDialog} 
        onOpenChange={setShowNewRuleDialog}
      />
      <EditGuidanceRuleDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        rule={selectedRule}
      />
    </div>
  );
};

export default GuidanceRules;
