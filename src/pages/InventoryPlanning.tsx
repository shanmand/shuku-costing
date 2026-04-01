import React, { useMemo, useState } from 'react';
import { 
  CalendarDays, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Search, 
  Filter, 
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PRODUCTION_BATCHES, 
  RECIPES, 
  INGREDIENTS, 
  INGREDIENT_BATCHES, 
  BRANCHES 
} from '../data/entities';

// --- Types ---

interface IngredientRequirement {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  requiredQty: number;
  availableQty: number;
  shortage: number;
  coveragePercent: number;
  batches: string[]; // IDs of batches requiring this
}

// --- Components ---

const ShortageBadge = ({ percent }: { percent: number }) => {
  if (percent >= 100) return <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase tracking-widest">Sufficient</span>;
  if (percent >= 50) return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded uppercase tracking-widest">Low Stock</span>;
  return <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded uppercase tracking-widest">Critical</span>;
};

const CoverageBar = ({ percent }: { percent: number }) => {
  const colorClass = percent >= 100 ? 'bg-green-500' : percent >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${colorClass} transition-all duration-500`} 
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
};

// --- Main Page ---

export default function InventoryPlanning() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // 1. Calculate Requirements
  const requirements = useMemo(() => {
    const activeBatches = (PRODUCTION_BATCHES || []).filter(b => 
      (b.status === 'Planned' || b.status === 'In Progress') &&
      (selectedBranch === 'all' || b.branchId === selectedBranch)
    );

    const reqMap: Record<string, IngredientRequirement> = {};

    activeBatches.forEach(batch => {
      const recipe = (RECIPES || []).find(r => r.id === batch.recipeId);
      if (!recipe) return;

      (recipe.stages || []).forEach(stage => {
        (stage.ingredients || []).forEach(ing => {
          if (!reqMap[ing.ingredientId]) {
            const ingredient = (INGREDIENTS || []).find(i => i.id === ing.ingredientId);
            reqMap[ing.ingredientId] = {
              ingredientId: ing.ingredientId,
              ingredientName: ingredient?.name || 'Unknown',
              unit: ingredient?.unit || '',
              requiredQty: 0,
              availableQty: 0,
              shortage: 0,
              coveragePercent: 0,
              batches: []
            };
          }
          
          // Scale by planned qty (assuming recipe yield is 1 for simplicity in mock)
          const scaledQty = (ing.quantity || 0) * batch.plannedQty;
          reqMap[ing.ingredientId].requiredQty += scaledQty;
          if (!(reqMap[ing.ingredientId].batches || []).includes(batch.id)) {
            reqMap[ing.ingredientId].batches.push(batch.id);
          }
        });
      });
    });

    // 2. Add Available Stock
    Object.keys(reqMap).forEach(ingId => {
      const stock = (INGREDIENT_BATCHES || [])
        .filter(ib => ib.ingredientId === ingId && (selectedBranch === 'all' || ib.branchId === selectedBranch))
        .reduce((sum, curr) => sum + curr.currentQty, 0);
      
      reqMap[ingId].availableQty = stock;
      reqMap[ingId].shortage = Math.max(0, reqMap[ingId].requiredQty - stock);
      reqMap[ingId].coveragePercent = (stock / reqMap[ingId].requiredQty) * 100;
    });

    return Object.values(reqMap)
      .filter(r => r.ingredientName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.coveragePercent - b.coveragePercent); // Most critical first
  }, [searchTerm, selectedBranch]);

  const exportToCSV = () => {
    const headers = ['Ingredient', 'Required', 'Available', 'Shortage', 'Unit', 'Coverage %'];
    const rows = requirements.map(r => [
      r.ingredientName,
      r.requiredQty.toFixed(2),
      r.availableQty.toFixed(2),
      r.shortage.toFixed(2),
      r.unit,
      r.coveragePercent.toFixed(1)
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_shortages_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight uppercase">Inventory Planning</h1>
          <p className="text-charcoal/50 font-medium">Ingredient requirements for planned & active production</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-charcoal text-warm-cream rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-charcoal/90 transition-all"
          >
            <Download size={16} />
            Export Shortages
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={20} />
          <input 
            type="text" 
            placeholder="Search ingredients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20 transition-all font-medium"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={20} />
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20 appearance-none font-bold text-xs uppercase tracking-widest"
          >
            <option value="all">All Branches</option>
            {(BRANCHES || []).map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm">
          <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Critical Shortages</p>
          <h3 className="text-3xl font-black text-red-600">{requirements.filter(r => r.coveragePercent < 50).length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm">
          <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Active Batches Tracked</p>
          <h3 className="text-3xl font-black text-charcoal">
            {(PRODUCTION_BATCHES || []).filter(b => (b.status === 'Planned' || b.status === 'In Progress') && (selectedBranch === 'all' || b.branchId === selectedBranch)).length}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm">
          <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Total Ingredients Needed</p>
          <h3 className="text-3xl font-black text-amber-honey">{requirements.length}</h3>
        </div>
      </div>

      {/* Requirements Table */}
      <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
              <th className="px-8 py-5">Ingredient</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Required</th>
              <th className="px-8 py-5 text-right">Available</th>
              <th className="px-8 py-5 text-right text-red-600">Deficit</th>
              <th className="px-8 py-5 w-48">Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {requirements.map((req) => (
              <tr key={req.ingredientId} className="hover:bg-secondary-cream/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-cream flex items-center justify-center text-charcoal/40">
                      <FlaskConical size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-charcoal text-sm">{req.ingredientName}</p>
                      <p className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest mt-0.5">
                        {req.batches.length} Batches
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <ShortageBadge percent={req.coveragePercent} />
                </td>
                <td className="px-8 py-6 text-right font-bold text-charcoal text-sm">
                  {req.requiredQty.toLocaleString()} <span className="text-[10px] text-charcoal/40">{req.unit}</span>
                </td>
                <td className="px-8 py-6 text-right font-bold text-charcoal text-sm">
                  {req.availableQty.toLocaleString()} <span className="text-[10px] text-charcoal/40">{req.unit}</span>
                </td>
                <td className="px-8 py-6 text-right font-black text-red-600 text-sm">
                  {req.shortage > 0 ? `-${req.shortage.toLocaleString()}` : '0'}
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-charcoal/40 uppercase tracking-widest">
                      <span>{Math.min(Math.round(req.coveragePercent), 100)}%</span>
                      {req.coveragePercent < 100 && <span className="text-red-500">Short</span>}
                    </div>
                    <CoverageBar percent={req.coveragePercent} />
                  </div>
                </td>
              </tr>
            ))}
            {requirements.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-secondary-cream rounded-full flex items-center justify-center text-charcoal/20">
                      <Package size={32} />
                    </div>
                    <div>
                      <p className="text-charcoal font-bold">No requirements found</p>
                      <p className="text-charcoal/40 text-sm">Try adjusting your filters or search term</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Batches Legend */}
      <div className="bg-secondary-cream/50 p-6 rounded-2xl border border-charcoal/5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-honey shadow-sm">
          <Info size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-charcoal uppercase tracking-tight mb-1">Planning Logic</h4>
          <p className="text-xs text-charcoal/50 leading-relaxed max-w-2xl">
            This view aggregates ingredient needs from all <span className="font-bold text-charcoal">Planned</span> and <span className="font-bold text-charcoal">In Progress</span> batches. 
            Quantities are scaled based on the recipe BOM and planned batch output. Available stock is calculated from active ingredient batches in the selected branch.
          </p>
        </div>
      </div>
    </div>
  );
}
