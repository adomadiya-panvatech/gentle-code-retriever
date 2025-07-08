
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface EditGuidanceRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: any;
}

const EditGuidanceRuleDialog: React.FC<EditGuidanceRuleDialogProps> = ({ open, onOpenChange, rule }) => {
  const [ruleName, setRuleName] = useState(rule?.name || '');
  const [ruleType, setRuleType] = useState('daily-checkup');
  const [activeAfter, setActiveAfter] = useState('');
  const [activeUntil, setActiveUntil] = useState('');
  const [probability, setProbability] = useState('100');
  const [ruleLimit, setRuleLimit] = useState('No limit');

  const handleSave = () => {
    console.log('Saving rule:', { ruleName, ruleType, activeAfter, activeUntil, probability, ruleLimit });
    onOpenChange(false);
  };

  const handleDelete = () => {
    console.log('Deleting rule');
    onOpenChange(false);
  };

  const handleDisable = () => {
    console.log('Disabling rule');
    onOpenChange(false);
  };

  const handleDuplicate = () => {
    console.log('Duplicating rule');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Details: {rule?.name || 'Rule'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase">RULE NAME</Label>
              <Input
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase">RULE TYPE</Label>
              <Input
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value)}
                className="w-full"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase">ACTIVE AFTER</Label>
              <div className="relative">
                <Input
                  value={activeAfter}
                  onChange={(e) => setActiveAfter(e.target.value)}
                  className="w-full pr-10"
                  placeholder="Select date"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500">
                  📅 Local time for admin
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase">ACTIVE UNTIL</Label>
              <div className="relative">
                <Input
                  value={activeUntil}
                  onChange={(e) => setActiveUntil(e.target.value)}
                  className="w-full pr-10"
                  placeholder="Select date"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-500">
                  📅 Local time for admin
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase">PROBABILITY PERCENT</Label>
              <Input
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full"
                type="number"
              />
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Probability ranges from 0 to 100, the default is 100.</p>
                <p>• Probability is the chance this rule will be run.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase">RULE LIMIT:</Label>
              <select 
                value={ruleLimit}
                onChange={(e) => setRuleLimit(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option>No limit</option>
                <option>Once per day</option>
                <option>Once per week</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={handleDisable} className="bg-orange-500 text-white hover:bg-orange-600">
              Disable
            </Button>
            <Button variant="outline" onClick={handleDuplicate}>
              Duplicate
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditGuidanceRuleDialog;
