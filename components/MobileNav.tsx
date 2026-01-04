
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM as any;
import { Home, Book, Users, Calendar, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/courses', icon: Book, label: 'Courses' },
    { path: '/schedule', icon: Calendar, label: 'Today' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#161616]/90 backdrop-blur-lg border-t border-[#E5E5E5] dark:border-[#333] pb-safe pt-2 px-6">
      <div className="flex justify-between items-center h-14">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                active 
                ? 'text-[#F38020] -translate-y-1' 
                : 'text-[#999] hover:text-[#666] dark:hover:text-[#ccc]'
              }`}
            >
              <item.icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 2} />
              {/* <span className="text-[10px] font-medium">{item.label}</span> */}
              {active && <div className="w-1 h-1 rounded-full bg-[#F38020] mt-1"></div>}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
