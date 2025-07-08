
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    console.log('Updating password');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Password</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 uppercase">CURRENT PASSWORD</Label>
          <Input
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full"
            type="password"
            placeholder="Current password"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 uppercase">NEW PASSWORD</Label>
          <Input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full"
            type="password"
            placeholder="New password"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 uppercase">NEW PASSWORD AGAIN</Label>
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
            type="password"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white w-full">
        SAVE CHANGES
      </Button>
    </div>
  );
};

export default Password;
