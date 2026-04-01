import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  History, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Tag,
  Truck,
  ShieldCheck,
  PackageCheck,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  INGREDIENTS, 
  INGREDIENT_CATEGORIES, 
  SUPPLIERS, 
  INGREDIENT_BATCHES, 
  MATERIAL_PRICE_HISTORY,
  BRANCHES,
  PRODUCTION_BATCHES,
  QC_CHECKS,
  EMPLOYEES
} from '../data/entities';

import { toast } from 'sonner';

// --- Helpers ---

const formatCurrency = (value: number) => {
  return 'R' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace(/,/g, ' ');
};

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

const PriceHistoryChart = ({ ingredientId }: { ingredientId: string }) => {
  const history = MATERIAL_PRICE_HISTORY
    .filter(h => h.ingredientId === ingredientId)
    .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

  if (history.length === 0) return <div className="p-10 text-center text-gray-400">No price history available.</div>;

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="effectiveDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={(val) => new Date(val).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={(val) => `R${val}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            labelFormatter={(val) => new Date(val).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
          />
          <Area type="monotone" dataKey="unitCost" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const IngredientRow = ({ ingredient }: { ingredient: any, key?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const category = INGREDIENT_CATEGORIES.find(c => c.id === ingredient.categoryId);
  const supplier = SUPPLIERS.find(s => s.id === ingredient.supplierId);
  
  const stockRatio = ingredient.currentStock / ingredient.reorderLevel;
  const stockStatus = stockRatio > 1.5 ? 'green' : stockRatio >= 1 ? 'amber' : 'red';

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-3">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
            <FlaskConical size={20} />
          </div>
          <div className="grid grid-cols-4 flex-1 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Name</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{ingredient.name}</p>
                {ingredient.isAllergen && <Badge color="red">Allergen</Badge>}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Category</p>
              <p className="text-sm text-gray-600">{category?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Supplier</p>
              <p className="text-sm text-gray-600">{supplier?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Stock Level</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">{ingredient.currentStock} {ingredient.unit}</p>
                <div className={`w-2 h-2 rounded-full bg-${stockStatus === 'green' ? 'green' : stockStatus === 'amber' ? 'amber' : 'red'}-500`}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 px-6 border-l border-gray-100 ml-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Std Cost</p>
            <p className="font-medium text-gray-900">{formatCurrency(ingredient.standardCost)} / {ingredient.unit}</p>
          </div>
          <div className="text-gray-400">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-600" />
                  Price History
                </h4>
                <PriceHistoryChart ingredientId={ingredient.id} />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Info size={16} className="text-amber-600" />
                  Inventory Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-bold">Reorder Level</p>
                    <p className="text-lg font-bold">{ingredient.reorderLevel} {ingredient.unit}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-bold">Allergen Type</p>
                    <p className="text-lg font-bold text-red-600">{ingredient.allergenType || 'None'}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2">Supplier Info</p>
                  <p className="text-sm font-medium">{supplier?.name}</p>
                  <p className="text-xs text-gray-500">{supplier?.address}</p>
                  <p className="text-xs text-gray-500 mt-1">Terms: {supplier?.paymentTerms}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BatchRow = ({ batch }: { batch: any, key?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ingredient = INGREDIENTS.find(i => i.id === batch.ingredientId);
  const supplier = SUPPLIERS.find(s => s.id === batch.supplierId);
  const branch = BRANCHES.find(b => b.id === batch.branchId);
  
  const expiryDate = new Date(batch.expiryDate);
  const today = new Date();
  const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const expiryStatus = daysToExpiry < 0 ? 'red' : daysToExpiry <= 30 ? 'amber' : 'green';

  const usedInBatches = PRODUCTION_BATCHES.filter(pb => 
    pb.stageHistory.some(sh => sh.user === 'emp-01') // Mocking traceability for demo
  ).slice(0, 3);

  const linkedQCChecks = QC_CHECKS.filter(qc => qc.ingredientBatchId === batch.id);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-3">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Tag size={20} />
          </div>
          <div className="grid grid-cols-5 flex-1 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Batch #</p>
              <p className="font-mono text-sm font-bold">{batch.batchNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Ingredient</p>
              <p className="text-sm font-medium text-gray-900">{ingredient?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Qty</p>
              <p className="text-sm font-bold">{batch.quantity} {ingredient?.unit}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Expiry</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{batch.expiryDate}</p>
                <div className={`w-2 h-2 rounded-full bg-${expiryStatus === 'green' ? 'green' : expiryStatus === 'amber' ? 'amber' : 'red'}-500`}></div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</p>
              <Badge color={batch.status === 'Available' ? 'green' : 'gray'}>{batch.status}</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 px-6 border-l border-gray-100 ml-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Unit Cost</p>
            <p className="font-medium text-gray-900">{formatCurrency(batch.unitCost)}</p>
          </div>
          <div className="text-gray-400">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Traceability */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ArrowRightLeft size={16} className="text-blue-600" />
                  Traceability (Used in)
                </h4>
                <div className="space-y-2">
                  {usedInBatches.map(pb => (
                    <div key={pb.id} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded border border-gray-100">
                      <span className="font-mono font-bold">{pb.id}</span>
                      <span className="text-gray-500">{pb.currentStage}</span>
                      <Badge color="blue">View</Badge>
                    </div>
                  ))}
                  {usedInBatches.length === 0 && <p className="text-xs text-gray-400 italic">No usage recorded yet.</p>}
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  Compliance & Certs
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cert #</span>
                    <span className="font-mono font-bold">{batch.certificationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Received</span>
                    <span className="font-medium">{batch.receivedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Branch</span>
                    <span className="font-medium">{branch?.name}</span>
                  </div>
                </div>
              </div>

              {/* Supplier */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Truck size={16} className="text-blue-600" />
                  Supplier Details
                </h4>
                <div className="space-y-1">
                  <p className="text-sm font-bold">{supplier?.name}</p>
                  <p className="text-xs text-gray-500">{supplier?.contactPerson}</p>
                  <p className="text-xs text-gray-500">{supplier?.email}</p>
                  <p className="text-xs text-gray-500">{supplier?.phone}</p>
                </div>
              </div>

              {/* QC Checks */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 md:col-span-3">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FlaskConical size={16} className="text-blue-600" />
                  Quality Control Checks
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {linkedQCChecks.length > 0 ? linkedQCChecks.map(qc => (
                    <div key={qc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase text-gray-400">{qc.checkType}</span>
                        <Badge color={qc.result === 'Pass' ? 'green' : 'red'}>{qc.result}</Badge>
                      </div>
                      <p className="text-xs font-medium text-gray-700">{qc.notes}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{qc.checkDate} • {EMPLOYEES.find(e => e.id === qc.checkedBy)?.name}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic">No QC checks recorded for this batch.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReceiveBatchModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
          <h3 className="text-xl font-bold">Receive Ingredient Batch</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <ChevronDown className="rotate-90" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Ingredient</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {INGREDIENTS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Batch Number</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. SAS-FL-999" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Supplier</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Branch</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Quantity Received</label>
            <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Unit Cost (R)</label>
            <input type="number" step="0.01" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Cert / COA Number</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={() => {
              toast.success('Batch received successfully (Mock)');
              onClose();
            }}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Receive Batch
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function IngredientsPage() {
  const [activeTab, setActiveTab] = useState<'master' | 'tracking'>('master');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const filteredBatches = useMemo(() => {
    return INGREDIENT_BATCHES.filter(b => {
      const ingredient = INGREDIENTS.find(i => i.id === b.ingredientId);
      return b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
             ingredient?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Ingredients & Inventory</h1>
          <p className="text-gray-500 font-medium">Manage raw materials, batch traceability and stock levels</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
            activeTab === 'master' 
              ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
          }`}
        >
          <Plus size={20} />
          {activeTab === 'master' ? 'ADD INGREDIENT' : 'RECEIVE BATCH'}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => { setActiveTab('master'); setSearchTerm(''); }}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'master' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FlaskConical size={18} />
          INGREDIENTS MASTER
        </button>
        <button 
          onClick={() => { setActiveTab('tracking'); setSearchTerm(''); }}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'tracking' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <History size={18} />
          BATCH TRACKING
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder={activeTab === 'master' ? "Search ingredients..." : "Search batch # or ingredient..."}
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
          <button className="px-4 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <Truck size={18} />
            SUPPLIERS
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'master' ? (
          filteredIngredients.map(ing => (
            <IngredientRow key={ing.id} ingredient={ing} />
          ))
        ) : (
          filteredBatches.map(batch => (
            <BatchRow key={batch.id} batch={batch} />
          ))
        )}
        
        {((activeTab === 'master' && filteredIngredients.length === 0) || 
          (activeTab === 'tracking' && filteredBatches.length === 0)) && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <FlaskConical size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No items found matching your search.</p>
          </div>
        )}
      </div>

      <ReceiveBatchModal isOpen={isModalOpen && activeTab === 'tracking'} onClose={() => setIsModalOpen(false)} />
      <AddIngredientModal isOpen={isModalOpen && activeTab === 'master'} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

const AddIngredientModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-600 text-white">
          <h3 className="text-xl font-bold">Add New Ingredient</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Ingredient Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. Bread Flour" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white">
              {INGREDIENT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Standard Cost (R)</label>
            <input type="number" step="0.01" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Unit</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white">
              <option value="kg">kg</option>
              <option value="L">L</option>
              <option value="pcs">pcs</option>
              <option value="g">g</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Reorder Level</label>
            <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Supplier</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white">
              {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="isAllergen" className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
            <label htmlFor="isAllergen" className="text-sm font-medium text-gray-700">This is an allergen ingredient</label>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={() => {
              toast.success('Ingredient added successfully (Mock)');
              onClose();
            }}
            className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
          >
            Save Ingredient
          </button>
        </div>
      </motion.div>
    </div>
  );
};
