
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Database, Tags, Image, Users, Settings } from 'lucide-react';

const Index = () => {

  useEffect(() => {
    localStorage.clear();
    console.log('localStorage cleared');
  }, []);


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl">
                W
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">Wellness</h1>
                <p className="text-gray-600">Content Management System</p>
              </div>
            </div>
            <Link to="/dashboard">
              <Button className="bg-black text-white hover:bg-gray-800">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Powerful Content Management
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Organize, manage, and deliver your content with our comprehensive platform
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="w-12 h-12 text-black mb-4" />
              <CardTitle className="text-black">Content Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage articles, videos, tips, and HTML cards in one centralized location
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Database className="w-12 h-12 text-black mb-4" />
              <CardTitle className="text-black">Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Organize content into themed collections for better organization
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Tags className="w-12 h-12 text-black mb-4" />
              <CardTitle className="text-black">Taxonomy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create categories and tags to classify and organize your content
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image className="w-12 h-12 text-black mb-4" />
              <CardTitle className="text-black">Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Store and manage videos, audio files, and images efficiently
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-black mb-4" />
              <CardTitle className="text-black">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Control user access and permissions across your platform
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="w-12 h-12 text-black mb-4" />
              <CardTitle className="text-black">Advanced Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Powerful tools for content creation, moderation, and analytics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
