import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Calendar, 
  User, 
  ChevronRight,
  Info,
  Trash2,
  MoreVertical,
  FlaskConical,
  Package,
  Factory
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useData } from '../contexts/DataContext';

// --- Types ---

interface QCCheck {
  id: string;
  productionBatchId: string | null;
  ingredientBatchId: string | null;
  checkType: string;
  result: 'Pass' | 'Fail' | 'Conditional';
  failureCategory?: string;
  wasteCost: number;
  checkedBy: string;
  checkDate: string;
  notes?: string;
}

// --- Components ---

const ResultBadge = ({ result }: { result: QCCheck['result'] }) => {
  const styles = {
    Pass: 'bg-green-100 text-green-700',
    Fail: 'bg-red-100 text-red-700',
    Conditional: 'bg-amber-100 text-amber-700'
  };
  return (
    <span className={`px-2 py-1 ${styles[result]} text-[10px] font-black rounded uppercase tracking-widest`}>
      {result}
    </span>
  );
};

// --- Tabs ---

const QCChecksTab = ({ qcChecks, productionBatches, ingredientBatches, saveItem }: { qcChecks: any[], productionBatches: any[], ingredientBatches: any[], saveItem: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredChecks = useMemo(() => {
    return (qcChecks || []).filter(qc => 
      qc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qc.checkType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qc.checkedBy.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.checkDate.localeCompare(a.checkDate));
  }, [qcChecks, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={20} />
          <input 
            type="text" 
            placeholder="Search checks, batches, or inspectors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20 transition-all font-medium"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-charcoal text-warm-cream rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-charcoal/90 transition-all"
        >
          <Plus size={18} />
          New QC Check
        </button>
      </div>

      <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
              <th className="px-8 py-5">Check ID</th>
              <th className="px-8 py-5">Target</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Result</th>
              <th className="px-8 py-5">Waste Cost</th>
              <th className="px-8 py-5">Checked By</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {filteredChecks.map((qc) => (
              <tr key={qc.id} className="hover:bg-secondary-cream/30 transition-colors group">
                <td className="px-8 py-6 font-bold text-charcoal text-sm">{qc.id}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {qc.productionBatchId ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/60 bg-blue-50 px-2 py-1 rounded">
                        <Factory size={12} />
                        {qc.productionBatchId}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/60 bg-amber-50 px-2 py-1 rounded">
                        <FlaskConical size={12} />
                        {qc.ingredientBatchId}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-medium text-charcoal/70">{qc.checkType}</td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <ResultBadge result={qc.result as any} />
                    {qc.failureCategory && (
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">{qc.failureCategory}</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 font-bold text-charcoal text-sm">
                  {qc.wasteCost > 0 ? `R ${qc.wasteCost.toLocaleString()}` : '-'}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary-cream flex items-center justify-center text-charcoal/40">
                      <User size={12} />
                    </div>
                    <span className="text-sm font-medium text-charcoal/70">{qc.checkedBy}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-medium text-charcoal/40">{qc.checkDate}</td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-charcoal/20 hover:text-charcoal hover:bg-white rounded-lg transition-all">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New QC Check Modal (Simplified for UI) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-charcoal/5 flex justify-between items-center bg-secondary-cream/30">
                <div>
                  <h2 className="text-xl font-black text-charcoal uppercase tracking-tight">New QC Check</h2>
                  <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest mt-1">Record inspection results</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-charcoal/5 rounded-xl transition-colors">
                  <XCircle size={24} className="text-charcoal/20" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Target Type</label>
                    <select className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-honey/20">
                      <option>Production Batch</option>
                      <option>Ingredient Batch</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Select Batch</label>
                    <select className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-honey/20">
                      {(productionBatches || []).map(b => <option key={b.id}>{b.id}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Check Type</label>
                    <select className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-honey/20">
                      <option>Temperature Check</option>
                      <option>Visual Inspection</option>
                      <option>Weight Verification</option>
                      <option>Allergen Test</option>
                      <option>Packaging Integrity</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Result</label>
                    <select className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-honey/20">
                      <option className="text-green-600">Pass</option>
                      <option className="text-red-600">Fail</option>
                      <option className="text-amber-600">Conditional</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Notes / Observations</label>
                  <textarea 
                    rows={3}
                    className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20"
                    placeholder="Describe findings..."
                  />
                </div>

                <button className="w-full py-4 bg-charcoal text-amber-honey rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} />
                  Submit QC Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QCAnalyticsTab = ({ qcChecks, ingredientBatches }: { qcChecks: any[], ingredientBatches: any[] }) => {
  const distributionData = useMemo(() => {
    const counts = (qcChecks || []).reduce((acc: any, curr) => {
      acc[curr.result] = (acc[curr.result] || 0) + 1;
      return acc;
    }, {});
    return [
      { name: 'Pass', value: counts.Pass || 0, color: '#10B981' },
      { name: 'Fail', value: counts.Fail || 0, color: '#EF4444' },
      { name: 'Conditional', value: counts.Conditional || 0, color: '#F59E0B' },
    ];
  }, [qcChecks]);

  const failureCategories = useMemo(() => {
    const counts = (qcChecks || []).filter(qc => qc.failureCategory).reduce((acc: any, curr) => {
      acc[curr.failureCategory!] = (acc[curr.failureCategory!] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count);
  }, [qcChecks]);

  const checkTypePerformance = useMemo(() => {
    const types = Array.from(new Set((qcChecks || []).map(qc => qc.checkType)));
    return types.map(type => {
      const typeChecks = (qcChecks || []).filter(qc => qc.checkType === type);
      const pass = typeChecks.filter(qc => qc.result === 'Pass').length;
      const fail = typeChecks.filter(qc => qc.result === 'Fail').length;
      return { type, pass, fail };
    });
  }, [qcChecks]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pass/Fail Distribution */}
        <div className="bg-white p-8 rounded-2xl border border-charcoal/5 shadow-sm">
          <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-8 flex items-center gap-2">
            <PieChartIcon size={16} className="text-amber-honey" />
            Result Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Failure Categories */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-charcoal/5 shadow-sm">
          <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-8 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            Top Failure Categories
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={failureCategories}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance by Check Type */}
      <div className="bg-white p-8 rounded-2xl border border-charcoal/5 shadow-sm">
        <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-8 flex items-center gap-2">
          <BarChart3 size={16} className="text-charcoal" />
          Pass/Fail Counts by Check Type
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={checkTypePerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="pass" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} name="Pass" />
              <Bar dataKey="fail" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} name="Fail" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ingredient Batch Performance Table */}
      <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-charcoal/5">
          <h3 className="text-sm font-black text-charcoal uppercase tracking-widest">Ingredient Batch Performance</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
              <th className="px-8 py-4">Batch ID</th>
              <th className="px-8 py-4 text-center">Total Checks</th>
              <th className="px-8 py-4 text-center">Pass Count</th>
              <th className="px-8 py-4 text-right">Pass Rate %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {(ingredientBatches || []).slice(0, 5).map(batch => {
              const checks = (qcChecks || []).filter(qc => qc.ingredientBatchId === batch.id);
              const total = checks.length;
              const pass = checks.filter(qc => qc.result === 'Pass').length;
              const rate = total > 0 ? (pass / total) * 100 : 0;
              return (
                <tr key={batch.id}>
                  <td className="px-8 py-4 font-bold text-charcoal text-sm">{batch.id}</td>
                  <td className="px-8 py-4 text-center text-sm text-charcoal/60">{total}</td>
                  <td className="px-8 py-4 text-center text-sm font-bold text-green-600">{pass}</td>
                  <td className="px-8 py-4 text-right">
                    <span className={`font-black ${rate >= 90 ? 'text-green-600' : rate >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                      {rate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function QualityControl() {
  const { 
    qcChecks: QC_CHECKS, 
    productionBatches: PRODUCTION_BATCHES, 
    ingredientBatches: INGREDIENT_BATCHES, 
    branches: BRANCHES, 
    loading,
    saveItem
  } = useData();

  const [activeTab, setActiveTab] = useState<'checks' | 'analytics'>('checks');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-amber-honey border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight uppercase">Quality Control</h1>
          <p className="text-charcoal/50 font-medium">Compliance, inspections, and safety monitoring</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-charcoal/5 text-charcoal rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-secondary-cream transition-all">
            <Printer size={16} />
            Print Report
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 bg-secondary-cream p-1.5 rounded-2xl w-fit border border-charcoal/5">
        <button 
          onClick={() => setActiveTab('checks')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'checks' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <CheckCircle2 size={16} />
          QC CHECKS
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'analytics' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <BarChart3 size={16} />
          QC ANALYTICS
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
          {activeTab === 'checks' 
            ? <QCChecksTab qcChecks={QC_CHECKS} productionBatches={PRODUCTION_BATCHES} ingredientBatches={INGREDIENT_BATCHES} saveItem={saveItem} /> 
            : <QCAnalyticsTab qcChecks={QC_CHECKS} ingredientBatches={INGREDIENT_BATCHES} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
