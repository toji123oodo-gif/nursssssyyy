
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#101010] flex flex-col items-center justify-center p-4">
       <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
             <div className="w-16 h-16 bg-gray-100 dark:bg-[#1E1E1E] rounded-full flex items-center justify-center text-gray-400">
                <AlertTriangle size={32} />
             </div>
          </div>
          
          <h1 className="text-6xl font-black text-[#1a1a1a] dark:text-white tracking-tighter">404</h1>
          
          <div>
             <h2 className="text-lg font-bold text-main">Page not found</h2>
             <p className="text-sm text-muted mt-2 leading-relaxed">
                The page you are looking for doesn't exist or has been moved. 
                Please verify the URL or navigate back to the dashboard.
             </p>
          </div>

          <div className="flex justify-center pt-4">
             <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                <ArrowLeft size={16} /> Return Home
             </Link>
          </div>
       </div>
       
       <div className="absolute bottom-8 text-[10px] text-muted font-mono">
          ERROR_CODE: PAGE_NOT_FOUND • NURSY_OS_V2
       </div>
    </div>
  );
};
