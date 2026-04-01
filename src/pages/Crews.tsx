import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Users, 
  User, 
  UserPlus, 
  Clock, 
  History, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Tag,
  Briefcase,
  MapPin,
  ShieldCheck,
  UserCog,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  CREWS, 
  EMPLOYEES, 
  EMPLOYEE_RATE_HISTORY, 
  BRANCHES,
  RATE_CHANGE_REASONS
} from '../data/entities';

// --- Helpers ---

const formatCurrency = (value: number) => {
  return 'R' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace(/,/g, ' ');
};

// --- Components ---

const Badge = ({ children, color = 'gray' }: { children: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

const CrewCard = ({ crew }: { crew: any, key?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const branch = BRANCHES.find(b => b.id === crew.branchId);
  const members = EMPLOYEES.filter(e => crew.members.includes(e.id));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Users size={24} />
          </div>
          <Badge color={crew.shiftType === 'morning' ? 'green' : crew.shiftType === 'evening' ? 'amber' : 'blue'}>
            {crew.shiftType.toUpperCase()} SHIFT
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1">{crew.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <MapPin size={14} />
          {branch?.name}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Supervisor</p>
            <p className="text-sm font-bold text-gray-800 truncate">{crew.supervisor}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Members</p>
            <p className="text-sm font-bold text-gray-800">{crew.members.length} Staff</p>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isExpanded ? 'HIDE MEMBERS' : 'VIEW MEMBERS'}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {members.map(m => (
                <div key={m.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">
                      {m.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{m.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{m.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">{formatCurrency(m.standardHourlyRate)}/hr</p>
                    <p className="text-[10px] text-gray-400">OT: {formatCurrency(m.overtimeRate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RateHistoryAccordion = ({ employee }: { employee: any, key?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const history = EMPLOYEE_RATE_HISTORY
    .filter(h => h.employeeId === employee.id)
    .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());

  const getReasonColor = (reason: string) => {
    if (reason.includes('Promotion')) return 'green';
    if (reason.includes('Correction')) return 'blue';
    if (reason.includes('Annual')) return 'amber';
    return 'gray';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-3">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
            <UserCog size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900">{employee.name}</p>
            <p className="text-xs text-gray-500">{employee.role} • {employee.employeeCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold">Current Rate</p>
            <p className="font-bold text-amber-600">{formatCurrency(employee.standardHourlyRate)}</p>
          </div>
          <div className="text-gray-400">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-200">
                    <th className="pb-2 font-bold">Effective Date</th>
                    <th className="pb-2 font-bold text-right">Std Rate</th>
                    <th className="pb-2 font-bold text-right">OT Rate</th>
                    <th className="pb-2 font-bold px-4">Reason</th>
                    <th className="pb-2 font-bold">Changed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map(h => (
                    <tr key={h.id} className="hover:bg-white/50 transition-colors">
                      <td className="py-3 font-medium text-gray-600">{h.effectiveDate}</td>
                      <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(h.standardRate)}</td>
                      <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(h.overtimeRate)}</td>
                      <td className="py-3 px-4">
                        <Badge color={getReasonColor(h.changeReason)}>{h.changeReason}</Badge>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">{h.changedBy}</td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 italic">No rate history recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UpdateRateModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-600 text-white">
          <h3 className="text-xl font-bold">Update Labour Rate</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <ChevronDown className="rotate-90" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Employee</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
              {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} ({e.employeeCode})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Effective Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Change Reason</label>
            <div className="space-y-2">
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
                {RATE_CHANGE_REASONS.map(r => <option key={r.id} value={r.label}>{r.label}</option>)}
              </select>
              <button className="text-[10px] font-bold text-amber-600 hover:underline">+ Add custom reason</button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">New Std Rate (R/hr)</label>
            <input type="number" step="0.01" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">New OT Rate (R/hr)</label>
            <input type="number" step="0.01" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0.00" />
          </div>
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Changed By</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" defaultValue="Admin" />
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={() => {
              toast.success('Rate updated! (Mock)');
              onClose();
            }}
            className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
          >
            Update Rate
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function CrewsPage() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Crews & Labour</h1>
          <p className="text-gray-500 font-medium">Manage production teams, employee rates and history</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            <UserPlus size={20} />
            ADD EMPLOYEE
          </button>
          <button 
            onClick={() => setIsUpdateModalOpen(true)}
            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95"
          >
            <DollarSign size={20} />
            UPDATE RATE
          </button>
        </div>
      </header>

      {/* Crews Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-3">
            <Users size={24} className="text-amber-600" />
            Production Crews
          </h2>
          <button className="text-amber-600 font-bold text-sm hover:underline flex items-center gap-1">
            <Plus size={16} />
            New Crew
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREWS.map(crew => (
            <CrewCard key={crew.id} crew={crew} />
          ))}
        </div>
      </section>

      {/* Employees Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-3">
            <Briefcase size={24} className="text-amber-600" />
            Employee Master
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search employees..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-200">
                <th className="px-6 py-4 font-bold">Code</th>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Crew</th>
                <th className="px-6 py-4 font-bold text-right">Std Rate</th>
                <th className="px-6 py-4 font-bold text-right">OT Rate</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {EMPLOYEES.map(emp => {
                const crew = CREWS.find(c => c.id === emp.crewId);
                return (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400">{emp.employeeCode}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 font-bold text-xs">
                          {emp.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span className="font-bold text-gray-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.role}</td>
                    <td className="px-6 py-4">
                      <Badge color="blue">{crew?.name}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(emp.standardHourlyRate)}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(emp.overtimeRate)}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-amber-600 transition-colors">
                        <UserCog size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rate History Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-3">
            <History size={24} className="text-amber-600" />
            Labour Rate History
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
            <Info size={14} className="text-amber-600" />
            Audit trail for all rate changes
          </div>
        </div>
        <div className="space-y-4">
          {EMPLOYEES.map(emp => (
            <RateHistoryAccordion key={emp.id} employee={emp} />
          ))}
        </div>
      </section>

      <UpdateRateModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
    </div>
  );
}
