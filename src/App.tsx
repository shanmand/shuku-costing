/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  BookOpen, 
  Package, 
  FlaskConical, 
  Factory, 
  Users, 
  MapPin, 
  ArrowLeftRight, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  CalendarDays, 
  CheckCircle2, 
  Truck, 
  Tags, 
  UserCog, 
  Database 
} from 'lucide-react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  NavLink, 
  Outlet, 
  useLocation 
} from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import Production from './pages/Production';
import SKUs from './pages/SKUs';
import Ingredients from './pages/Ingredients';
import Crews from './pages/Crews';
import Branches from './pages/Branches';
import Transfers from './pages/Transfers';
import Compliance from './pages/Compliance';
import Suppliers from './pages/Suppliers';
import JournalEntries from './pages/JournalEntries';
import SqlExports from './pages/SqlExports';
import Analytics from './pages/Analytics';
import InventoryPlanning from './pages/InventoryPlanning';
import QualityControl from './pages/QualityControl';
import IngredientCategories from './pages/IngredientCategories';
import UserAccess from './pages/UserAccess';

import { 
  PRODUCTION_BATCHES, 
  INGREDIENTS, 
  SKUS, 
  RECIPES, 
  INGREDIENT_BATCHES, 
  COMPLIANCE_RECORDS 
} from './data/entities';
import { 
  Search, 
  Bell, 
  X, 
  ChevronRight, 
  AlertTriangle, 
  Clock, 
  XCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// --- Types ---

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

// --- Constants ---

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Recipes & BOMs', path: '/recipes', icon: BookOpen },
  { name: 'SKUs', path: '/skus', icon: Package },
  { name: 'Ingredients', path: '/ingredients', icon: FlaskConical },
  { name: 'Production', path: '/production', icon: Factory },
  { name: 'Crews & Labour', path: '/crews', icon: Users },
  { name: 'Branches', path: '/branches', icon: MapPin },
  { name: 'Branch Transfers', path: '/transfers', icon: ArrowLeftRight },
  { name: 'Journal Entries', path: '/journals', icon: FileText },
  { name: 'Compliance', path: '/compliance', icon: ShieldCheck },
  { name: 'Production Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Inventory Planning', path: '/inventory-planning', icon: CalendarDays },
  { name: 'Quality Control', path: '/quality-control', icon: CheckCircle2 },
  { name: 'Suppliers', path: '/suppliers', icon: Truck },
  { name: 'Ingredient Categories', path: '/ingredient-categories', icon: Tags },
  { name: 'User Access & Roles', path: '/user-access', icon: UserCog },
  { name: 'SQL & Exports', path: '/sql-exports', icon: Database },
];

// --- Components ---

const Sidebar = () => {
  return (
    <div className="w-[240px] h-screen bg-charcoal fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-amber-honey text-2xl font-bold tracking-tight">SHUKU</h1>
        <p className="text-warm-cream/60 text-[10px] uppercase tracking-widest mt-1">Costing System</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200
              ${isActive 
                ? 'text-amber-honey border-l-4 border-amber-honey bg-white/5' 
                : 'text-warm-cream/70 border-l-4 border-transparent hover:text-warm-cream hover:bg-white/5'}
            `}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-honey flex items-center justify-center text-charcoal font-bold text-xs">
            SM
          </div>
          <div className="flex flex-col">
            <span className="text-warm-cream text-xs font-medium">Shan Mand</span>
            <span className="text-warm-cream/40 text-[10px]">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopBar = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const pageTitle = useMemo(() => {
    const item = NAV_ITEMS.find(item => item.path === location.pathname);
    return item ? item.name : 'Dashboard';
  }, [location.pathname]);

  const currentDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }, []);

  // --- Search Logic ---
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const results: any[] = [];
    
    // Batches
    PRODUCTION_BATCHES.filter(b => b.id.toLowerCase().includes(query)).forEach(b => 
      results.push({ id: b.id, name: `Batch ${b.id}`, type: 'Production', path: '/production', icon: Factory })
    );
    
    // Ingredients
    INGREDIENTS.filter(i => i.name.toLowerCase().includes(query)).forEach(i => 
      results.push({ id: i.id, name: i.name, type: 'Ingredient', path: '/ingredients', icon: FlaskConical })
    );
    
    // SKUs
    SKUS.filter(s => s.name.toLowerCase().includes(query)).forEach(s => 
      results.push({ id: s.id, name: s.name, type: 'SKU', path: '/skus', icon: Package })
    );
    
    // Recipes
    RECIPES.filter(r => r.name.toLowerCase().includes(query)).forEach(r => 
      results.push({ id: r.id, name: r.name, type: 'Recipe', path: '/recipes', icon: BookOpen })
    );
    
    return results.slice(0, 8);
  }, [searchQuery]);

  // --- Notifications Logic ---
  const notifications = useMemo(() => {
    const alerts: any[] = [];
    const today = new Date();
    
    // Expiring Batches (within 7 days)
    INGREDIENT_BATCHES.forEach(batch => {
      const expiry = new Date(batch.expiryDate);
      const diff = (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if (diff > 0 && diff <= 7) {
        const ing = INGREDIENTS.find(i => i.id === batch.ingredientId);
        alerts.push({
          id: `exp-${batch.id}`,
          title: 'Batch Expiring Soon',
          message: `${ing?.name} (${batch.batchNumber}) expires in ${Math.ceil(diff)} days`,
          type: 'expiry',
          icon: Clock,
          color: 'text-amber-honey'
        });
      }
    });
    
    // Compliance Due (within 14 days)
    COMPLIANCE_RECORDS.forEach(rec => {
      const audit = new Date(rec.nextAuditDate);
      const diff = (audit.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if (diff > 0 && diff <= 14) {
        alerts.push({
          id: `comp-${rec.id}`,
          title: 'Compliance Audit Due',
          message: `${rec.auditType} audit due in ${Math.ceil(diff)} days`,
          type: 'compliance',
          icon: ShieldCheck,
          color: 'text-blue-500'
        });
      }
    });
    
    // Low Stock
    INGREDIENTS.filter(i => i.currentStock < i.reorderLevel).forEach(i => {
      alerts.push({
        id: `stock-${i.id}`,
        title: 'Low Stock Alert',
        message: `${i.name} is below reorder level (${i.currentStock} ${i.unit})`,
        type: 'stock',
        icon: AlertTriangle,
        color: 'text-red-500'
      });
    });
    
    return alerts;
  }, []);

  return (
    <header className="h-16 bg-secondary-cream border-b border-charcoal/5 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-8 flex-1">
        <h2 className="text-charcoal font-semibold text-lg shrink-0">{pageTitle}</h2>
        
        {/* Global Search */}
        <div className="relative max-w-md w-full">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-amber-honey transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search batches, ingredients, SKUs..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-charcoal/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20 focus:bg-white transition-all"
            />
          </div>
          
          <AnimatePresence>
            {showSearch && searchQuery.trim() && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSearch(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-charcoal/5 overflow-hidden z-20"
                >
                  <div className="p-2 divide-y divide-charcoal/5">
                    {searchResults.length > 0 ? searchResults.map((res: any) => (
                      <Link 
                        key={`${res.type}-${res.id}`}
                        to={res.path}
                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 p-3 hover:bg-secondary-cream transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary-cream flex items-center justify-center text-charcoal/30 group-hover:text-amber-honey transition-colors">
                          <res.icon size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-charcoal">{res.name}</p>
                          <p className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">{res.type}</p>
                        </div>
                        <ChevronRight size={14} className="text-charcoal/20" />
                      </Link>
                    )) : (
                      <div className="p-8 text-center">
                        <p className="text-sm text-charcoal/40">No results found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0 ml-8">
        <div className="text-charcoal/50 text-sm font-medium hidden md:block">
          {currentDate}
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-charcoal text-amber-honey shadow-lg' : 'text-charcoal/40 hover:bg-white hover:text-charcoal'}`}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-secondary-cream" />
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 10, x: 20 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-charcoal/5 overflow-hidden z-20"
                >
                  <div className="p-4 border-b border-charcoal/5 bg-secondary-cream/30 flex justify-between items-center">
                    <h4 className="text-xs font-black text-charcoal uppercase tracking-widest">Notifications</h4>
                    <span className="text-[10px] font-bold text-amber-honey bg-charcoal px-2 py-0.5 rounded-full">{notifications.length}</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto divide-y divide-charcoal/5">
                    {notifications.length > 0 ? notifications.map((notif: any) => (
                      <div key={notif.id} className="p-4 hover:bg-secondary-cream/30 transition-colors flex gap-3">
                        <div className={`mt-1 ${notif.color}`}>
                          <notif.icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-charcoal">{notif.title}</p>
                          <p className="text-[10px] text-charcoal/50 mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-secondary-cream rounded-full flex items-center justify-center mx-auto mb-3 text-charcoal/20">
                          <CheckCircle2 size={24} />
                        </div>
                        <p className="text-xs text-charcoal/40">All clear! No pending alerts.</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button className="w-full py-3 text-[10px] font-black text-charcoal/40 uppercase tracking-widest hover:bg-secondary-cream transition-colors border-t border-charcoal/5">
                      Clear All
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-warm-cream">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col">
        <TopBar />
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="bg-white p-8 rounded-lg shadow-sm border border-charcoal/5 min-h-[400px] flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 bg-secondary-cream rounded-full flex items-center justify-center mb-4">
      <LayoutDashboard className="text-amber-honey" size={32} />
    </div>
    <h3 className="text-xl font-bold text-charcoal mb-2">{name}</h3>
    <p className="text-charcoal/60 max-w-md">
      This module is currently under development. Soon you will be able to manage your bakery's {name.toLowerCase()} here.
    </p>
  </div>
);

import { Toaster } from 'sonner';

// --- Main App ---

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="skus" element={<SKUs />} />
          <Route path="ingredients" element={<Ingredients />} />
          <Route path="production" element={<Production />} />
          <Route path="crews" element={<Crews />} />
          <Route path="branches" element={<Branches />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="journals" element={<JournalEntries />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="inventory-planning" element={<InventoryPlanning />} />
          <Route path="quality-control" element={<QualityControl />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="ingredient-categories" element={<IngredientCategories />} />
          <Route path="user-access" element={<UserAccess />} />
          <Route path="sql-exports" element={<SqlExports />} />
          
          {/* Fallback */}
          <Route path="*" element={<PlaceholderPage name="404 - Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
