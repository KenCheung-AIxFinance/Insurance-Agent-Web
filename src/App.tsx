import { useLocation, Link, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import { Suspense, lazy, useState, useEffect } from 'react';
import { Button } from '@/components/general/ui/button';
import { Loader } from '@/components/general/ui/loader';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Overview = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const KnowledgeBaseList = lazy(() => import('./pages/KnowledgeBase/List'));
const KnowledgeBaseForm = lazy(() => import('./pages/KnowledgeBase/Form'));
const KnowledgeBaseDetail = lazy(() => import('./pages/KnowledgeBase/Detail'));
const ChatAssistant = lazy(() => import('./pages/Chat/ChatAssistant'));
const IntelligentCreation = lazy(() => import('./pages/IntelligentCreation/DocumentCreator'));
const Tutorials = lazy(() => import('./pages/Tutorials'));
const TutorialDetail = lazy(() => import('./pages/Tutorials/Detail'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const ProfileSetup = lazy(() => import('./pages/Auth/ProfileSetup'));

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
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null;
    needsProfileSetup: boolean;
  }>({ isAuthenticated: null, needsProfileSetup: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      if (user) {
        setAuthState({
          isAuthenticated: true,
          needsProfileSetup: !user.displayName,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          needsProfileSetup: false,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  if (authState.isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen"><Loader label="載入中..." /></div>;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (authState.needsProfileSetup && window.location.pathname !== '/profile-setup') {
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
