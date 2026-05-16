/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatInterface } from './components/ChatInterface';
import { User, MessageCircle, BookOpen, Hotel, CreditCard, MapPin, Settings, LayoutDashboard } from 'lucide-react';

export default function App() {
  return (
    <div className="h-[100dvh] w-full bg-[#E5DDD5] font-sans overflow-hidden flex flex-col">
      <ChatInterface />
    </div>
  );
}

const QuickLink = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group">
    <div className="text-blue-600 group-hover:scale-110 transition-transform flex justify-center">{icon}</div>
    <span className="text-[10px] font-bold text-slate-700 tracking-tight">{label}</span>
  </div>
);

const FactItem = ({ color, title, desc }: { color: string, title: string, desc: string }) => (
  <div className="flex gap-4 group">
    <div className={`w-1 h-10 ${color} rounded-full shrink-0 group-hover:scale-y-110 transition-transform`}></div>
    <div className="flex flex-col justify-center">
      <p className="text-xs font-bold text-slate-800 leading-none mb-1">{title}</p>
      <p className="text-[10px] text-slate-500 leading-none">{desc}</p>
    </div>
  </div>
);
