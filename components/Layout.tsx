
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, History, Plus, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onAddClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onAddClick }) => {
  return (
    <div className="min-h-screen pb-24 flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b px-4 h-16 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TaskTracker
        </h1>
        <button 
          onClick={onAddClick}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom z-40">
        <div className="flex justify-around items-center h-16">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={22} />
            <span className="text-[10px] font-medium uppercase tracking-wider">概览</span>
          </NavLink>
          <NavLink 
            to="/tasks" 
            className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <ClipboardList size={22} />
            <span className="text-[10px] font-medium uppercase tracking-wider">任务库</span>
          </NavLink>
          <NavLink 
            to="/history" 
            className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <History size={22} />
            <span className="text-[10px] font-medium uppercase tracking-wider">发帖记录</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
