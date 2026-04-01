import React, { useState, useMemo } from 'react';
import { 
  Users as UsersIcon, 
  ShieldCheck, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Mail, 
  UserCog, 
  Lock, 
  Eye, 
  EyeOff,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { USERS, USER_ROLES, BRANCHES } from '../data/entities';

// --- Constants ---

const MODULES = [
  'Dashboard', 'Recipes', 'SKUs', 'Ingredients', 'Production', 'Crews', 
  'Branches', 'Transfers', 'Journals', 'Compliance', 'Analytics', 
  'Inventory Planning', 'QC', 'Suppliers', 'Categories', 'User Access', 'SQL Exports'
];

const PERMISSION_LEVELS = [
  { label: 'None', value: 'none', color: 'bg-gray-100 text-gray-400' },
  { label: 'Read Only', value: 'read', color: 'bg-blue-100 text-blue-600' },
  { label: 'Read & Write', value: 'readwrite', color: 'bg-green-100 text-green-600' }
];

// --- Components ---

const PermissionsMatrix = ({ role, onUpdate }: any) => {
  return (
    <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
            <th className="px-8 py-5">Module</th>
            {PERMISSION_LEVELS.map(level => (
              <th key={level.value} className="px-8 py-5 text-center">{level.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal/5">
          {MODULES.map(module => {
            const moduleKey = module.toLowerCase().replace(/\s+/g, '');
            const currentLevel = role.permissions[moduleKey] || 'none';

            return (
              <tr key={module} className="hover:bg-secondary-cream/30 transition-colors">
                <td className="px-8 py-4">
                  <p className="text-sm font-bold text-charcoal">{module}</p>
                </td>
                {PERMISSION_LEVELS.map(level => (
                  <td key={level.value} className="px-8 py-4 text-center">
                    <button 
                      onClick={() => onUpdate(moduleKey, level.value)}
                      className={`w-6 h-6 rounded-full border-2 transition-all relative flex items-center justify-center ${
                        currentLevel === level.value 
                          ? 'border-amber-honey bg-amber-honey' 
                          : 'border-charcoal/10 hover:border-amber-honey/40'
                      }`}
                    >
                      {currentLevel === level.value && <div className="w-2 h-2 rounded-full bg-charcoal" />}
                    </button>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const RolesTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const handleRoleClick = (role: any) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-charcoal uppercase tracking-widest">System Roles & Permissions</h3>
        <button 
          onClick={() => { setSelectedRole(null); setIsModalOpen(true); }}
          className="bg-charcoal text-warm-cream px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-charcoal/90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} className="text-amber-honey" />
          NEW ROLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {USER_ROLES.map(role => (
          <div 
            key={role.id} 
            onClick={() => handleRoleClick(role)}
            className="bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-honey/10 flex items-center justify-center text-amber-honey">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[10px] font-bold text-charcoal/30 bg-secondary-cream px-2 py-1 rounded uppercase tracking-widest">
                {USERS.filter(u => u.roleId === role.id).length} Users
              </span>
            </div>
            <h4 className="text-lg font-black text-charcoal mb-2">{role.roleName}</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(role.permissions).slice(0, 4).map(([key, value]: any) => (
                <span key={key} className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                  value === 'readwrite' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {key}: {value === 'readwrite' ? 'RW' : 'R'}
                </span>
              ))}
              {Object.keys(role.permissions).length > 4 && (
                <span className="text-[9px] font-bold px-2 py-0.5 bg-gray-100 text-gray-400 rounded uppercase tracking-widest">
                  +{Object.keys(role.permissions).length - 4} More
                </span>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-charcoal/5 flex items-center justify-between text-amber-honey opacity-0 group-hover:opacity-100 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest">Edit Permissions</span>
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Role Editor Modal */}
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
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-charcoal/5 flex justify-between items-center bg-secondary-cream/30">
                <div>
                  <h2 className="text-xl font-black text-charcoal uppercase tracking-tight">
                    {selectedRole ? `Edit Role: ${selectedRole.roleName}` : 'New System Role'}
                  </h2>
                  <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest mt-1">Configure module access levels</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-charcoal/5 rounded-xl transition-colors">
                  <XCircle size={24} className="text-charcoal/20" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Role Name</label>
                  <input 
                    type="text"
                    className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20"
                    placeholder="e.g. Production Supervisor"
                    defaultValue={selectedRole?.roleName}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Permissions Matrix</h4>
                  <PermissionsMatrix 
                    role={selectedRole || { permissions: {} }} 
                    onUpdate={() => {}} 
                  />
                </div>
              </div>

              <div className="p-6 bg-secondary-cream border-t border-charcoal/5 flex gap-3">
                <button className="flex-1 py-4 bg-charcoal text-amber-honey rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} />
                  Save Role Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UsersTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return USERS.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={20} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20 transition-all font-medium"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-charcoal text-warm-cream px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-charcoal/90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} className="text-amber-honey" />
          ADD USER
        </button>
      </div>

      <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
              <th className="px-8 py-5">User</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Branch</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {filteredUsers.map(user => {
              const role = USER_ROLES.find(r => r.id === user.roleId);
              const branch = BRANCHES.find(b => b.id === user.branchId);
              return (
                <tr key={user.id} className="hover:bg-secondary-cream/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-cream flex items-center justify-center text-charcoal/40 font-bold text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-charcoal text-sm">{user.name}</p>
                        <p className="text-[10px] font-medium text-charcoal/40 lowercase tracking-tight">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase tracking-widest border border-blue-100">
                      {role?.roleName}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-charcoal/60">
                      <Building2 size={14} className="text-amber-honey" />
                      {branch?.name}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {user.isActive ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-red-600 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-charcoal/20 hover:text-blue-500 hover:bg-white rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-charcoal/20 hover:text-red-500 hover:bg-white rounded-lg transition-all">
                        <EyeOff size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New User Modal */}
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
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-charcoal/5 flex justify-between items-center bg-secondary-cream/30">
                <div>
                  <h2 className="text-xl font-black text-charcoal uppercase tracking-tight">Add New User</h2>
                  <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest mt-1">Grant system access</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-charcoal/5 rounded-xl transition-colors">
                  <XCircle size={24} className="text-charcoal/20" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text"
                    className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20"
                    placeholder="e.g. Lindiwe Dlamini"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email"
                    className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20"
                    placeholder="lindiwe@shuku.co.za"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Role</label>
                    <select className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-honey/20">
                      {USER_ROLES.map(role => <option key={role.id}>{role.roleName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Branch</label>
                    <select className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-honey/20">
                      {BRANCHES.map(branch => <option key={branch.id}>{branch.name}</option>)}
                    </select>
                  </div>
                </div>

                <button className="w-full py-4 bg-charcoal text-amber-honey rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} />
                  Create User Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page ---

export default function UserAccess() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight uppercase">User Access & Roles</h1>
          <p className="text-charcoal/50 font-medium">Manage system permissions and staff accounts</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 bg-secondary-cream p-1.5 rounded-2xl w-fit border border-charcoal/5">
        <button 
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'roles' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <ShieldCheck size={16} />
          ROLES & PERMISSIONS
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'users' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <UsersIcon size={16} />
          USER ACCOUNTS
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
          {activeTab === 'roles' ? <RolesTab /> : <UsersTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
