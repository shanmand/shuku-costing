import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  FlaskConical, 
  Tags,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INGREDIENT_CATEGORIES, INGREDIENTS } from '../data/entities';

// --- Components ---

const CategoryRow = ({ category, ingredients, onEdit, onDelete }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr className={`hover:bg-secondary-cream/30 transition-colors group ${isExpanded ? 'bg-secondary-cream/20' : ''}`}>
        <td className="px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-cream flex items-center justify-center text-amber-honey">
              <Tags size={20} />
            </div>
            <div>
              <p className="font-bold text-charcoal text-sm">{category.name}</p>
              <p className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest mt-0.5">ID: {category.id}</p>
            </div>
          </div>
        </td>
        <td className="px-8 py-6">
          <p className="text-sm text-charcoal/60 max-w-xs truncate">{category.description}</p>
        </td>
        <td className="px-8 py-6">
          {category.isAllergenCategory ? (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded uppercase tracking-widest flex items-center gap-1 w-fit">
              <AlertCircle size={10} /> Allergen
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded uppercase tracking-widest w-fit">
              Standard
            </span>
          )}
        </td>
        <td className="px-8 py-6 text-center">
          <span className="text-sm font-black text-charcoal">{ingredients.length}</span>
        </td>
        <td className="px-8 py-6 text-right">
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-charcoal/20 hover:text-amber-honey hover:bg-white rounded-lg transition-all"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button 
              onClick={() => onEdit(category)}
              className="p-2 text-charcoal/20 hover:text-blue-500 hover:bg-white rounded-lg transition-all"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(category.id)}
              className="p-2 text-charcoal/20 hover:text-red-500 hover:bg-white rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="px-8 py-0 bg-secondary-cream/10">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-6 space-y-4">
                  <h4 className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Ingredients in this category</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ingredients.map((ing: any) => (
                      <div key={ing.id} className="bg-white p-4 rounded-xl border border-charcoal/5 shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary-cream flex items-center justify-center text-charcoal/40">
                          <FlaskConical size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-charcoal">{ing.name}</p>
                          <p className="text-[10px] font-medium text-charcoal/40 uppercase tracking-widest">Stock: {ing.currentStock} {ing.unit}</p>
                        </div>
                      </div>
                    ))}
                    {ingredients.length === 0 && (
                      <p className="text-xs text-charcoal/40 italic p-4">No ingredients linked to this category yet.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Main Page ---

export default function IngredientCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', isAllergenCategory: false });

  const filteredCategories = useMemo(() => {
    return INGREDIENT_CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save category
    setIsModalOpen(false);
    setFormData({ name: '', description: '', isAllergenCategory: false });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight uppercase">Ingredient Categories</h1>
          <p className="text-charcoal/50 font-medium">Organise your raw materials and manage allergen groups</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-charcoal text-warm-cream px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-charcoal/90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} className="text-amber-honey" />
          NEW CATEGORY
        </button>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={20} />
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20 transition-all font-medium"
        />
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
              <th className="px-8 py-5">Category Name</th>
              <th className="px-8 py-5">Description</th>
              <th className="px-8 py-5">Allergen Status</th>
              <th className="px-8 py-5 text-center">Ingredient Count</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {filteredCategories.map((cat) => (
              <CategoryRow 
                key={cat.id} 
                category={cat} 
                ingredients={INGREDIENTS.filter(ing => ing.categoryId === cat.id)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* New Category Modal */}
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
                  <h2 className="text-xl font-black text-charcoal uppercase tracking-tight">New Category</h2>
                  <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest mt-1">Define ingredient group</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-charcoal/5 rounded-xl transition-colors">
                  <XCircle size={24} className="text-charcoal/20" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Category Name</label>
                  <input 
                    required
                    type="text"
                    className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20"
                    placeholder="e.g. Flours, Sweeteners"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full p-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20"
                    placeholder="Briefly describe the category..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-cream/30 rounded-2xl border border-charcoal/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.isAllergenCategory ? 'bg-red-500 text-white' : 'bg-charcoal/10 text-charcoal/40'}`}>
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal uppercase tracking-tight">Allergen Category</p>
                      <p className="text-[10px] text-charcoal/40 font-medium">Flag all ingredients as allergens</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isAllergenCategory: !formData.isAllergenCategory })}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isAllergenCategory ? 'bg-red-500' : 'bg-charcoal/20'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isAllergenCategory ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <button className="w-full py-4 bg-charcoal text-amber-honey rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} />
                  Create Category
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
