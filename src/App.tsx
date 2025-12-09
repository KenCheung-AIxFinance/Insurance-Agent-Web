import { useLocation, Link, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './layouts/RootLayout';
import { Suspense, lazy, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useAuth } from './contexts/AuthContext';

const Overview = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/Projects/Detail'));
const KnowledgeBaseList = lazy(() => import('./pages/KnowledgeBase/List'));
const KnowledgeBaseForm = lazy(() => import('./pages/KnowledgeBase/Form'));
const KnowledgeBaseDetail = lazy(() => import('./pages/KnowledgeBase/Detail'));
const ChatAssistant = lazy(() => import('./pages/Chat/ChatAssistant'));
const IntelligentCreation = lazy(() => import('./pages/IntelligentCreation/DocumentCreator'));
const Tutorials = lazy(() => import('./pages/Tutorials'));
const TutorialDetail = lazy(() => import('./pages/Tutorials/Detail'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const ProfileSetup = lazy(() => import('./pages/Auth/ProfileSetup'));
const Settings = lazy(() => import('./pages/Settings'));

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.2 }}
    className="p-4"
  >
    {children}
  </motion.div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, needsProfileSetup } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader label="載入中..." /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (needsProfileSetup && window.location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" />;
  }

  return <>{children}</>;
};



export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="p-4"><Loader label="載入中..." /></div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile-setup" element={
              <ProtectedRoute>
                <PageWrapper>
                  <ProfileSetup />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <PageWrapper>
                  <Settings />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <Navigate to="/overview" replace />
            } />
            <Route path="/overview" element={
              <ProtectedRoute>
                <PageWrapper>
                  <Overview />
                </PageWrapper>
              </ProtectedRoute>
            } />
            {/* 項目詳情頁使用獨立的 ProjectLayout 佈局，不需要 PageWrapper */}
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <PageWrapper>
                  <ProjectDetail />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <PageWrapper>
                  <Projects />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/knowledge-base" element={<ProtectedRoute><PageWrapper><KnowledgeBaseList /></PageWrapper></ProtectedRoute>} />
            <Route path="/knowledge-base/new" element={<ProtectedRoute><PageWrapper><KnowledgeBaseForm /></PageWrapper></ProtectedRoute>} />
            <Route path="/knowledge-base/:id" element={<ProtectedRoute><PageWrapper><KnowledgeBaseDetail /></PageWrapper></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><PageWrapper><ChatAssistant /></PageWrapper></ProtectedRoute>} />
            <Route path="/intelligent-creation" element={<ProtectedRoute><PageWrapper><IntelligentCreation /></PageWrapper></ProtectedRoute>} />
            <Route path="/tutorials" element={<ProtectedRoute><PageWrapper><Tutorials /></PageWrapper></ProtectedRoute>} />
            <Route path="/tutorials/:id" element={<ProtectedRoute><PageWrapper><TutorialDetail /></PageWrapper></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}
