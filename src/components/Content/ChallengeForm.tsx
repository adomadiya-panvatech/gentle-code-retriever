
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, CalendarIcon, X } from 'lucide-react';

interface ChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  challenge?: any;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({ 
  isOpen, 
  onClose, 
  challenge 
}) => {
  const [formData, setFormData] = useState({
    name: challenge?.name || '',
    startDate: challenge?.startDate || '',
    endDate: challenge?.endDate || '',
    timeZone: challenge?.timeZone || '',
    type: challenge?.type || '',
    targetType: challenge?.targetType || '',
    target: challenge?.target || '',
    groupLabel: challenge?.groupLabel || ''
  });

  const handleSave = () => {
    console.log('Saving challenge:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-blue-900 text-xl font-semibold">
            Add Challenge
          </DialogTitle>
          <Button variant="ghost" onClick={onClose} className="text-gray-500">
            Close
          </Button>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="text-blue-600 border-b-2 border-blue-600">
              Details
            </TabsTrigger>
            <TabsTrigger value="participants" className="text-gray-500">
              Participants
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-gray-500">
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name*
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start date*
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full"
                    />
                    <CalendarIcon className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End date*
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full"
                    />
                    <CalendarIcon className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time zone*
                  </label>
                  <div className="relative">
                    <Select value={formData.timeZone} onValueChange={(value) => setFormData(prev => ({ ...prev, timeZone: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                      </SelectContent>
                    </Select>
                    <X className="absolute right-8 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900">Objective</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type*
                  </label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target type*
                  </label>
                  <Select value={formData.targetType} onValueChange={(value) => setFormData(prev => ({ ...prev, targetType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target*
                  </label>
                  <Select value={formData.target} onValueChange={(value) => setFormData(prev => ({ ...prev, target: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="target1">Target 1</SelectItem>
                      <SelectItem value="target2">Target 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Group (optional)</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label
                    </label>
                    <Input
                      value={formData.groupLabel}
                      onChange={(e) => setFormData(prev => ({ ...prev, groupLabel: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants">
            <div className="py-8 text-center text-gray-500">
              Participants content will be loaded here
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="py-8 text-center text-gray-500">
              Stats content will be loaded here
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeForm;
