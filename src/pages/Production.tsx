import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  Users, 
  Factory, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Save, 
  TrendingUp, 
  DollarSign, 
  Trash2,
  Package as PackageIcon,
  Truck,
  FileText,
  FlaskConical
} from 'lucide-react';
import { 
  PRODUCTION_BATCHES, 
  RECIPES, 
  BRANCHES, 
  CREWS, 
  EMPLOYEES, 
  EMPLOYEE_RATE_HISTORY, 
  INGREDIENTS, 
  MATERIAL_PRICE_HISTORY,
  SKUS,
  QC_CHECKS
} from '../data/entities';

import { toast } from 'sonner';

// --- Constants ---

const STAGES = [
  { name: 'Stores', purpose: 'Raw material issue' },
  { name: 'Staging', purpose: 'Pre-weigh ingredients' },
  { name: 'Mixing', purpose: 'Combine ingredients' },
  { name: 'Weighing & Dividing', purpose: 'Portioning' },
  { name: 'Proving', purpose: 'Fermentation' },
  { name: 'Baking', purpose: 'Heat transformation' },
  { name: 'Cooling', purpose: 'Stabilisation' },
  { name: 'Toppings', purpose: 'Value-add' },
  { name: 'Packaging', purpose: 'SKU creation' },
  { name: 'Storage', purpose: 'FG holding' },
  { name: 'Distribution', purpose: 'Dispatch' }
];

// --- Helpers ---

const formatCurrency = (value: number) => {
  return 'R' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace(/,/g, ' ');
};

const getEmployeeRate = (employeeId: string, date: string) => {
  const history = EMPLOYEE_RATE_HISTORY
    .filter(h => h.employeeId === employeeId && new Date(h.effectiveDate) <= new Date(date))
    .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  
  return history[0] || { standardRate: 0, overtimeRate: 0, effectiveDate: 'N/A' };
};

const getMaterialPrice = (ingredientId: string, date: string) => {
  const history = MATERIAL_PRICE_HISTORY
    .filter(h => h.ingredientId === ingredientId && new Date(h.effectiveDate) <= new Date(date))
    .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  
  const ingredient = INGREDIENTS.find(i => i.id === ingredientId);
  return {
    price: history[0]?.unitCost || ingredient?.standardCost || 0,
    effectiveDate: history[0]?.effectiveDate || 'Standard',
    standardCost: ingredient?.standardCost || 0
  };
};

// --- Components ---

const Production = () => {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [filters, setFilters] = useState({ branch: '', crew: '', stage: '', status: '' });

  const selectedBatch = useMemo(() => {
    return PRODUCTION_BATCHES.find(b => b.id === selectedBatchId) || null;
  }, [selectedBatchId]);

  const linkedQCChecks = useMemo(() => {
    if (!selectedBatch) return [];
    return QC_CHECKS.filter(qc => qc.productionBatchId === selectedBatch.id);
  }, [selectedBatch]);

  const filteredBatches = useMemo(() => {
    return PRODUCTION_BATCHES.filter(b => {
      return (!filters.branch || b.branchId === filters.branch) &&
             (!filters.crew || b.crewId === filters.crew) &&
             (!filters.stage || b.currentStage === filters.stage) &&
             (!filters.status || b.status === filters.status);
    });
  }, [filters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Production Management</h2>
          <p className="text-charcoal/60 text-sm">Track batches across the manufacturing lifecycle.</p>
        </div>
        <button 
          onClick={() => setIsNewBatchModalOpen(true)}
          className="bg-amber-honey text-charcoal px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-600 transition-colors shadow-sm"
        >
          <Plus size={20} />
          New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Batch List */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-charcoal/5 shadow-sm flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-charcoal/40">
              <Filter size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
            </div>
            <select 
              className="bg-secondary-cream/50 border-none rounded-md px-3 py-1.5 text-xs font-medium outline-none"
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            >
              <option value="">All Branches</option>
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select 
              className="bg-secondary-cream/50 border-none rounded-md px-3 py-1.5 text-xs font-medium outline-none"
              value={filters.crew}
              onChange={(e) => setFilters({ ...filters, crew: e.target.value })}
            >
              <option value="">All Crews</option>
              {CREWS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select 
              className="bg-secondary-cream/50 border-none rounded-md px-3 py-1.5 text-xs font-medium outline-none"
              value={filters.stage}
              onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
            >
              <option value="">All Stages</option>
              {STAGES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
            <select 
              className="bg-secondary-cream/50 border-none rounded-md px-3 py-1.5 text-xs font-medium outline-none"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Batch Table */}
          <div className="bg-white rounded-xl border border-charcoal/5 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary-cream/30 text-charcoal/40 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Batch ID</th>
                  <th className="px-6 py-4">Recipe</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Planned Qty</th>
                  <th className="px-6 py-4">Current Stage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {filteredBatches.map((batch) => (
                  <tr 
                    key={batch.id} 
                    className={`hover:bg-warm-cream transition-colors cursor-pointer ${selectedBatchId === batch.id ? 'bg-secondary-cream/50' : ''}`}
                    onClick={() => setSelectedBatchId(batch.id)}
                  >
                    <td className="px-6 py-4 font-bold text-charcoal">{batch.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{RECIPES.find(r => r.id === batch.recipeId)?.name}</span>
                        <span className="text-[10px] text-charcoal/40">{CREWS.find(c => c.id === batch.crewId)?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-charcoal/60">
                      {BRANCHES.find(b => b.id === batch.branchId)?.name.split('(')[0]}
                    </td>
                    <td className="px-6 py-4 font-mono">{batch.plannedQty}</td>
                    <td className="px-6 py-4">
                      <span className="bg-charcoal/5 px-2 py-1 rounded text-[10px] font-bold text-charcoal/60 uppercase">
                        {batch.currentStage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight size={18} className="inline text-charcoal/20" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Batch Detail */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          {selectedBatch ? (
            <div className="bg-white rounded-xl border border-charcoal/5 shadow-lg overflow-hidden sticky top-24">
              <div className="p-6 bg-charcoal text-warm-cream">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">Batch {selectedBatch.id}</h3>
                    <p className="text-warm-cream/40 text-xs mt-1">
                      Started {new Date(selectedBatch.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={selectedBatch.status} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-6 border-b border-charcoal/5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] uppercase font-bold text-charcoal/40 tracking-widest">Production Progress</h4>
                  <span className="text-xs font-bold text-amber-honey">
                    {Math.round(((STAGES.findIndex(s => s.name === selectedBatch.currentStage) + 1) / STAGES.length) * 100)}%
                  </span>
                </div>
                <div className="flex gap-1 h-2">
                  {STAGES.map((stage, idx) => {
                    const currentIdx = STAGES.findIndex(s => s.name === selectedBatch.currentStage);
                    return (
                      <div 
                        key={stage.name}
                        className={`flex-1 rounded-full transition-all duration-500 ${idx <= currentIdx ? 'bg-amber-honey' : 'bg-charcoal/5'}`}
                        title={stage.name}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Current Stage Card */}
                <div className="bg-secondary-cream p-4 rounded-lg border border-amber-honey/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-amber-honey flex items-center justify-center text-charcoal">
                      <Factory size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-charcoal/40">Current Stage</p>
                      <h5 className="font-bold text-charcoal">{selectedBatch.currentStage}</h5>
                    </div>
                  </div>
                  <p className="text-xs text-charcoal/60 italic">
                    {STAGES.find(s => s.name === selectedBatch.currentStage)?.purpose}
                  </p>
                </div>

                {selectedBatch.status === 'In Progress' && (
                  <button 
                    onClick={() => setIsAdvanceModalOpen(true)}
                    className="w-full bg-charcoal text-warm-cream py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md group"
                  >
                    Advance to Next Stage
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {/* QC Checks Section */}
            <div className="p-6 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FlaskConical size={14} />
                Quality Control Checks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedQCChecks.length > 0 ? linkedQCChecks.map(qc => (
                  <div key={qc.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase text-gray-400">{qc.checkType}</span>
                      <Badge color={qc.result === 'Pass' ? 'green' : 'red'}>{qc.result}</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{qc.notes}</p>
                    <p className="text-xs text-gray-400 mt-2">{qc.checkDate} • {EMPLOYEES.find(e => e.id === qc.checkedBy)?.name}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 italic">No QC checks recorded for this production batch.</p>
                )}
              </div>
            </div>

            {/* Stage History */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold text-charcoal/40 tracking-widest">Stage History</h4>
                  <div className="space-y-3">
                    {selectedBatch.stageHistory.map((history, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-xs font-bold text-charcoal">{history.stage}</span>
                            <span className="text-[10px] text-charcoal/40">{new Date(history.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[10px] text-charcoal/60">Completed by {EMPLOYEES.find(e => e.id === history.user)?.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-xl border border-charcoal/5 border-dashed flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-secondary-cream rounded-full flex items-center justify-center mb-4">
                <Factory className="text-amber-honey" size={32} />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-2">No Batch Selected</h3>
              <p className="text-charcoal/40 max-w-xs">
                Select a production batch from the list to view its progress and manage stage transitions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Advance Stage Modal */}
      {isAdvanceModalOpen && selectedBatch && (
        <AdvanceStageModal 
          batch={selectedBatch} 
          onClose={() => setIsAdvanceModalOpen(false)} 
        />
      )}

      {/* New Batch Modal */}
      {isNewBatchModalOpen && (
        <NewBatchModal onClose={() => setIsNewBatchModalOpen(false)} />
      )}
    </div>
  );
};

// --- Sub-components ---

const Badge = ({ children, color = 'gray' }: { children: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${colors[color]}`}>
      {children}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
    'Completed': 'bg-green-100 text-green-700 border-green-200',
    'On Hold': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
};

const AdvanceStageModal = ({ batch, onClose }: { batch: any, onClose: () => void }) => {
  const currentStageIdx = STAGES.findIndex(s => s.name === batch.currentStage);
  const nextStage = STAGES[currentStageIdx + 1] || STAGES[currentStageIdx];
  const recipe = RECIPES.find(r => r.id === batch.recipeId);
  const crew = CREWS.find(c => c.id === batch.crewId);
  
  // Form State
  const [labour, setLabour] = useState<Record<string, { std: number, ot: number }>>(
    crew?.members.reduce((acc, empId) => ({ ...acc, [empId]: { std: 8, ot: 0 } }), {}) || {}
  );
  const [waste, setWaste] = useState({ qty: 0 });
  const [overhead, setOverhead] = useState(0);
  const [packagingSku, setPackagingSku] = useState('');
  const [unitsPacked, setUnitsPacked] = useState(0);

  // Calculations
  const labourCosts = useMemo(() => {
    return Object.keys(labour).map((empId) => {
      const hours = labour[empId];
      const employee = EMPLOYEES.find(e => e.id === empId);
      const rates = getEmployeeRate(empId, new Date().toISOString());
      const cost = (hours.std * rates.standardRate) + (hours.ot * rates.overtimeRate);
      return { empId, name: employee?.name, cost, rates };
    });
  }, [labour]);

  const totalLabourCost = labourCosts.reduce((acc, curr) => acc + curr.cost, 0);

  const stageIngredients = useMemo(() => {
    const recipeStage = recipe?.stages.find(s => s.name === batch.currentStage);
    if (!recipeStage) return [];
    
    return recipeStage.ingredients.map(ing => {
      const priceInfo = getMaterialPrice(ing.ingredientId, new Date().toISOString());
      const batchQty = ing.quantity * (batch.plannedQty / (recipe?.yieldUnits || 1));
      const cost = batchQty * priceInfo.price;
      const stdCost = batchQty * priceInfo.standardCost;
      const variance = ((cost - stdCost) / stdCost) * 100;
      
      return {
        ...ing,
        name: INGREDIENTS.find(i => i.id === ing.ingredientId)?.name,
        batchQty,
        price: priceInfo.price,
        cost,
        variance
      };
    });
  }, [batch, recipe]);

  const totalMaterialCost = stageIngredients.reduce((acc, curr) => acc + curr.cost, 0);
  const wasteCost = (waste.qty / (recipe?.yieldWeight || 1)) * totalMaterialCost; // Simplified waste cost
  const stageTotal = totalLabourCost + totalMaterialCost + overhead + wasteCost;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-warm-cream w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-charcoal text-warm-cream flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Advance Stage: {batch.currentStage} → {nextStage.name}</h3>
            <p className="text-warm-cream/40 text-xs mt-1 uppercase tracking-widest font-bold">Batch {batch.id} | {recipe?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Labour Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-charcoal/5 pb-2">
                <Users size={18} className="text-amber-honey" />
                <h4 className="font-bold text-charcoal uppercase tracking-wider text-xs">Labour Cost Breakdown</h4>
              </div>
              <div className="space-y-3">
                {labourCosts.map(item => (
                  <div key={item.empId} className="bg-white p-4 rounded-lg border border-charcoal/5 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-charcoal">{item.name}</p>
                      <p className="text-[10px] text-charcoal/40">Rate: {formatCurrency(item.rates.standardRate)}/hr (Eff: {item.rates.effectiveDate})</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24">
                        <label className="text-[9px] uppercase font-bold text-charcoal/40 block mb-1">Std Hrs</label>
                        <input 
                          type="number" 
                          value={labour[item.empId as string].std} 
                          onChange={(e) => setLabour({ ...labour, [item.empId as string]: { ...labour[item.empId as string], std: parseFloat(e.target.value) || 0 } })}
                          className="w-full px-2 py-1 text-sm border border-charcoal/10 rounded outline-none focus:ring-1 focus:ring-amber-honey"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[9px] uppercase font-bold text-charcoal/40 block mb-1">OT Hrs</label>
                        <input 
                          type="number" 
                          value={labour[item.empId as string].ot} 
                          onChange={(e) => setLabour({ ...labour, [item.empId as string]: { ...labour[item.empId as string], ot: parseFloat(e.target.value) || 0 } })}
                          className="w-full px-2 py-1 text-sm border border-charcoal/10 rounded outline-none focus:ring-1 focus:ring-amber-honey"
                        />
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-xs font-bold text-charcoal">{formatCurrency(item.cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Material Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-charcoal/5 pb-2">
                <TrendingUp size={18} className="text-amber-honey" />
                <h4 className="font-bold text-charcoal uppercase tracking-wider text-xs">Material Cost Panel</h4>
              </div>
              {stageIngredients.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-charcoal/5">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-secondary-cream/50 text-charcoal/40 uppercase font-bold">
                      <tr>
                        <th className="px-4 py-2">Ingredient</th>
                        <th className="px-4 py-2 text-right">BOM Qty</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Variance</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5 bg-white">
                      {stageIngredients.map((ing, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium">{ing.name}</td>
                          <td className="px-4 py-3 text-right font-mono">{ing.batchQty.toFixed(2)} {ing.unit}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(ing.price)}</td>
                          <td className={`px-4 py-3 text-right font-bold ${ing.variance > 5 ? 'text-red-600' : ing.variance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {ing.variance > 0 ? '+' : ''}{ing.variance.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-right font-bold">{formatCurrency(ing.cost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-lg border border-charcoal/5 border-dashed">
                  <p className="text-xs text-charcoal/40 italic">No ingredients defined for this stage in BOM.</p>
                </div>
              )}
            </section>

            {/* Packaging Special Handling */}
            {batch.currentStage === 'Packaging' && (
              <section className="bg-amber-50 p-6 rounded-xl border border-amber-honey/20 space-y-4">
                <div className="flex items-center gap-2">
                  <PackageIcon size={18} className="text-amber-honey" />
                  <h4 className="font-bold text-amber-900 uppercase tracking-wider text-xs">Packaging Configuration</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-amber-900/60">Select SKU</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-amber-honey/20 outline-none bg-white text-sm"
                      value={packagingSku}
                      onChange={(e) => setPackagingSku(e.target.value)}
                    >
                      <option value="">Select SKU...</option>
                      {SKUS.filter(s => s.recipeId === batch.recipeId).map(sku => (
                        <option key={sku.id} value={sku.id}>{sku.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-amber-900/60">Units Packed</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 rounded-lg border border-amber-honey/20 outline-none text-sm"
                      value={unitsPacked}
                      onChange={(e) => setUnitsPacked(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Distribution Special Handling */}
            {batch.currentStage === 'Distribution' && (
              <section className="bg-blue-50 p-6 rounded-xl border border-blue-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-blue-600" />
                  <h4 className="font-bold text-blue-900 uppercase tracking-wider text-xs">Dispatch & COGS Journal</h4>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-100 space-y-2">
                  <p className="text-[10px] uppercase font-bold text-blue-900/40">Journal Preview</p>
                  <div className="flex justify-between text-xs">
                    <span>DR Cost of Sales</span>
                    <span className="font-bold">{formatCurrency(stageTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>CR Finished Goods</span>
                    <span className="font-bold">{formatCurrency(stageTotal)}</span>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Totals & Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-charcoal/5 shadow-sm space-y-6">
              <h4 className="font-bold text-charcoal uppercase tracking-wider text-xs border-b border-charcoal/5 pb-2">Stage Inputs</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-charcoal/60">Waste Capture ({recipe?.yieldUnits ? 'Units' : 'kg'})</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 rounded border border-charcoal/10 outline-none text-sm"
                      value={waste.qty}
                      onChange={(e) => setWaste({ qty: parseFloat(e.target.value) || 0 })}
                    />
                    <div className="bg-secondary-cream px-3 py-2 rounded border border-charcoal/5 text-xs font-bold flex items-center">
                      {((waste.qty / (batch.plannedQty || 1)) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <p className="text-[10px] text-red-600 font-medium">Waste Cost: {formatCurrency(wasteCost)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-charcoal/60">Overhead (ZAR)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={14} />
                    <input 
                      type="number" 
                      className="w-full pl-8 pr-3 py-2 rounded border border-charcoal/10 outline-none text-sm"
                      value={overhead}
                      onChange={(e) => setOverhead(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Preview */}
            <div className="bg-charcoal p-6 rounded-xl text-warm-cream shadow-xl space-y-6">
              <h4 className="font-bold text-amber-honey uppercase tracking-wider text-[10px]">Real-Time Cost Preview</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-cream/40">Material Cost</span>
                  <span className="font-mono">{formatCurrency(totalMaterialCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-cream/40">Labour Cost</span>
                  <span className="font-mono">{formatCurrency(totalLabourCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-cream/40">Overhead</span>
                  <span className="font-mono">{formatCurrency(overhead)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Waste Cost</span>
                  <span className="font-mono text-red-400">{formatCurrency(wasteCost)}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase">Stage Total</span>
                  <span className="text-2xl font-bold text-amber-honey">{formatCurrency(stageTotal)}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  toast.success('Stage advanced and costs recorded! (Mock)');
                  onClose();
                }}
                className="w-full bg-amber-honey text-charcoal py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg mt-4"
              >
                <Save size={18} />
                Confirm & Advance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewBatchModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-warm-cream w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-charcoal text-warm-cream flex justify-between items-center">
          <h3 className="text-xl font-bold">Start New Batch</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-charcoal/60">Select Recipe</label>
            <select className="w-full px-4 py-2 rounded-lg border border-charcoal/10 outline-none bg-white text-sm">
              <option value="">Select Recipe...</option>
              {RECIPES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-charcoal/60">Select Branch</label>
            <select className="w-full px-4 py-2 rounded-lg border border-charcoal/10 outline-none bg-white text-sm">
              <option value="">Select Branch...</option>
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-charcoal/60">Select Crew</label>
            <select className="w-full px-4 py-2 rounded-lg border border-charcoal/10 outline-none bg-white text-sm">
              <option value="">Select Crew...</option>
              {CREWS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-charcoal/60">Planned Quantity</label>
            <input type="number" className="w-full px-4 py-2 rounded-lg border border-charcoal/10 outline-none text-sm" placeholder="e.g. 200" />
          </div>
          <button 
            onClick={() => {
              toast.success('New batch created! (Mock)');
              onClose();
            }}
            className="w-full bg-amber-honey text-charcoal py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg mt-4"
          >
            <Factory size={18} />
            Initialize Batch
          </button>
        </div>
      </div>
    </div>
  );
};

export default Production;
