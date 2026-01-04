
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, BarChart3, ArrowUpRight, CheckCircle2, 
  AlertCircle, ShieldCheck, Activity, Globe, Zap, Wallet
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, courses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-main">Overview</h1>
          <p className="text-xs text-muted mt-1">Summary of your learning activity and subscription status.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="btn-secondary">Download Report</button>
           <button className="btn-primary">
             <Plus size={14} /> Add Course
           </button>
        </div>
      </div>

      {/* Analytics Cards - Boxy & Dense */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="cf-card p-4">
           <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Active Courses</div>
           <div className="flex items-baseline gap-2">
             <span className="text-2xl font-bold text-main">{courses.length}</span>
             <span className="text-xs text-green-600 font-medium">+1 new</span>
           </div>
           <div className="mt-3 h-1 w-full bg-gray-100 dark:bg-[#333] rounded-sm overflow-hidden">
              <div className="h-full bg-green-500 w-3/4"></div>
           </div>
        </div>
        
        <div className="cf-card p-4">
           <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Completion Rate</div>
           <div className="flex items-baseline gap-2">
             <span className="text-2xl font-bold text-main">88.5%</span>
             <span className="text-xs text-muted">avg</span>
           </div>
           <div className="mt-3 text-[10px] text-muted flex justify-between">
              <span>Last 7 days</span>
              <span className="text-green-600">▲ 2.4%</span>
           </div>
        </div>

        <div className="cf-card p-4">
           <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Security Status</div>
           <div className="flex items-center gap-2 mb-1">
             <ShieldCheck size={20} className="text-green-600" />
             <span className="text-sm font-bold text-main">Protected</span>
           </div>
           <p className="text-[10px] text-muted">Account is secure. 2FA enabled.</p>
        </div>

        <div className="cf-card p-4">
           <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Plan Usage</div>
           <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-[#0051C3] dark:text-[#68b5fb]">{user.subscriptionTier.toUpperCase()}</span>
              <span className="text-[10px] text-muted">Renews Oct 25</span>
           </div>
           <div className="w-full bg-gray-100 dark:bg-[#333] h-1.5 rounded-sm">
             <div className="bg-[#F38020] h-full w-[40%] rounded-sm"></div>
           </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="cf-card">
        {/* Table Header / Toolbar */}
        <div className="cf-header">
           <h3 className="text-sm font-bold text-main">Enrolled Courses</h3>
           <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="cf-input pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAFA] dark:bg-[#252525] border-b border-[#E5E5E5] dark:border-[#333]">
              <tr>
                <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Course Name</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Status</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Progress</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Last Activity</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#333]">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors group">
                  <td className="px-5 py-3.5 text-right">
                     <div className="flex items-center gap-3 justify-end">
                       <div className="text-right">
                         <div className="text-sm font-medium text-main">{course.title}</div>
                         <div className="text-xs text-muted flex items-center justify-end gap-1">
                           {course.subject} <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span> {course.instructor}
                         </div>
                       </div>
                       <div className="w-8 h-8 rounded-[4px] bg-blue-50 dark:bg-[#2B3A4F] text-[#0051C3] dark:text-[#68b5fb] flex items-center justify-center shrink-0">
                         <Zap size={16} />
                       </div>
                     </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                     <span className="cf-badge bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                       Active
                     </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                     <div className="flex items-center justify-end gap-3">
                        <span className="text-xs font-mono text-muted">45%</span>
                        <div className="w-24 bg-gray-100 dark:bg-[#333] h-1.5 rounded-sm overflow-hidden">
                           <div className="bg-[#F38020] h-full w-[45%]"></div>
                        </div>
                     </div>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-muted font-mono">
                     2 hours ago
                  </td>
                  <td className="px-5 py-3.5 text-right">
                     <Link to={`/course/${course.id}`} className="cf-link text-xs">
                       Manage
                     </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Pagination */}
        <div className="px-5 py-3 border-t border-[#E5E5E5] dark:border-[#333] bg-[#FAFAFA] dark:bg-[#252525] flex justify-between items-center">
           <span className="text-xs text-muted">Showing 1-{filteredCourses.length} of {filteredCourses.length} items</span>
           <div className="flex gap-1">
              <button className="px-2 py-1 border border-[#E5E5E5] dark:border-[#333] rounded-[3px] bg-white dark:bg-[#1E1E1E] text-xs text-muted disabled:opacity-50" disabled>Prev</button>
              <button className="px-2 py-1 border border-[#E5E5E5] dark:border-[#333] rounded-[3px] bg-white dark:bg-[#1E1E1E] text-xs text-muted disabled:opacity-50" disabled>Next</button>
           </div>
        </div>
      </div>
      
      {/* Secondary Info Area (Quick Links) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="cf-card p-5 flex items-start justify-between">
            <div>
               <h4 className="text-sm font-bold text-main mb-1">Community Activity</h4>
               <p className="text-xs text-muted mb-3">Join the discussion with other students.</p>
               <Link to="/community" className="cf-link text-xs">Go to Community &rarr;</Link>
            </div>
            <Activity size={20} className="text-muted" />
         </div>
         <div className="cf-card p-5 flex items-start justify-between">
            <div>
               <h4 className="text-sm font-bold text-main mb-1">Billing & Invoices</h4>
               <p className="text-xs text-muted mb-3">Manage your subscription and payment methods.</p>
               <Link to="/wallet" className="cf-link text-xs">View Billing &rarr;</Link>
            </div>
            <Wallet size={20} className="text-muted" />
         </div>
      </div>
    </div>
  );
};
