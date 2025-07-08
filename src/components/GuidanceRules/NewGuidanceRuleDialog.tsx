
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface NewGuidanceRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewGuidanceRuleDialog: React.FC<NewGuidanceRuleDialogProps> = ({ open, onOpenChange }) => {
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState('Daily Checkup');

  const handleSubmit = () => {
    console.log('Creating new rule:', { ruleName, ruleType });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">New Guidance Rule:</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 uppercase">RULE TYPE</Label>
            <div className="flex gap-2">
              {['Time Slot', 'Daily Checkup', 'Scheduled', 'Usage Event'].map((type) => (
                <Button
                  key={type}
                  variant={ruleType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRuleType(type)}
                  className={ruleType === type ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 uppercase">RULE NAME</Label>
            <Input
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full"
              placeholder="Enter rule name"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewGuidanceRuleDialog;
