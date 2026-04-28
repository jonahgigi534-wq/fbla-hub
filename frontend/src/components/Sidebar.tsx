import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, HelpCircle, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../App';

export default function Sidebar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Upcoming Events', path: '/events', icon: Calendar },
    { name: 'What Event?', path: '/recommend', icon: HelpCircle },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: Shield });
  }

  return (
    <div className="fixed inset-y-0 left-0 w-60 bg-navy text-white flex flex-col z-50">
      <div className="p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg p-2 shadow-sm w-full flex justify-center">
          <img src="/fbla-logo.png" alt="FBLA Hub Logo" className="h-8 w-auto" />
        </div>
      </div>

      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                isActive 
                  ? 'border-l-[3px] border-gold bg-[rgba(255,255,255,0.08)]' 
                  : 'border-l-[3px] border-transparent hover:bg-[rgba(255,255,255,0.08)]'
              }`
            }
          >
            <item.icon size={20} className="text-white/80" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[rgba(10,46,127,0.1)] border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-cobalt flex items-center justify-center font-serif text-lg">
            {user?.name?.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-tight">{user?.name}</span>
            <span className="text-xs text-white/60 capitalize">{user?.role}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-2 text-white/80 hover:text-white transition-colors duration-200"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
