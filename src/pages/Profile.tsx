
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Profile = () => {
  const [firstName, setFirstName] = useState('Test');
  const [email, setEmail] = useState('test+admin@tovifit.com');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    console.log('Saving profile:', { firstName, email });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 uppercase">FIRST NAME</Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 uppercase">EMAIL</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 uppercase">PASSWORD</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            type="password"
            placeholder="Enter new password"
          />
        </div>
      </div>

      <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white w-full">
        SAVE CHANGES
      </Button>
    </div>
  );
};

export default Profile;
