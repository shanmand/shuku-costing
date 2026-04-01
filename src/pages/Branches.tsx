import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  MapPin, 
  User, 
  Activity, 
  TrendingUp, 
  Package, 
  ChevronDown, 
  ChevronUp,
  Building2,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  BRANCHES, 
  PRODUCTION_BATCHES, 
  INGREDIENTS 
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
    charcoal: 'bg-gray-800 text-white border-gray-900',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

const BranchCard = ({ branch }: { branch: any, key?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(branch.isActive);

  const activeBatches = PRODUCTION_BATCHES.filter(b => b.branchId === branch.id && b.status === 'In Progress').length;
  const activeIngredients = INGREDIENTS.filter(i => i.currentStock > 0).length; // Simplified for demo
  const mtdCost = 125400 + (Math.random() * 50000); // Mocked MTD Cost

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Building2 size={24} />
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsActive(!isActive); }}
            className={`transition-colors ${isActive ? 'text-green-600' : 'text-gray-300'}`}
          >
            {isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1">{branch.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <MapPin size={14} />
          {branch.location}
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-6">
          <User size={14} className="text-amber-600" />
          Manager: {branch.manager}
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isExpanded ? 'HIDE SUMMARY' : 'VIEW SUMMARY'}
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
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                <Activity size={16} className="mx-auto text-amber-600 mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Batches</p>
                <p className="text-lg font-black text-gray-900">{activeBatches}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                <DollarSign size={16} className="mx-auto text-green-600 mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">MTD Cost</p>
                <p className="text-lg font-black text-gray-900">{formatCurrency(mtdCost)}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                <Package size={16} className="mx-auto text-blue-600 mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ingredients</p>
                <p className="text-lg font-black text-gray-900">{activeIngredients}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NewBranchModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-600 text-white">
          <h3 className="text-xl font-bold">Create New Branch</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <ChevronDown className="rotate-90" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Branch Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. West Branch (Roodepoort)" />
          </div>
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Full address..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Manager</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Name..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Contact Number</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="011..." />
          </div>
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="branch@shuku.co.za" />
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={() => {
              toast.success('New branch created! (Mock)');
              onClose();
            }}
            className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
          >
            Create Branch
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function BranchesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const costComparisonData = useMemo(() => {
    return BRANCHES.map(b => ({
      name: b.name,
      material: 45000 + (Math.random() * 20000),
      labour: 30000 + (Math.random() * 10000),
      overhead: 15000 + (Math.random() * 5000),
      waste: 2000 + (Math.random() * 3000)
    }));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Branch Management</h1>
          <p className="text-gray-500 font-medium">Monitor and compare performance across all bakery locations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95"
        >
          <Plus size={20} />
          NEW BRANCH
        </button>
      </header>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {BRANCHES.map(branch => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </div>

      {/* Cost Comparison Table */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-3">
            <BarChart3 size={24} className="text-amber-600" />
            Branch Cost Comparison (MTD)
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
            <TrendingUp size={14} className="text-amber-600" />
            Real-time financial variance
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-200">
                <th className="px-6 py-4 font-bold">Branch Name</th>
                <th className="px-6 py-4 font-bold text-right">Material Cost</th>
                <th className="px-6 py-4 font-bold text-right">Labour Cost</th>
                <th className="px-6 py-4 font-bold text-right">Overheads</th>
                <th className="px-6 py-4 font-bold text-right">Waste Impact</th>
                <th className="px-6 py-4 font-bold text-right">Total MTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {costComparisonData.map((data, idx) => {
                const total = data.material + data.labour + data.overhead + data.waste;
                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{data.name}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-600">{formatCurrency(data.material)}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-600">{formatCurrency(data.labour)}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-600">{formatCurrency(data.overhead)}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">{formatCurrency(data.waste)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-black text-sm border border-amber-100">
                        {formatCurrency(total)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-black text-gray-900">
                <td className="px-6 py-4 uppercase text-xs">Network Totals</td>
                <td className="px-6 py-4 text-right">{formatCurrency(costComparisonData.reduce((a, b) => a + b.material, 0))}</td>
                <td className="px-6 py-4 text-right">{formatCurrency(costComparisonData.reduce((a, b) => a + b.labour, 0))}</td>
                <td className="px-6 py-4 text-right">{formatCurrency(costComparisonData.reduce((a, b) => a + b.overhead, 0))}</td>
                <td className="px-6 py-4 text-right text-red-600">{formatCurrency(costComparisonData.reduce((a, b) => a + b.waste, 0))}</td>
                <td className="px-6 py-4 text-right text-amber-600">
                  {formatCurrency(costComparisonData.reduce((a, b) => a + b.material + b.labour + b.overhead + b.waste, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <NewBranchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
