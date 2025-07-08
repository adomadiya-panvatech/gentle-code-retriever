
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Database,
  Tags,
  Image,
  Users,
  MessageSquare,
  Bell,
  LogOut,
  ChevronDown,
  Target,
  Award,
  Calendar,
  Trophy,
  ArrowLeft
} from 'lucide-react';

interface CMSLayoutProps {
  children: React.ReactNode;
}

const CMSLayout: React.FC<CMSLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    {
      title: 'Content',
      icon: FileText,
      items: [
        { label: 'Content Manager', path: '/cms/content-library', icon: FileText },
        { label: 'Content Collections', path: '/cms/content-collections', icon: Database },
        { label: 'Taxonomy', path: '/cms/taxonomy', icon: Tags },
        { label: 'Media Library', path: '/cms/media-library', icon: Image },
      ]
    },
    {
      title: 'Goals',
      icon: Target,
      items: [
        { label: 'Goal Templates', path: '/cms/goal-templates', icon: Target },
        { label: 'Goal Categories', path: '/cms/goal-categories', icon: Award },
        { label: 'Plan Templates', path: '/cms/plan-templates', icon: Calendar },
        { label: 'Challenges', path: '/cms/challenges', icon: Trophy },
      ]
    },
    {
      title: 'Tools',
      icon: Users,
      items: [
        { label: 'Survey Builder', path: '/cms/surveys', icon: MessageSquare },
        { label: 'Assignments', path: '/cms/assignments', icon: Calendar },
        { label: 'Community Groups', path: '/cms/community-groups', icon: Users },
        { label: 'Community Moderation', path: '/cms/community-moderation', icon: Bell },
      ]
    },
    {
      title: 'Rules',
      icon: Bell,
      items: [
        { label: 'Guidance', path: '/cms/guidance-rules', icon: Bell },
        { label: 'Personal', path: '/cms/personalization-rules', icon: Bell },
      ]
    },
    {
      title: 'People',
      icon: Users,
      items: [
        { label: 'Users', path: '/cms/users', icon: Users },
        { label: 'Companies', path: '/cms/companies', icon: Users },
      ]
    },
    {
      title: 'Settings',
      icon: Bell,
      items: [
        { label: 'Settings', path: '/cms/settings', icon: Bell },
      ]
    }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Back button with routing */}
            <Link to="/dashboard" className="text-blue-900 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* Logo */}
            <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold text-lg">
              W
            </div>
            <span className="text-xl font-bold text-blue-900">Wellness</span>
          </div>
          {/* <div className="mt-2 text-sm text-gray-600">Test</div> */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6">
          {sidebarItems.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{section.title}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
              <ul className="space-y-1 ml-6">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActiveRoute(item.path)
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {location.pathname.split('/').pop()?.replace('-', ' ').toUpperCase() || 'DASHBOARD'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button onClick={logout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CMSLayout;
