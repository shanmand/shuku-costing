import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SUPPLIERS, 
  INGREDIENT_BATCHES, 
  INGREDIENTS,
  INGREDIENT_CATEGORIES,
  QC_CHECKS
} from '../data/entities';

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

const NewSupplierModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-600 text-white">
          <h3 className="text-xl font-bold">Add New Supplier</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <ChevronDown className="rotate-90" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Supplier Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Company Ltd" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contact Person</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="John Doe" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="john@company.com" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
            <input type="tel" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="+27 12 345 6789" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment Terms</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="COD">COD</option>
              <option value="7 Days">7 Days</option>
              <option value="14 Days">14 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="60 Days">60 Days</option>
            </select>
          </div>
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ingredient Categories Supplied</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {INGREDIENT_CATEGORIES.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer hover:text-amber-600">
                  <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200">Add Supplier</button>
        </div>
      </motion.div>
    </div>
  );
};

const SupplierRow = ({ supplier }: { supplier: typeof SUPPLIERS[0], key?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate performance metric
  const supplierBatches = INGREDIENT_BATCHES.filter(b => b.supplierId === supplier.id);
  const supplierBatchIds = supplierBatches.map(b => b.id);
  const supplierQCs = QC_CHECKS.filter(qc => supplierBatchIds.includes(qc.batchId));
  const passCount = supplierQCs.filter(qc => qc.status === 'Pass').length;
  const performance = supplierQCs.length > 0 ? (passCount / supplierQCs.length) * 100 : 100;

  return (
    <>
      <tr 
        className={`hover:bg-gray-50 transition-colors cursor-pointer ${isExpanded ? 'bg-amber-50/30' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="font-bold text-gray-900 block">{supplier.name}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{supplier.paymentTerms}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col text-sm">
            <span className="font-bold text-gray-700">{supplier.contactPerson}</span>
            <span className="text-gray-400 flex items-center gap-1"><Mail size={12} /> {supplier.email}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Phone size={12} className="text-amber-500" />
            {supplier.phone}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
              <span>QC Pass Rate</span>
              <span className={performance >= 90 ? 'text-green-600' : performance >= 75 ? 'text-amber-600' : 'text-red-600'}>
                {performance.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${performance}%` }}
                className={`h-full ${performance >= 90 ? 'bg-green-500' : performance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
              />
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <Badge color={supplier.isActive ? 'green' : 'gray'}>
            {supplier.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </td>
        <td className="px-6 py-4 text-right">
          {isExpanded ? <ChevronUp className="inline text-gray-400" /> : <ChevronDown className="inline text-gray-400" />}
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={6} className="px-6 py-0 border-none">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-gray-50/50 rounded-b-2xl border-x border-b border-gray-100"
              >
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Categories Supplied */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Package size={14} className="text-amber-600" />
                      Categories Supplied
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {INGREDIENT_CATEGORIES.slice(0, 3).map(cat => (
                        <span key={cat.id} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Batches Received */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} className="text-amber-600" />
                      Recent Batches Received
                    </h4>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-400 uppercase font-bold">
                          <tr>
                            <th className="px-4 py-2">Batch #</th>
                            <th className="px-4 py-2">Ingredient</th>
                            <th className="px-4 py-2">Received</th>
                            <th className="px-4 py-2">Qty</th>
                            <th className="px-4 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {supplierBatches.slice(0, 5).map(batch => {
                            const ingredient = INGREDIENTS.find(i => i.id === batch.ingredientId);
                            return (
                              <tr key={batch.id}>
                                <td className="px-4 py-2 font-mono font-bold text-gray-500">{batch.batchNumber}</td>
                                <td className="px-4 py-2 font-bold text-gray-900">{ingredient?.name}</td>
                                <td className="px-4 py-2 text-gray-500">{batch.receivedDate}</td>
                                <td className="px-4 py-2 font-bold text-gray-900">{batch.quantity} {ingredient?.unit}</td>
                                <td className="px-4 py-2">
                                  <Badge color={batch.status === 'Available' ? 'green' : 'amber'}>{batch.status}</Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Main Page ---

export default function SuppliersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Supplier Management</h1>
          <p className="text-gray-500 font-medium">Manage raw material vendors and performance metrics</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95"
        >
          <Plus size={20} />
          ADD SUPPLIER
        </button>
      </header>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by Supplier Name, Contact or Email..." 
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

      {/* Suppliers Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-200">
              <th className="px-6 py-4 font-bold">Supplier</th>
              <th className="px-6 py-4 font-bold">Contact Person</th>
              <th className="px-6 py-4 font-bold">Phone</th>
              <th className="px-6 py-4 font-bold w-48">Performance</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SUPPLIERS.map((supplier) => (
              <SupplierRow key={supplier.id} supplier={supplier} />
            ))}
          </tbody>
        </table>
      </div>

      <NewSupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
