
import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { ChevronRight, User, Lock, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  const settingsItems = [
    {
      icon: User,
      title: 'Profile',
      path: '/cms/settings/profile'
    },
    {
      icon: Lock,
      title: 'Password',
      path: '/cms/settings/password'
    },
    {
      icon: Clock,
      title: 'Time Zone',
      path: '/cms/settings/timezone'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-full bg-blue-500 text-white py-2 mb-8">
          CHANGE PHOTO
        </div>
      </div>

      <div className="space-y-1">
        {settingsItems.map((item) => (
          <Card key={item.title} className="border-gray-200 cursor-pointer hover:bg-gray-50" onClick={() => navigate(item.path)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900">{item.title}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Settings;
