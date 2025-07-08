
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Search, Edit, Trash2, Link as LinkIcon, Copy, RefreshCw, Share } from 'lucide-react';

const Surveys = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

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

  const handleSave = () => {
    console.log('Saving survey:', formData);
    setIsFormOpen(false);
  };

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
              {mockSurveys.map((survey) => (
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
              ))}
            </TableBody>
          </Table>
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
    </div>
  );
};

export default Surveys;
