
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as notificationService from '../../services/notificationService';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Bell, BellRing, Check, Trash2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';

const NotificationList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // const fetchNotifications = () => {
  //   if (user) {
  //     notificationService.getNotifications(localStorage.getItem('token')!).then(setNotifications);
  //   }
  // };

  const fetchNotifications = () => {
    if (user) {
      // ❌ Original API call
      // notificationService.getNotifications(localStorage.getItem('token')!).then(setNotifications);

      // ✅ Mock data
      const mockNotifications = [
        {
          id: '1',
          message: 'Your profile was updated successfully.',
          read: false,
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          message: 'Welcome to the platform!',
          read: true,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          message: 'You have a new message from support.',
          read: false,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      setNotifications(mockNotifications);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // const handleMarkAsRead = async (id: string) => {
  //   try {
  //     await notificationService.markAsRead(id, localStorage.getItem('token')!);
  //     fetchNotifications();
  //     toast({
  //       title: "Success",
  //       description: "Notification marked as read",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to mark notification as read",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const handleMarkAllAsRead = async () => {
  //   try {
  //     const unreadNotifications = notifications.filter(n => !n.read);
  //     await Promise.all(
  //       unreadNotifications.map(n => 
  //         notificationService.markAsRead(n.id, localStorage.getItem('token')!)
  //       )
  //     );
  //     fetchNotifications();
  //     toast({
  //       title: "Success",
  //       description: "All notifications marked as read",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to mark all notifications as read",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleMarkAsRead = async (id: string) => {
    try {
      // ❌ API call removed
      // await notificationService.markAsRead(id, localStorage.getItem('token')!);

      // ✅ Update state locally
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );

      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // ❌ API call removed
      // const unreadNotifications = notifications.filter(n => !n.read);
      // await Promise.all(
      //   unreadNotifications.map(n => 
      //     notificationService.markAsRead(n.id, localStorage.getItem('token')!)
      //   )
      // );

      // ✅ Update all notifications locally
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );

      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const filteredNotifications = notifications.filter(n =>
    n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2 py-1">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:w-64"
            />
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead} className="gap-2">
              <Check className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No notifications found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((n) => (
            <Card
              key={n.id}
              className={`transition-all duration-200 ${!n.read
                ? 'border-primary/30 bg-primary/5 shadow-sm'
                : 'hover:shadow-sm'
                }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-1 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`}>
                      {!n.read ? (
                        <BellRing className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${!n.read ? 'font-medium text-foreground' : 'text-muted-foreground'
                        }`}>
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {!n.read ? (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Read
                          </Badge>
                        )}
                        {n.timestamp && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(n.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!n.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(n.id)}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
