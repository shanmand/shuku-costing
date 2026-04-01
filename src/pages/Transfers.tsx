import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  BRANCH_TRANSFERS, 
  INGREDIENTS, 
  INGREDIENT_BATCHES, 
  BRANCHES,
  SUPPLIERS
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
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    charcoal: 'bg-gray-800 text-white border-gray-900',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

const NewTransferModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  
  const availableBatches = useMemo(() => {
    if (!selectedIngredient || !selectedBranch) return [];
    return (INGREDIENT_BATCHES || []).filter(b => 
      b.ingredientId === selectedIngredient && b.branchId === selectedBranch
    );
  }, [selectedIngredient, selectedBranch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-600 text-white">
          <h3 className="text-xl font-bold">New Branch Transfer</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <ChevronDown className="rotate-90" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">From Branch</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Select Source...</option>
              {(BRANCHES || []).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">To Branch</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="">Select Destination...</option>
              {(BRANCHES || []).map(b => b.id !== selectedBranch && <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ingredient</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
            >
              <option value="">Select Ingredient...</option>
              {(INGREDIENTS || []).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Batch Number</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="">Select Batch...</option>
              {(availableBatches || []).map(b => <option key={b.id} value={b.id}>{b.batchNumber} ({b.quantity} remaining)</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quantity to Transfer</label>
            <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transfer Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
        </div>

        {/* Inventory Impact Preview */}
        <div className="mx-6 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertCircle size={14} />
            Inventory Impact Preview
          </h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Source Branch</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Current Stock</span>
                <span className="font-bold">500 kg</span>
              </div>
              <div className="flex justify-between items-center text-sm text-red-600">
                <span>Adjustment</span>
                <span className="font-bold">-100 kg</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Destination Branch</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Current Stock</span>
                <span className="font-bold">20 kg</span>
              </div>
              <div className="flex justify-between items-center text-sm text-green-600">
                <span>Adjustment</span>
                <span className="font-bold">+100 kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={() => {
              toast.success('Transfer initiated! (Mock)');
              onClose();
            }}
            className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
          >
            Initiate Transfer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function TransfersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransfers = useMemo(() => {
    return (BRANCH_TRANSFERS || []).filter(t => 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'amber';
      case 'approved': return 'green';
      case 'in transit': return 'blue';
      case 'received': return 'charcoal';
      default: return 'gray';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Branch Transfers</h1>
          <p className="text-gray-500 font-medium">Manage stock movement between bakery locations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95"
        >
          <Plus size={20} />
          NEW TRANSFER
        </button>
      </header>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by Transfer ID, Ingredient or Batch..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <Filter size={18} />
            FILTERS
          </button>
        </div>
      </div>

      {/* Transfers Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-200">
              <th className="px-6 py-4 font-bold">Transfer ID</th>
              <th className="px-6 py-4 font-bold">Ingredient / Batch</th>
              <th className="px-6 py-4 font-bold">Route</th>
              <th className="px-6 py-4 font-bold text-right">Qty</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Approved By</th>
              <th className="px-6 py-4 font-bold text-right">Cost</th>
              <th className="px-6 py-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
            <tbody className="divide-y divide-gray-100">
              {(filteredTransfers || []).map((tr) => {
                const ingredient = (INGREDIENTS || []).find(i => i.id === tr.ingredientId);
                const batch = (INGREDIENT_BATCHES || []).find(b => b.id === tr.batchId);
                const fromBranch = (BRANCHES || []).find(b => b.id === tr.fromBranchId);
                const toBranch = (BRANCHES || []).find(b => b.id === tr.toBranchId);

              return (
                <tr key={tr.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400">{tr.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{ingredient?.name}</span>
                      <Link 
                        to={`/ingredients?tab=tracking&search=${batch?.batchNumber}`}
                        className="text-[10px] font-mono text-amber-600 hover:underline font-bold"
                      >
                        {batch?.batchNumber}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-gray-600">{fromBranch?.name.split('(')[0]}</span>
                      <ArrowRight size={12} className="text-amber-500" />
                      <span className="font-medium text-gray-900">{toBranch?.name.split('(')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    {tr.quantity} {ingredient?.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{tr.transferDate}</td>
                  <td className="px-6 py-4">
                    <Badge color={getStatusColor(tr.status)}>{tr.status.toUpperCase()}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User size={12} />
                      {tr.approvedBy || '---'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(tr.cost)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {tr.status === 'Pending' && (
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      {tr.status === 'In Transit' && (
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Receive">
                          <PackageCheck size={18} />
                        </button>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors">
                        <Clock size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <NewTransferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
