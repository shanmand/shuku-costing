import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  User, 
  ChevronDown, 
  ChevronUp,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ClipboardCheck,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { 
  COMPLIANCE_RECORDS, 
  BRANCHES 
} from '../data/entities';

// --- Types ---

const AUDIT_TYPES = [
  'GMP Audit', 'HACCP Review', 'Pest Control', 'Cold Chain', 
  'Allergen Control', 'Hygiene Inspection', 'Supplier Audit', 'Equipment Calibration'
];

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

const ScoreCaptureModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [categories, setCategories] = useState([
    { name: 'Personal Hygiene', score: 0, max: 25 },
    { name: 'Premises', score: 0, max: 25 },
    { name: 'Equipment', score: 0, max: 25 },
    { name: 'Documentation', score: 0, max: 25 }
  ]);

  const totalScore = categories.reduce((acc, curr) => acc + curr.score, 0);
  const totalMax = categories.reduce((acc, curr) => acc + curr.max, 0);
  const overallPercent = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-600 text-white">
          <h3 className="text-xl font-bold">New Compliance Audit</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
            <ChevronDown className="rotate-90" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-6 border-b border-gray-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Branch</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Audit Type</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
              {AUDIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Audit Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Inspector</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Name..." />
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Category Scores</h4>
          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 items-center">
                <span className="text-sm font-bold text-gray-700 col-span-2">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-sm" 
                    value={cat.score}
                    onChange={(e) => {
                      const newCats = [...categories];
                      newCats[idx].score = Number(e.target.value);
                      setCategories(newCats);
                    }}
                  />
                  <span className="text-gray-400">/</span>
                  <input 
                    type="number" 
                    className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-sm bg-gray-100" 
                    value={cat.max}
                    readOnly
                  />
                </div>
                <div className="text-right">
                  <Badge color={cat.score/cat.max >= 0.85 ? 'green' : cat.score/cat.max >= 0.7 ? 'amber' : 'red'}>
                    {((cat.score/cat.max)*100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Score</p>
              <p className="text-lg font-black text-gray-900">{totalScore} / {totalMax}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overall %</p>
              <p className={`text-lg font-black ${overallPercent >= 85 ? 'text-green-600' : overallPercent >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                {overallPercent.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200">Save Audit</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'charts'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getScoreColor = (percent: number) => {
    if (percent >= 85) return 'green';
    if (percent >= 70) return 'amber';
    return 'red';
  };

  // Mock data for charts
  const typeDistribution = [
    { name: 'GMP', value: 400 },
    { name: 'HACCP', value: 300 },
    { name: 'Pest', value: 300 },
    { name: 'Hygiene', value: 200 },
  ];

  const trendData = [
    { date: 'Jan', score: 82 },
    { date: 'Feb', score: 85 },
    { date: 'Mar', score: 88 },
    { date: 'Apr', score: 86 },
    { date: 'May', score: 90 },
  ];

  const COLORS = ['#F59E0B', '#1C1C1E', '#D97706', '#4B5563'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Compliance & Audits</h1>
          <p className="text-gray-500 font-medium">South African food safety and manufacturing regulations tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            <Printer size={20} />
            PRINT REPORT
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95"
          >
            <Plus size={20} />
            NEW AUDIT
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('list')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'list' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ClipboardCheck size={18} />
          AUDIT LOG
        </button>
        <button 
          onClick={() => setActiveTab('charts')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'charts' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 size={18} />
          ANALYTICS
        </button>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search audits..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              />
            </div>
            <select className="px-4 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-amber-500">
              <option value="">All Branches</option>
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select className="px-4 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-amber-500">
              <option value="">All Audit Types</option>
              {AUDIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Audit Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-200">
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Branch</th>
                  <th className="px-6 py-4 font-bold">Audit Type</th>
                  <th className="px-6 py-4 font-bold">Inspector</th>
                  <th className="px-6 py-4 font-bold text-right">Score</th>
                  <th className="px-6 py-4 font-bold text-center">%</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Next Audit</th>
                  <th className="px-6 py-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPLIANCE_RECORDS.map((rec) => {
                  const branch = BRANCHES.find(b => b.id === rec.branchId);
                  const percent = (rec.overallScore / rec.maxScore) * 100;
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{rec.auditDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <MapPin size={12} className="text-amber-500" />
                          {branch?.name.split('(')[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 text-sm">{rec.auditType}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{rec.inspector}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {rec.overallScore} / {rec.maxScore}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge color={getScoreColor(percent)}>{percent.toFixed(0)}%</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={rec.status === 'Compliant' ? 'green' : 'amber'}>{rec.status.toUpperCase()}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{rec.nextAuditDate}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-gray-400 hover:text-amber-600 transition-colors">
                          <FileText size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <PieChartIcon size={16} className="text-amber-600" />
              Audit Type Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend Line */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <TrendingUp size={16} className="text-amber-600" />
              Compliance Score Trend (%)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[70, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={3} dot={{ r: 6, fill: '#F59E0B' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stacked Bar */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm md:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <BarChart3 size={16} className="text-amber-600" />
              Compliance Status by Branch
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}> {/* Mocking with trendData for structure */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Pass" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <ScoreCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
