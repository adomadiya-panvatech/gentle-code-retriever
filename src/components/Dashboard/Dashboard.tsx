
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import UserList from '../Users/UserList';
import ContentList from '../Content/ContentList';
import CommunityList from '../Community/CommunityList';
import NotificationList from '../Notifications/NotificationList';
import {
  Users,
  FileText,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  Database,
  Tags,
  Image,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="font-medium">Login</TabsTrigger>
                <TabsTrigger value="register" className="font-medium">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <Login />
              </TabsContent>
              <TabsContent value="register" className="space-y-4">
                <Register />
              </TabsContent>
            </Tabs>
            {activeTab === 'login' ?
              <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>Email: admin@tovi.com</p>
                <p>Password: admin123</p>
              </div>
              : ''}

          </CardContent>
        </Card>
      </div>
    );
  }

  const cmsItems = [
    {
      title: 'Content Library',
      description: 'Manage articles, videos, tips, and HTML cards',
      icon: FileText,
      path: '/cms/content-library',
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      title: 'Content Collections',
      description: 'Organize content into themed collections',
      icon: Database,
      path: '/cms/content-collections',
      color: 'bg-green-500/10 text-green-600'
    },
    {
      title: 'Taxonomy',
      description: 'Create categories and tags for content',
      icon: Tags,
      path: '/cms/taxonomy',
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      title: 'Media Library',
      description: 'Manage videos, audio files, and images',
      icon: Image,
      path: '/cms/media-library',
      color: 'bg-orange-500/10 text-orange-600'
    }
  ];

  const tabItems = [
    { value: 'cms', label: 'Content Management', icon: FileText },
    { value: 'users', label: 'Users', icon: Users },
    // { value: 'communities', label: 'Communities', icon: MessageSquare },
    { value: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Menu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button onClick={logout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cms" className="space-y-8">
          {/* Enhanced Tab Navigation */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-2 shadow-sm">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2 bg-transparent">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="flex items-center gap-2 py-3 px-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            <TabsContent value="cms" className="space-y-6 mt-0">
              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Content Management System</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage your content, collections, and media</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {cmsItems.map((item) => (
                      <Card
                        key={item.path}
                        className="border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => navigate(item.path)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                              <item.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3">
                                {item.description}
                              </p>
                              <div className="flex items-center text-blue-600 text-sm font-medium">
                                Open
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6 mt-0">
              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">User Management</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage platform users and permissions</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <UserList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* <TabsContent value="communities" className="space-y-6 mt-0">
              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Community Management</CardTitle>
                      <p className="text-sm text-muted-foreground">Build and manage communities</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CommunityList />
                </CardContent>
              </Card>
            </TabsContent> */}

            <TabsContent value="notifications" className="space-y-6 mt-0">
              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Notifications</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage system notifications</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <NotificationList />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
