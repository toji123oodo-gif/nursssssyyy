
import React from 'react';
import { CreditCard, Copy, FileText, Check, AlertTriangle, ArrowUpRight, Download, Server } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Wallet: React.FC = () => {
  const { user } = useApp();
  const VODAFONE_NUMBER = "01093077151";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-[#E5E5E5] dark:border-[#333] pb-4">
        <div>
          <h1 className="text-xl font-bold text-main">Billing & Subscription</h1>
          <p className="text-xs text-muted mt-1">Manage your payment methods and view usage history.</p>
        </div>
        <button className="btn-primary text-xs">
           Upgrade Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Usage / Quota Card */}
         <div className="lg:col-span-2 cf-card p-6">
            <h3 className="text-sm font-bold text-main mb-6">Plan Usage</h3>
            
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-xs mb-1">
                     <span className="font-medium text-main">Course Access</span>
                     <span className="text-muted">Unlimited</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-[#333] rounded-sm overflow-hidden">
                     <div className="h-full bg-green-500 w-full"></div>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between text-xs mb-1">
                     <span className="font-medium text-main">AI Analysis Tokens</span>
                     <span className="text-muted">{user?.subscriptionTier === 'pro' ? '450 / 1000' : '0 / 0'} used</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-[#333] rounded-sm overflow-hidden">
                     <div className="h-full bg-[#0051C3] dark:bg-[#68b5fb]" style={{ width: user?.subscriptionTier === 'pro' ? '45%' : '0%' }}></div>
                  </div>
                  {user?.subscriptionTier !== 'pro' && (
                     <p className="text-[10px] text-brand-orange mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> Upgrade to enable AI features
                     </p>
                  )}
               </div>

               <div>
                  <div className="flex justify-between text-xs mb-1">
                     <span className="font-medium text-main">Storage (Downloads)</span>
                     <span className="text-muted">1.2 GB / 5 GB</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-[#333] rounded-sm overflow-hidden">
                     <div className="h-full bg-purple-500 w-[24%]"></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Current Plan Info */}
         <div className="cf-card p-6 bg-[#FAFAFA] dark:bg-[#151515]">
            <div className="flex items-start justify-between mb-4">
               <div>
                  <div className="text-xs font-bold text-muted uppercase tracking-wider">Current Plan</div>
                  <div className="text-2xl font-bold text-main mt-1">{user?.subscriptionTier === 'pro' ? 'PRO' : 'Free Tier'}</div>
               </div>
               <Server size={20} className="text-muted" />
            </div>
            
            <ul className="space-y-2 mb-6">
               <li className="flex items-center gap-2 text-xs text-muted">
                  <Check size={12} className="text-green-600" /> Community Access
               </li>
               <li className="flex items-center gap-2 text-xs text-muted">
                  <Check size={12} className="text-green-600" /> Basic Courses
               </li>
               <li className={`flex items-center gap-2 text-xs ${user?.subscriptionTier === 'pro' ? 'text-muted' : 'text-gray-300 decoration-line-through'}`}>
                  <Check size={12} className={user?.subscriptionTier === 'pro' ? 'text-green-600' : 'text-gray-300'} /> AI Features
               </li>
            </ul>

            <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#333]">
               <div className="flex justify-between items-center text-xs">
                  <span className="text-muted">Next Invoice</span>
                  <span className="font-mono text-main">Oct 25, 2024</span>
               </div>
               <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-muted">Estimated</span>
                  <span className="font-mono text-main">$0.00</span>
               </div>
            </div>
         </div>
      </div>

      {/* Manual Payment / "Add Funds" Section */}
      <div className="cf-card">
         <div className="cf-header">
            <h3 className="text-sm font-bold text-main">Payment Methods</h3>
         </div>
         <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-4 bg-white dark:bg-[#202020]">
               <div className="w-12 h-12 bg-red-600 text-white rounded-[4px] flex items-center justify-center font-bold text-xs shrink-0">
                  VF
               </div>
               <div className="flex-1">
                  <h4 className="text-sm font-bold text-main">Vodafone Cash (Manual)</h4>
                  <p className="text-xs text-muted mt-0.5">Transfer funds manually to activate subscription.</p>
                  <div className="flex items-center gap-2 mt-2">
                     <code className="bg-gray-100 dark:bg-[#333] px-2 py-0.5 rounded text-xs font-mono text-main">{VODAFONE_NUMBER}</code>
                     <button 
                        onClick={() => navigator.clipboard.writeText(VODAFONE_NUMBER)}
                        className="text-[#0051C3] dark:text-[#68b5fb] hover:underline text-xs"
                     >
                        Copy
                     </button>
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                   <a 
                     href={`https://wa.me/201093077151`} 
                     target="_blank"
                     className="btn-secondary text-xs"
                   >
                     Submit Receipt
                   </a>
               </div>
            </div>
         </div>
      </div>

      {/* Invoice History Table */}
      <div className="cf-card">
         <div className="cf-header">
            <h3 className="text-sm font-bold text-main">Invoice History</h3>
            <button className="text-[#0051C3] dark:text-[#68b5fb] text-xs hover:underline">Download All</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-[#FAFAFA] dark:bg-[#252525] border-b border-[#E5E5E5] dark:border-[#333]">
                  <tr>
                     <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Date</th>
                     <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Description</th>
                     <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Amount</th>
                     <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Status</th>
                     <th className="px-5 py-3 text-[11px] font-bold text-muted uppercase tracking-wider text-right">Invoice</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#333]">
                  <tr>
                     <td className="px-5 py-3 text-sm text-main text-right">Oct 01, 2024</td>
                     <td className="px-5 py-3 text-sm text-main text-right">Free Tier Allocation</td>
                     <td className="px-5 py-3 text-sm text-main font-mono text-right">$0.00</td>
                     <td className="px-5 py-3 text-right">
                        <span className="cf-badge bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">Paid</span>
                     </td>
                     <td className="px-5 py-3 text-right">
                        <Download size={14} className="text-muted hover:text-main cursor-pointer ml-auto" />
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
