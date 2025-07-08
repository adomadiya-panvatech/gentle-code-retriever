import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Dashboard from './components/Dashboard/Dashboard';
import CMSLayout from './components/Layout/CMSLayout';
import ContentLibrary from './pages/ContentLibrary';
import ContentCollections from './pages/ContentCollections';
import Taxonomy from './pages/Taxonomy';
import MediaLibrary from './pages/MediaLibrary';
import GoalTemplates from './pages/GoalTemplates';
import GoalCategories from './pages/GoalCategories';
import PlanTemplates from './pages/PlanTemplates';
import Challenges from './pages/Challenges';
import Surveys from './pages/Surveys';
import Assignments from './pages/Assignments';
import CommunityGroups from './pages/CommunityGroups';
import CommunityModeration from './pages/CommunityModeration';
import GuidanceRules from './pages/GuidanceRules';
import PersonalizationRules from './pages/PersonalizationRules';
import UserList from './components/Users/UserList';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Password from './pages/Password';
import Companies from './pages/Companies';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* CMS Routes */}
            <Route path="/cms/content-library" element={
              <CMSLayout>
                <ContentLibrary />
              </CMSLayout>
            } />
            <Route path="/cms/content-collections" element={
              <CMSLayout>
                <ContentCollections />
              </CMSLayout>
            } />
            <Route path="/cms/taxonomy" element={
              <CMSLayout>
                <Taxonomy />
              </CMSLayout>
            } />
            <Route path="/cms/media-library" element={
              <CMSLayout>
                <MediaLibrary />
              </CMSLayout>
            } />
            <Route path="/cms/goal-templates" element={
              <CMSLayout>
                <GoalTemplates />
              </CMSLayout>
            } />
            <Route path="/cms/goal-categories" element={
              <CMSLayout>
                <GoalCategories />
              </CMSLayout>
            } />
            <Route path="/cms/plan-templates" element={
              <CMSLayout>
                <PlanTemplates />
              </CMSLayout>
            } />
            <Route path="/cms/challenges" element={
              <CMSLayout>
                <Challenges />
              </CMSLayout>
            } />
            
            {/* Tools Routes */}
            <Route path="/cms/surveys" element={
              <CMSLayout>
                <Surveys />
              </CMSLayout>
            } />
            <Route path="/cms/assignments" element={
              <CMSLayout>
                <Assignments />
              </CMSLayout>
            } />
            <Route path="/cms/community-groups" element={
              <CMSLayout>
                <CommunityGroups />
              </CMSLayout>
            } />
            <Route path="/cms/community-moderation" element={
              <CMSLayout>
                <CommunityModeration />
              </CMSLayout>
            } />
            
            {/* Rules Routes */}
            <Route path="/cms/guidance-rules" element={
              <CMSLayout>
                <GuidanceRules />
              </CMSLayout>
            } />
            <Route path="/cms/personalization-rules" element={
              <CMSLayout>
                <PersonalizationRules />
              </CMSLayout>
            } />
            
            {/* Settings Routes */}
            <Route path="/cms/settings" element={
              <CMSLayout>
                <Settings />
              </CMSLayout>
            } />
            <Route path="/cms/settings/profile" element={
              <CMSLayout>
                <Profile />
              </CMSLayout>
            } />
            <Route path="/cms/settings/password" element={
              <CMSLayout>
                <Password />
              </CMSLayout>
            } />
            
            {/* Companies Route */}
            <Route path="/cms/companies" element={
              <CMSLayout>
                <Companies />
              </CMSLayout>
            } />

            <Route path="/cms/users" element={
              <CMSLayout>
                <UserList />
              </CMSLayout>
            } />
            
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
