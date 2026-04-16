import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Package, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Layers,
  User,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useData } from '../contexts/DataContext';

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

const SKUCard = ({ sku, recipes, branches }: { sku: any, recipes: any[], branches: any[], key?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const recipe = (recipes || []).find(r => r.id === sku.recipeId);
  const branch = (branches || []).find(b => b.id === sku.branchId);
  
  const margin = ((sku.sellingPrice - sku.standardCost) / sku.sellingPrice) * 100;
  const marginColor = margin > 30 ? 'green' : margin >= 15 ? 'amber' : 'red';

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-4">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
            <Package size={20} />
          </div>
          <div className="grid grid-cols-4 flex-1 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">SKU ID</p>
              <p className="font-mono text-sm">{sku.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Name</p>
              <p className="font-medium text-gray-900">{sku.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Recipe</p>
              <Link 
                to={`/recipes?search=${recipe?.name}`}
                className="text-sm font-bold text-amber-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {recipe?.name || 'Unknown'}
              </Link>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Client</p>
              <p className="text-sm text-gray-600">{sku.clientName}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 px-6 border-l border-gray-100 ml-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Std Cost</p>
            <p className="font-medium text-gray-900">{formatCurrency(sku.standardCost)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Selling</p>
            <p className="font-medium text-gray-900">{formatCurrency(sku.sellingPrice)}</p>
          </div>
          <div className="text-right w-24">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Margin</p>
            <Badge color={marginColor}>{margin.toFixed(1)}%</Badge>
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
              {/* Cost Breakdown */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={16} className="text-amber-600" />
                  Unit Cost Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Material Cost</span>
                    <span className="font-medium">{formatCurrency(sku.standardCost * 0.65)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Labour Cost</span>
                    <span className="font-medium">{formatCurrency(sku.standardCost * 0.20)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overhead</span>
                    <span className="font-medium">{formatCurrency(sku.standardCost * 0.10)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Packaging</span>
                    <span className="font-medium">{formatCurrency(sku.standardCost * 0.05)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between font-bold">
                    <span>Total Standard Cost</span>
                    <span className="text-amber-600">{formatCurrency(sku.standardCost)}</span>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers size={16} className="text-amber-600" />
                  Configuration Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipe Version</span>
                    <span className="font-medium">{recipe?.version || '1.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pack Config</span>
                    <span className="font-medium">{sku.packagingConfig} units per pack</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packaging ID</span>
                    <span className="font-medium">{sku.packagingMaterialId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Branch</span>
                    <span className="font-medium">{branch?.name}</span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-600" />
                  Profitability
                </h4>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(sku.sellingPrice - sku.standardCost)}</span>
                    <span className="text-xs text-gray-500 mb-1">Gross Profit / Unit</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${margin > 30 ? 'bg-green-500' : margin >= 15 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(margin, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    {margin > 30 ? 'High margin product. Excellent performance.' : 
                     margin >= 15 ? 'Standard margin. Monitor cost fluctuations.' : 
                     'Low margin. Review pricing or production efficiency.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NewSKUModal = ({ isOpen, onClose, recipes, branches }: { isOpen: boolean, onClose: () => void, recipes: any[], branches: any[] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-600 text-white">
          <h3 className="text-xl font-bold">Create New SKU</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <ChevronDown className="rotate-90" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">SKU Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. White Loaf x1 Retail" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Recipe</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
              {(recipes || []).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Client Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. Checkers Hyper" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Branch</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
              {(branches || []).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Qty Per Pack</label>
            <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" defaultValue={1} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Packaging Material</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. pkg-01" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Standard Cost (R)</label>
            <input type="number" step="0.01" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Selling Price (R)</label>
            <input type="number" step="0.01" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0.00" />
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={() => {
              toast.success('New SKU created! (Mock)');
              onClose();
            }}
            className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
          >
            Create SKU
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function SKUsPage() {
  const { 
    skus: SKUS, 
    recipes: RECIPES, 
    branches: BRANCHES, 
    loading,
    saveItem
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSKUs = useMemo(() => {
    return (SKUS || []).filter(sku => 
      sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-amber-honey border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">SKU MANAGEMENT</h1>
          <p className="text-gray-500 font-medium">Finished goods, packaging configurations and margins</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95"
        >
          <Plus size={20} />
          NEW SKU
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total SKUs</p>
          <p className="text-3xl font-black text-gray-900">{(SKUS || []).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Margin</p>
          <p className="text-3xl font-black text-green-600">28.4%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Low Margin Alerts</p>
          <p className="text-3xl font-black text-red-600">2</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Clients</p>
          <p className="text-3xl font-black text-amber-600">12</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by SKU ID, Name or Client..." 
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
            <Layers size={18} />
            RECIPES
          </button>
        </div>
      </div>

      {/* SKU List */}
      <div className="space-y-4">
        {filteredSKUs.map(sku => (
          <SKUCard key={sku.id} sku={sku} recipes={RECIPES} branches={BRANCHES} />
        ))}
        
        {filteredSKUs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No SKUs found matching your search.</p>
          </div>
        )}
      </div>

      <NewSKUModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipes={RECIPES} branches={BRANCHES} />
    </div>
  );
}
