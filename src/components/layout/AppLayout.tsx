import React from 'react';
import { motion } from 'motion/react';
import { Search, History, Settings, Bot } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/50 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-100/50 rounded-full blur-[128px]" />
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-black/5 bg-white/30 backdrop-blur-xl p-6 flex flex-col gap-8 z-10"
      >
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400/30 to-blue-200/20 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">Z</span>
          </div>
          ZORRO
        </div>
        <nav className="flex-1 space-y-2">
            <NavItem icon={<Bot size={18}/>} label="Dashboard" />
            <NavItem icon={<Search size={18}/>} label="Search" />
            <NavItem icon={<History size={18}/>} label="History" />
        </nav>
        <div className="border-t border-black/5 pt-4">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">S</div>
              <div className="text-sm font-medium">Sam</div>
            </div>
            <NavItem icon={<Settings size={18}/>} label="Settings" />
        </div>
      </motion.aside>

      {/* Main Canvas */}
      <main className="flex-1 p-8 z-10">
        <div className="h-full rounded-3xl border border-black/5 bg-white/40 backdrop-blur-2xl p-6 shadow-2xl relative">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-slate-600 hover:text-slate-900">
    {icon}
    {label}
  </button>
);
