
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';

const PersonalizationRules = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewRuleDialog, setShowNewRuleDialog] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');

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

  const handleCreateRule = () => {
    console.log('Creating new rule:', newRuleName);
    setNewRuleName('');
    setShowNewRuleDialog(false);
  };

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
              {mockRules.map((rule, index) => (
                <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <span className="text-blue-600">{rule.conditions}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-600">{rule.actions}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">{rule.state} ▼</span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{rule.lastUpdated}</TableCell>
                  <TableCell className="text-sm text-gray-600">{rule.taxonomies}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
