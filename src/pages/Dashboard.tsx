import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ArrowLeftRight,
  Clock,
  ShieldCheck,
  Database
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BRANCHES, 
  INGREDIENTS, 
  PRODUCTION_BATCHES, 
  QC_CHECKS, 
  RECIPES, 
  BRANCH_TRANSFERS, 
  COMPLIANCE_RECORDS 
} from '../data/entities';

// --- Constants ---

const STAGES = [
  'Stores', 'Staging', 'Mixing', 'Weighing/Dividing', 'Proving', 
  'Baking', 'Cooling', 'Toppings', 'Packaging', 'Storage', 'Distribution'
];

const COLORS = ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'];

// --- Helpers ---

const formatCurrency = (value: number) => {
  return 'R' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace(/,/g, ' ');
};

// --- Components ---

const Dashboard = () => {
  // 1. KPI Calculations
  const stats = useMemo(() => {
    // Calculate Total Production Cost (Simplified for demo)
    const totalCost = (PRODUCTION_BATCHES || []).reduce((acc, batch) => {
      const recipe = (RECIPES || []).find(r => r.id === batch.recipeId);
      if (!recipe) return acc;
      
      // Material cost estimation
      const materialCost = (recipe.stages || []).reduce((sAcc, stage) => {
        return sAcc + (stage.ingredients || []).reduce((iAcc, ing) => {
          const ingredient = (INGREDIENTS || []).find(i => i.id === ing.ingredientId);
          return iAcc + (ing.quantity * (ingredient?.standardCost || 0));
        }, 0);
      }, 0);

      // Scale by planned quantity vs yield
      const batchMaterialCost = materialCost * (batch.plannedQty / recipe.yieldUnits);
      // Add estimated labour/overhead (30% of material)
      return acc + (batchMaterialCost * 1.3);
    }, 0);

    const activeBatches = (PRODUCTION_BATCHES || []).filter(b => b.currentStage !== 'Distribution').length;
    const wasteCost = (QC_CHECKS || []).reduce((acc, qc) => acc + (qc.wasteCost || 0), 0);
    const activeBranches = (BRANCHES || []).filter(b => b.isActive).length;

    return { totalCost, activeBatches, wasteCost, activeBranches };
  }, []);

  // 2. Pipeline Data
  const pipelineData = useMemo(() => {
    return STAGES.map(stage => ({
      name: stage,
      count: (PRODUCTION_BATCHES || []).filter(b => b.currentStage === stage).length
    }));
  }, []);

  // 3. Cost Breakdown Data
  const costBreakdown = [
    { name: 'Material', value: stats.totalCost * 0.6 },
    { name: 'Labour', value: stats.totalCost * 0.2 },
    { name: 'Overhead', value: stats.totalCost * 0.1 },
    { name: 'Packaging', value: stats.totalCost * 0.05 },
    { name: 'Waste', value: stats.wasteCost },
  ];

  // 4. Branch Comparison Data
  const branchData = useMemo(() => {
    return (BRANCHES || []).map(branch => ({
      name: (branch.name || '').split('(')[0].trim(),
      batches: (PRODUCTION_BATCHES || []).filter(b => b.branchId === branch.id).length,
    }));
  }, []);

  // 5. Recent Activity
  const recentActivity = useMemo(() => {
    const activities = [
      ...(PRODUCTION_BATCHES || []).flatMap(b => (b.stageHistory || []).map(h => ({
        type: 'stage',
        title: `Batch ${b.id} moved to ${h.stage}`,
        time: h.completedAt,
        icon: Clock,
        color: 'text-amber-honey'
      }))),
      ...(QC_CHECKS || []).slice(0, 3).map(qc => ({
        type: 'qc',
        title: `QC ${qc.result}: ${qc.checkType}`,
        time: qc.checkDate,
        icon: qc.result === 'Pass' ? CheckCircle2 : XCircle,
        color: qc.result === 'Pass' ? 'text-green-600' : 'text-red-600'
      })),
      ...(BRANCH_TRANSFERS || []).slice(0, 2).map(tr => ({
        type: 'transfer',
        title: `Transfer ${tr.status}: ${tr.quantity} units`,
        time: tr.transferDate,
        icon: ArrowLeftRight,
        color: 'text-blue-600'
      }))
    ];
    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);
  }, []);

  // 6. Inventory Alerts
  const inventoryAlerts = useMemo(() => {
    return (INGREDIENTS || []).filter(ing => ing.currentStock < ing.reorderLevel);
  }, []);

  // 7. Compliance Audits
  const upcomingAudits = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return (COMPLIANCE_RECORDS || []).filter(rec => {
      const auditDate = new Date(rec.nextAuditDate);
      return auditDate >= today && auditDate <= thirtyDaysFromNow;
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Row */}
      <div className="flex justify-between items-center bg-secondary-cream/50 p-4 rounded-xl border border-amber-honey/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-honey shadow-sm">
            <Database size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Database Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-sm font-bold text-charcoal">Connected to Supabase (Postgres)</p>
            </div>
          </div>
        </div>
        <Link to="/sql-exports" className="text-xs font-bold text-amber-honey hover:underline uppercase tracking-widest">
          Database Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Production Cost (MTD)" 
          value={formatCurrency(stats.totalCost)} 
          icon={TrendingUp} 
          trend="+12.5% vs last month"
          path="/journals"
        />
        <KpiCard 
          title="Active Production Batches" 
          value={stats.activeBatches.toString()} 
          icon={Package} 
          path="/production"
        />
        <KpiCard 
          title="Waste Cost (MTD)" 
          value={formatCurrency(stats.wasteCost)} 
          icon={AlertTriangle} 
          isWarning={stats.wasteCost > 1000}
          path="/quality-control"
        />
        <KpiCard 
          title="Branches Active" 
          value={stats.activeBranches.toString()} 
          icon={Building2} 
          path="/branches"
        />
      </div>

      {/* Production Pipeline */}
      <section className="bg-white p-6 rounded-lg border border-charcoal/5 shadow-sm overflow-hidden">
        <h3 className="text-charcoal font-bold mb-6 flex items-center gap-2">
          <FactoryIcon size={20} className="text-amber-honey" />
          Production Stage Pipeline
        </h3>
        <div className="flex items-center justify-between flex-wrap xl:flex-nowrap pb-4 gap-y-6 gap-x-1">
          {pipelineData.map((stage, idx) => (
            <React.Fragment key={stage.name}>
              <div className={`flex flex-col items-center min-w-[60px] flex-1 p-1.5 rounded-lg transition-colors ${stage.count > 0 ? 'bg-[#FFF8E7] border border-amber-100' : ''}`}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-1 font-bold text-[10px] transition-colors
                  ${stage.count > 0 ? 'bg-amber-honey text-charcoal shadow-sm' : 'bg-gray-50 text-gray-400 border border-gray-100'}
                `}>
                  {stage.count}
                </div>
                <span className="text-[8px] uppercase font-bold text-charcoal/60 text-center leading-tight">
                  {stage.name}
                </span>
              </div>
              {idx < pipelineData.length - 1 && (
                <ArrowRight size={12} className="text-charcoal/10 shrink-0 hidden xl:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-charcoal/5 shadow-sm">
          <h3 className="text-charcoal font-bold mb-6">Cost Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Comparison */}
        <div className="bg-white p-6 rounded-lg border border-charcoal/5 shadow-sm">
          <h3 className="text-charcoal font-bold mb-6">Production by Branch</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#FEFCE8' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="batches" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-charcoal/5 shadow-sm">
          <h3 className="text-charcoal font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 hover:bg-secondary-cream rounded-lg transition-colors">
                <div className={`p-2 rounded-full bg-white border border-charcoal/5 ${activity.color}`}>
                  <activity.icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{activity.title}</p>
                  <p className="text-xs text-charcoal/40">{new Date(activity.time).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Audits */}
        <div className="space-y-8">
          {/* Inventory Alerts */}
          <div>
            <h3 className="text-charcoal font-bold mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              Inventory Alerts
            </h3>
            <div className="space-y-3">
              {inventoryAlerts.map(ing => (
                <div key={ing.id} className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm border border-charcoal/5">
                  <p className="text-sm font-bold text-charcoal">{ing.name}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-charcoal/60">Stock: {ing.currentStock} {ing.unit}</span>
                    <span className="text-xs font-bold text-red-600">Min: {ing.reorderLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Audits */}
          <div>
            <h3 className="text-charcoal font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-honey" />
              Upcoming Audits
            </h3>
            <div className="space-y-3">
              {upcomingAudits.map(audit => (
                <div key={audit.id} className="bg-white p-4 rounded-lg border-l-4 border-amber-honey shadow-sm border border-charcoal/5">
                  <p className="text-sm font-bold text-charcoal">{audit.auditType}</p>
                  <p className="text-xs text-charcoal/60 mt-1">{(BRANCHES || []).find(b => b.id === audit.branchId)?.name}</p>
                  <p className="text-xs font-bold text-amber-honey mt-2">Due: {new Date(audit.nextAuditDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const KpiCard = ({ title, value, icon: Icon, trend, isWarning, path }: any) => (
  <Link to={path || '#'}>
    <div className="bg-white p-6 rounded-lg border border-charcoal/5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg transition-colors ${isWarning ? 'bg-red-50 text-red-600 group-hover:bg-red-100' : 'bg-secondary-cream text-amber-honey group-hover:bg-amber-honey group-hover:text-charcoal'}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
      <p className="text-charcoal/60 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-charcoal">{value}</h4>
    </div>
  </Link>
);

const FactoryIcon = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M17 18h1" />
    <path d="M12 18h1" />
    <path d="M7 18h1" />
  </svg>
);

export default Dashboard;
