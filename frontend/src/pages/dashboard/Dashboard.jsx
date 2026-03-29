import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { path: '/dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/dashboard/medicines', label: 'Medicines', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { path: '/dashboard/batches', label: 'Batches', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { path: '/dashboard/reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const retailerLinks = [
  { path: '/dashboard', label: 'Scan History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/dashboard/verify', label: 'Verify Stock', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const links = user?.role === 'ADMIN' ? adminLinks : retailerLinks;

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', minHeight: '100vh' }}
      className="bg-gray-50 relative"
    >
      {/* Dashboard Sidebar */}
      <aside 
        style={{ width: '288px', flexShrink: 0 }}
        className="bg-white border-r border-gray-100 hidden md:block sticky top-0 h-screen z-40"
      >
        <div className="p-8 pt-[20px] space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray uppercase tracking-widest leading-none mb-1">Authenticated</p>
              <p className="text-sm font-bold text-dark truncate">{user?.name}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="px-2 text-[10px] font-bold text-gray/40 uppercase tracking-widest mb-4">Management</p>
            {links.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all no-underline group ${
                    isActive
                       ? 'bg-primary text-white shadow-md shadow-primary/20'
                       : 'text-gray hover:text-dark hover:bg-gray-50'
                  }`}
                >
                  <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray/50 group-hover:text-primary'} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto min-w-0">
        <div className="w-full max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
