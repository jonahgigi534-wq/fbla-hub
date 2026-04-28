import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventRecommender from './pages/EventRecommender';
import Admin from './pages/Admin';
import CustomCursor from './components/CustomCursor';

// Auth Context
interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {}, loading: true });

export const useAuth = () => useContext(AuthContext);

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center text-navy font-serif text-3xl">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc]">
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 overflow-y-auto ${hideSidebar ? '' : 'p-8 md:ml-60'} transition-all duration-300 animate-fade-up`}>
        {children}
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth on load
    fetch('http://localhost:5000/api/auth/me', {credentials: 'include'})
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not auth');
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      <BrowserRouter>
        <CustomCursor />
        <Layout>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/recommend" element={<ProtectedRoute><EventRecommender /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
