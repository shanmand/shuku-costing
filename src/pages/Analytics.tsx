import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend, 
  ComposedChart,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Filter, 
  Calendar, 
  Building2, 
  Users, 
  Calculator, 
  ArrowRight,
  Info,
  ChevronRight,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PRODUCTION_BATCHES, 
  QC_CHECKS, 
  BRANCHES, 
  CREWS, 
  RECIPES, 
  INGREDIENTS 
} from '../data/entities';

// --- Mock Data for Analytics ---
const STAGE_WASTE_DATA = [
  { stage: 'Mixing', waste: 1.2, efficiency: 450 },
  { stage: 'Dividing', waste: 0.8, efficiency: 520 },
  { stage: 'Proving', waste: 0.5, efficiency: 480 },
  { stage: 'Baking', waste: 2.4, efficiency: 410 },
  { stage: 'Cooling', waste: 0.2, efficiency: 600 },
  { stage: 'Packaging', waste: 1.5, efficiency: 380 },
];

const CREW_PERFORMANCE = [
  { crew: 'Alpha Morning', batches: 45, waste: 1.1 },
  { crew: 'Beta Evening', batches: 38, waste: 1.4 },
  { crew: 'Gamma Night', batches: 42, waste: 1.2 },
];

// --- Components ---

const StatCard = ({ title, value, subValue, icon: Icon, trend, color = 'amber' }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl bg-${color}-honey/10 flex items-center justify-center text-${color}-honey`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-2xl font-black text-charcoal">{value}</h3>
    {subValue && <p className="text-xs text-charcoal/50 mt-1 font-medium">{subValue}</p>}
  </div>
);

// --- Tabs ---

const WasteEfficiencyTab = () => {
  const worstStage = useMemo(() => {
    return [...STAGE_WASTE_DATA].sort((a, b) => b.waste - a.waste)[0];
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Waste per Stage */}
          <div className="bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm">
            <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingDown size={16} className="text-red-500" />
              Average Waste % per Production Stage
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STAGE_WASTE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f9fafb' }}
                  />
                  <Bar dataKey="waste" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency per Stage */}
          <div className="bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm">
            <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              Units Produced per Labour Hour
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STAGE_WASTE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f9fafb' }}
                  />
                  <Bar dataKey="efficiency" fill="#1C1C1E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Worst Waste Stage Callout */}
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-sm font-black text-red-900 uppercase tracking-widest">Worst Waste Stage</h3>
            </div>
            <p className="text-4xl font-black text-red-600 mb-1">{worstStage.stage}</p>
            <p className="text-sm font-bold text-red-800/60 mb-4">{worstStage.waste}% Average Loss</p>
            <div className="bg-white/50 p-4 rounded-xl border border-red-200/50">
              <p className="text-xs text-red-900 leading-relaxed">
                <span className="font-bold">Recommendation:</span> Review oven calibration and baking times. High variance detected in last 48 hours.
              </p>
            </div>
          </div>

          {/* Crew vs Branch Comparison */}
          <div className="bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm">
            <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-6">Crew Efficiency vs Waste</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={CREW_PERFORMANCE}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="crew" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="batches" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Batches" />
                  <Line yAxisId="right" type="monotone" dataKey="waste" stroke="#EF4444" strokeWidth={3} name="Waste %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QCWasteTrendTab = () => {
  const dailyWasteData = useMemo(() => {
    // Group QC fails by date
    const fails = (QC_CHECKS || []).filter(qc => qc.result === 'Fail' && qc.wasteCost > 0);
    const grouped = fails.reduce((acc: any, curr) => {
      const date = curr.checkDate;
      acc[date] = (acc[date] || 0) + curr.wasteCost;
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([date, cost]) => ({ date, cost })).sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-charcoal/5 shadow-sm">
        <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-8 flex items-center gap-2">
          <TrendingDown size={16} className="text-red-500" />
          Daily QC Waste Cost Trend (ZAR)
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyWasteData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={4} dot={{ r: 6, fill: '#F59E0B' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const OutputPredictionTab = () => {
  const [wasteOverride, setWasteOverride] = useState(1.5);
  
  const activeBatches = useMemo(() => {
    return (PRODUCTION_BATCHES || []).filter(b => b.status === 'In Progress').map(b => {
      const recipe = RECIPES.find(r => r.id === b.recipeId);
      const predicted = Math.floor(b.plannedQty * (1 - wasteOverride / 100));
      return {
        ...b,
        recipeName: recipe?.name,
        predicted,
        variance: predicted - b.plannedQty
      };
    });
  }, [wasteOverride]);

  return (
    <div className="space-y-8">
      {/* Global Override Slider */}
      <div className="bg-charcoal p-8 rounded-2xl text-warm-cream shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator size={20} className="text-amber-honey" />
              Global Waste Prediction Override
            </h3>
            <p className="text-warm-cream/50 text-xs mt-1">Adjust expected waste % to see impact on net output</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-amber-honey">{wasteOverride}%</span>
          </div>
        </div>
        <input 
          type="range" 
          min="0" 
          max="10" 
          step="0.1" 
          value={wasteOverride} 
          onChange={(e) => setWasteOverride(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-honey"
        />
        <div className="flex justify-between text-[10px] font-bold text-warm-cream/30 mt-2 uppercase tracking-widest">
          <span>0% (Perfect)</span>
          <span>5% (Historical Avg)</span>
          <span>10% (Critical)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Batch Predictions */}
        <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-charcoal/5 flex justify-between items-center">
            <h3 className="text-sm font-black text-charcoal uppercase tracking-widest">Batch Output Predictions</h3>
            <span className="text-[10px] font-bold text-charcoal/40 bg-secondary-cream px-2 py-1 rounded">ACTIVE BATCHES</span>
          </div>
          <div className="divide-y divide-charcoal/5">
            {activeBatches.map(batch => (
              <div key={batch.id} className="p-6 hover:bg-secondary-cream/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-charcoal/40 uppercase tracking-widest mb-1">{batch.id}</p>
                    <h4 className="font-bold text-charcoal">{batch.recipeName}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Predicted Net</p>
                    <p className="text-xl font-black text-charcoal">{batch.predicted} <span className="text-xs font-medium text-charcoal/40">units</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-honey" 
                      style={{ width: `${(batch.predicted / batch.plannedQty) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                    <TrendingDown size={12} />
                    {batch.variance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchasing Multiplier Table */}
        <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-charcoal/5 flex justify-between items-center">
            <h3 className="text-sm font-black text-charcoal uppercase tracking-widest">Purchasing Multipliers</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-700 bg-amber-honey/10 px-2 py-1 rounded">
              <Info size={12} />
              WASTE-ADJUSTED ORDERING
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
                <th className="px-6 py-4">Ingredient</th>
                <th className="px-6 py-4 text-right">BOM Qty</th>
                <th className="px-6 py-4 text-center">Multiplier</th>
                <th className="px-6 py-4 text-right">Recommended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {(INGREDIENTS || []).slice(0, 6).map(ing => {
                const multiplier = 1 / (1 - wasteOverride / 100);
                const bomQty = 100; // Mocked base
                return (
                  <tr key={ing.id} className="hover:bg-secondary-cream/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-charcoal text-sm">{ing.name}</td>
                    <td className="px-6 py-4 text-right text-sm text-charcoal/60">{bomQty} {ing.unit}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-mono font-bold text-amber-honey">x{multiplier.toFixed(3)}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-charcoal">
                      {(bomQty * multiplier).toFixed(2)} {ing.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<'waste' | 'qc' | 'prediction'>('waste');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight uppercase">Production Analytics</h1>
          <p className="text-charcoal/50 font-medium">Efficiency, waste tracking, and output forecasting</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-charcoal/5 rounded-xl shadow-sm">
            <Calendar size={18} className="text-amber-honey" />
            <span className="text-xs font-bold text-charcoal/60">MAR 2026</span>
          </div>
          <button className="p-3 bg-white border border-charcoal/5 rounded-xl shadow-sm hover:bg-secondary-cream transition-colors">
            <Filter size={20} className="text-charcoal/40" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 bg-secondary-cream p-1.5 rounded-2xl w-fit border border-charcoal/5">
        <button 
          onClick={() => setActiveTab('waste')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'waste' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <TrendingDown size={16} />
          WASTE & EFFICIENCY
        </button>
        <button 
          onClick={() => setActiveTab('qc')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'qc' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <AlertTriangle size={16} />
          QC WASTE TREND
        </button>
        <button 
          onClick={() => setActiveTab('prediction')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'prediction' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <Target size={16} />
          OUTPUT PREDICTION
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'waste' && <WasteEfficiencyTab />}
          {activeTab === 'qc' && <QCWasteTrendTab />}
          {activeTab === 'prediction' && <OutputPredictionTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
