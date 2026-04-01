import React, { useState, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Info, 
  History, 
  FileText, 
  Package as PackageIcon, 
  ArrowLeft,
  Edit3,
  Clock,
  Thermometer,
  Percent,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { 
  RECIPES, 
  INGREDIENTS, 
  BRANCHES, 
  INGREDIENT_CATEGORIES
} from '../data/entities';
import { 
  Branch, 
  Ingredient, 
  Recipe, 
  RecipeStage 
} from '../types/entities';
import { ensureArray } from '../utils/safeData';

// --- Constants ---

const STAGES = [
  'Stores', 'Staging', 'Mixing', 'Weighing/Dividing', 'Proving', 
  'Baking', 'Cooling', 'Toppings', 'Packaging', 'Storage', 'Distribution'
];

const RECIPE_STATUSES = ['Draft', 'Active', 'Superseded', 'Archived'];

const RECIPE_CATEGORIES = ['Bread', 'Rolls', 'Pastry', 'Cake', 'Cookies', 'Other'];

// --- Helpers ---

const formatCurrency = (value: number) => {
  return 'R' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace(/,/g, ' ');
};

// --- Custom Icons ---

const Building2Icon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
);

const getIngredientCost = (ingredientId: string) => {
  const ingredient = (INGREDIENTS || []).find(i => i.id === ingredientId);
  return ingredient?.standardCost || 0;
};

// --- Components ---

const Recipes = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'bom' | 'history'>('bom');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    version: '1.0',
    code: '',
    category: '',
    status: 'Draft',
    yieldUnits: 0,
    yieldUnit: 'Units',
    yieldWeight: 0,
    mixTime: 0,
    provingTime: 0,
    bakingTemp: 0,
    bakingTime: 0,
    coolingTime: 0,
    expectedWaste: 0,
    branchId: (BRANCHES || [])[0]?.id || '',
    packagingItems: [] as any[],
    bomLines: [] as any[]
  });

  const handleEditRecipe = (recipe: typeof RECIPES[0]) => {
    setFormData({
      name: recipe.name,
      version: recipe.version,
      code: recipe.id, // Using ID as code for now
      category: recipe.category || '',
      status: recipe.status || 'Active',
      yieldUnits: recipe.yieldUnits,
      yieldUnit: recipe.yieldUnit || 'Units',
      yieldWeight: recipe.yieldWeight,
      mixTime: recipe.mixTime || 0,
      provingTime: recipe.provingTime || 0,
      bakingTemp: recipe.bakingTemp || 0,
      bakingTime: recipe.bakingTime || 0,
      coolingTime: recipe.coolingTime || 0,
      expectedWaste: recipe.expectedWaste || 0,
      branchId: recipe.branchId,
      packagingItems: ensureArray<any>(recipe.packagingItems).map(item => ({
        ...item,
        id: (item as any).id || Math.random().toString(),
        cost: (item as any).cost || 0.5
      })),
      bomLines: ensureArray<RecipeStage>(recipe.stages).flatMap(stage => 
        ensureArray<any>(stage.ingredients).map(ing => ({
          id: Math.random().toString(),
          stage: stage.name,
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit
        }))
      )
    });
    setIsFormOpen(true);
  };

  const filteredRecipes = useMemo(() => {
    return ensureArray<Recipe>(RECIPES).filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedRecipe = useMemo(() => {
    return ensureArray<Recipe>(RECIPES).find(r => r.id === selectedRecipeId) || null;
  }, [selectedRecipeId]);

  const calculateTotals = (recipe: typeof RECIPES[0]) => {
    let materialTotal = 0;
    ensureArray<RecipeStage>(recipe.stages).forEach(stage => {
      ensureArray<any>(stage.ingredients).forEach(ing => {
        materialTotal += ing.quantity * getIngredientCost(ing.ingredientId);
      });
    });

    const packagingTotal = ensureArray<any>(recipe.packagingItems).reduce((acc, item) => acc + (item.quantity * 0.5), 0);
    const grandTotal = materialTotal + packagingTotal;
    const costPerUnit = grandTotal / recipe.yieldUnits;

    return { materialTotal, packagingTotal, grandTotal, costPerUnit };
  };

  const handleAddPackagingItem = () => {
    setFormData(prev => ({
      ...prev,
      packagingItems: [
        ...prev.packagingItems,
        { id: Math.random().toString(), name: 'New Packaging Item', quantity: 1, unit: 'pcs', cost: 0.5 }
      ]
    }));
  };

  const handleRemovePackagingItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      packagingItems: prev.packagingItems.filter(item => item.id !== id)
    }));
  };

  const handleAddBomLine = () => {
    setFormData(prev => ({
      ...prev,
      bomLines: [
        ...prev.bomLines,
        { id: Math.random().toString(), stage: STAGES[0], ingredientId: INGREDIENTS[0]?.id || '', quantity: 0, unit: 'kg' }
      ]
    }));
  };

  const handleRemoveBomLine = (id: string) => {
    setFormData(prev => ({
      ...prev,
      bomLines: prev.bomLines.filter(line => line.id !== id)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Recipes & Bills of Materials</h2>
          <p className="text-charcoal/60 text-sm">Manage your bakery production formulas and standard costs.</p>
        </div>
          <button 
            onClick={() => {
              setFormData({
                name: '',
                version: '1.0',
                code: '',
                category: '',
                status: 'Draft',
                yieldUnits: 0,
                yieldUnit: 'Units',
                yieldWeight: 0,
                mixTime: 0,
                provingTime: 0,
                bakingTemp: 0,
                bakingTime: 0,
                coolingTime: 0,
                expectedWaste: 0,
                branchId: ensureArray<Branch>(BRANCHES)[0]?.id || '',
                packagingItems: [],
                bomLines: []
              });
              setIsFormOpen(true);
            }}
            className="bg-amber-honey text-charcoal px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-600 transition-colors shadow-sm"
          >
          <Plus size={20} />
          New Recipe
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Recipe List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
            <input 
              type="text" 
              placeholder="Search recipes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-honey/50 transition-all"
            />
          </div>

          <div className="bg-white rounded-lg border border-charcoal/5 shadow-sm overflow-hidden">
            {ensureArray<Recipe>(filteredRecipes).map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipeId(recipe.id)}
                className={`w-full text-left p-4 border-b border-charcoal/5 flex items-center justify-between transition-colors
                  ${selectedRecipeId === recipe.id ? 'bg-secondary-cream border-l-4 border-l-amber-honey' : 'hover:bg-warm-cream'}
                `}
              >
                <div>
                  <h4 className="font-bold text-charcoal">{recipe.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold bg-charcoal/5 px-2 py-0.5 rounded text-charcoal/60 uppercase tracking-wider">
                      v{recipe.version}
                    </span>
                    <span className="text-xs text-charcoal/40">
                      {ensureArray<Branch>(BRANCHES).find(b => b.id === recipe.branchId)?.name.split('(')[0]}
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className={selectedRecipeId === recipe.id ? 'text-amber-honey' : 'text-charcoal/20'} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Recipe Detail */}
        <div className="lg:col-span-8">
          {selectedRecipe ? (
            <div className="bg-white rounded-lg border border-charcoal/5 shadow-sm overflow-hidden">
              {/* Detail Header */}
              <div className="p-6 border-b border-charcoal/5 bg-secondary-cream/30">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-bold text-charcoal">{selectedRecipe.name}</h3>
                      <span className="bg-amber-honey/20 text-amber-900 text-xs font-bold px-2 py-1 rounded">
                        Version {selectedRecipe.version}
                      </span>
                    </div>
                    <p className="text-charcoal/60 text-sm flex items-center gap-2">
                      <Building2Icon size={14} />
                      {ensureArray<Branch>(BRANCHES).find(b => b.id === selectedRecipe.branchId)?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditRecipe(selectedRecipe)}
                      className="p-2 text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 rounded-lg transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button className="p-2 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white p-3 rounded-lg border border-charcoal/5">
                    <p className="text-[10px] uppercase font-bold text-charcoal/40 mb-1">Yield</p>
                    <p className="text-lg font-bold text-charcoal">{selectedRecipe.yieldUnits} {selectedRecipe.yieldUnit || 'Units'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-charcoal/5">
                    <p className="text-[10px] uppercase font-bold text-charcoal/40 mb-1">Yield Weight</p>
                    <p className="text-lg font-bold text-charcoal">{selectedRecipe.yieldWeight} kg</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-charcoal/5">
                    <p className="text-[10px] uppercase font-bold text-charcoal/40 mb-1">Expected Waste</p>
                    <p className="text-lg font-bold text-charcoal">{selectedRecipe.expectedWaste || 0}%</p>
                  </div>
                  <div className="bg-amber-honey p-3 rounded-lg shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-charcoal/60 mb-1">Cost Per Unit</p>
                    <p className="text-lg font-bold text-charcoal">{formatCurrency(calculateTotals(selectedRecipe).costPerUnit)}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-charcoal/5">
                <button 
                  onClick={() => setActiveTab('bom')}
                  className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-colors
                    ${activeTab === 'bom' ? 'text-amber-honey border-b-2 border-amber-honey' : 'text-charcoal/40 hover:text-charcoal'}
                  `}
                >
                  <FileText size={18} />
                  Bill of Materials
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-colors
                    ${activeTab === 'history' ? 'text-amber-honey border-b-2 border-amber-honey' : 'text-charcoal/40 hover:text-charcoal'}
                  `}
                >
                  <History size={18} />
                  Change History
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'bom' ? (
                  <div className="space-y-8">
                    {/* BOM per Stage */}
                    <div className="space-y-6">
                      {ensureArray<RecipeStage>(selectedRecipe.stages).map((stage, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-charcoal text-warm-cream flex items-center justify-center text-[10px] font-bold">
                              {sIdx + 1}
                            </div>
                            <h4 className="font-bold text-charcoal uppercase tracking-wider text-xs">{stage.name}</h4>
                          </div>
                          
                          {ensureArray<any>(stage.ingredients).length > 0 ? (
                            <div className="overflow-hidden rounded-lg border border-charcoal/5">
                              <table className="w-full text-sm text-left">
                                <thead className="bg-secondary-cream/50 text-charcoal/60 text-[10px] uppercase font-bold">
                                  <tr>
                                    <th className="px-4 py-2">Ingredient</th>
                                    <th className="px-4 py-2 text-right">Qty</th>
                                    <th className="px-4 py-2">Unit</th>
                                    <th className="px-4 py-2 text-right">Std Cost</th>
                                    <th className="px-4 py-2 text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ensureArray<any>(stage.ingredients).map((ing, iIdx) => {
                                    const ingredient = ensureArray<Ingredient>(INGREDIENTS).find(i => i.id === ing.ingredientId);
                                    const cost = ingredient?.standardCost || 0;
                                    const total = ing.quantity * cost;
                                    return (
                                      <tr key={iIdx} className="border-t border-charcoal/5 hover:bg-warm-cream transition-colors">
                                        <td className="px-4 py-3 font-medium text-charcoal">{ingredient?.name}</td>
                                        <td className="px-4 py-3 text-right font-mono">{ing.quantity}</td>
                                        <td className="px-4 py-3 text-charcoal/60">{ing.unit}</td>
                                        <td className="px-4 py-3 text-right text-charcoal/60">{formatCurrency(cost)}</td>
                                        <td className="px-4 py-3 text-right font-bold text-charcoal">{formatCurrency(total)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-xs text-charcoal/30 italic px-8">No ingredients added to this stage.</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Packaging Section */}
                    <div className="space-y-4 pt-6 border-t border-charcoal/5">
                      <div className="flex items-center gap-2">
                        <PackageIcon size={18} className="text-amber-honey" />
                        <h4 className="font-bold text-charcoal uppercase tracking-wider text-xs">Packaging Items</h4>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-charcoal/5">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-secondary-cream/50 text-charcoal/60 text-[10px] uppercase font-bold">
                            <tr>
                              <th className="px-4 py-2">Item Name</th>
                              <th className="px-4 py-2 text-right">Qty / Batch</th>
                              <th className="px-4 py-2">Unit</th>
                              <th className="px-4 py-2 text-right">Cost / Unit</th>
                              <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ensureArray<any>(selectedRecipe.packagingItems).map((item, idx) => (
                              <tr key={idx} className="border-t border-charcoal/5 hover:bg-warm-cream transition-colors">
                                <td className="px-4 py-3 font-medium text-charcoal">{item.name}</td>
                                <td className="px-4 py-3 text-right font-mono">{item.quantity}</td>
                                <td className="px-4 py-3 text-charcoal/60">{item.unit}</td>
                                <td className="px-4 py-3 text-right text-charcoal/60">{formatCurrency(item.cost || 0.5)}</td>
                                <td className="px-4 py-3 text-right font-bold text-charcoal">{formatCurrency(item.quantity * (item.cost || 0.5))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Totals Summary */}
                    <div className="bg-charcoal p-6 rounded-xl text-warm-cream mt-8 shadow-lg">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-warm-cream/40 mb-1">Material Total</p>
                          <p className="text-xl font-bold">{formatCurrency(calculateTotals(selectedRecipe).materialTotal)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-warm-cream/40 mb-1">Packaging Total</p>
                          <p className="text-xl font-bold">{formatCurrency(calculateTotals(selectedRecipe).packagingTotal)}</p>
                        </div>
                        <div className="lg:col-span-2 text-right border-l border-white/10 pl-8">
                          <p className="text-[10px] uppercase font-bold text-amber-honey mb-1">Grand Total Standard Cost</p>
                          <p className="text-3xl font-bold text-amber-honey">{formatCurrency(calculateTotals(selectedRecipe).grandTotal)}</p>
                          <p className="text-xs text-warm-cream/40 mt-1">Calculated per batch of {selectedRecipe.yieldUnits} units</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-lg border border-charcoal/5">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-secondary-cream/50 text-charcoal/60 text-[10px] uppercase font-bold">
                          <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Field Changed</th>
                            <th className="px-4 py-3">Old Value</th>
                            <th className="px-4 py-3">New Value</th>
                            <th className="px-4 py-3">Changed By</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-charcoal/5">
                            <td className="px-4 py-4 text-charcoal/60">2026-03-25 14:20</td>
                            <td className="px-4 py-4 font-medium">Yield Weight</td>
                            <td className="px-4 py-4 text-red-600">75 kg</td>
                            <td className="px-4 py-4 text-green-600 font-bold">80 kg</td>
                            <td className="px-4 py-4">Thabo Mokoena</td>
                          </tr>
                          <tr className="border-t border-charcoal/5 bg-warm-cream/30">
                            <td className="px-4 py-4 text-charcoal/60">2026-03-20 09:15</td>
                            <td className="px-4 py-4 font-medium">Yeast Qty (Mixing)</td>
                            <td className="px-4 py-4 text-red-600">0.75 kg</td>
                            <td className="px-4 py-4 text-green-600 font-bold">0.8 kg</td>
                            <td className="px-4 py-4">Thabo Mokoena</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-lg border border-charcoal/5 border-dashed flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-secondary-cream rounded-full flex items-center justify-center mb-4">
                <Info className="text-amber-honey" size={32} />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-2">No Recipe Selected</h3>
              <p className="text-charcoal/40 max-w-xs">
                Select a recipe from the list on the left to view its detailed Bill of Materials and cost breakdown.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-warm-cream w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-charcoal text-warm-cream flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Create New Recipe</h3>
                <p className="text-warm-cream/40 text-xs mt-1 uppercase tracking-widest font-bold">BOM Builder v1.0</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider border-b border-charcoal/5 pb-2">1. Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Recipe Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Sourdough Loaf" 
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Version</label>
                    <input 
                      type="text" 
                      value={formData.version}
                      onChange={(e) => setFormData({...formData, version: e.target.value})}
                      placeholder="1.0" 
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Code <span className="text-red-500">*</span></label>
                    <select 
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none bg-white"
                    >
                      <option value="">Select Code/Type</option>
                      {RECIPE_CATEGORIES.map(cat => <option key={cat} value={cat.toLowerCase()}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Category</label>
                    <input 
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="e.g. Artisanal" 
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none bg-white"
                    >
                      {RECIPE_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Branch</label>
                    <select 
                      value={formData.branchId}
                      onChange={(e) => setFormData({...formData, branchId: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none bg-white"
                    >
                      {ensureArray<Branch>(BRANCHES).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Yield & Production Section */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider border-b border-charcoal/5 pb-2">2. Yield & Production Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Yield Quantity</label>
                    <input 
                      type="number" 
                      value={formData.yieldUnits}
                      onChange={(e) => setFormData({...formData, yieldUnits: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Yield Unit</label>
                    <input 
                      type="text" 
                      value={formData.yieldUnit}
                      onChange={(e) => setFormData({...formData, yieldUnit: e.target.value})}
                      placeholder="Units" 
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Yield Weight (kg)</label>
                    <input 
                      type="number" 
                      value={formData.yieldWeight}
                      onChange={(e) => setFormData({...formData, yieldWeight: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60">Expected Waste (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={formData.expectedWaste}
                        onChange={(e) => setFormData({...formData, expectedWaste: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none pr-10" 
                      />
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/20" size={14} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60 flex items-center gap-1">
                      <Clock size={12} /> Mix Time (min)
                    </label>
                    <input 
                      type="number" 
                      value={formData.mixTime}
                      onChange={(e) => setFormData({...formData, mixTime: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60 flex items-center gap-1">
                      <Clock size={12} /> Proving (min)
                    </label>
                    <input 
                      type="number" 
                      value={formData.provingTime}
                      onChange={(e) => setFormData({...formData, provingTime: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60 flex items-center gap-1">
                      <Thermometer size={12} /> Baking Temp (°C)
                    </label>
                    <input 
                      type="number" 
                      value={formData.bakingTemp}
                      onChange={(e) => setFormData({...formData, bakingTemp: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60 flex items-center gap-1">
                      <Clock size={12} /> Baking (min)
                    </label>
                    <input 
                      type="number" 
                      value={formData.bakingTime}
                      onChange={(e) => setFormData({...formData, bakingTime: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-charcoal/60 flex items-center gap-1">
                      <Clock size={12} /> Cooling (min)
                    </label>
                    <input 
                      type="number" 
                      value={formData.coolingTime}
                      onChange={(e) => setFormData({...formData, coolingTime: Number(e.target.value)})}
                      className="w-full px-4 py-2 rounded-lg border border-charcoal/10 focus:ring-2 focus:ring-amber-honey/50 outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* BOM Builder Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-charcoal/5 pb-2">
                  <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider">3. Ingredient BOM Builder</h4>
                  <button 
                    onClick={handleAddBomLine}
                    className="text-amber-honey text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Row
                  </button>
                </div>
                <div className="space-y-3">
                  {ensureArray<any>(formData.bomLines).map((line) => (
                    <div key={line.id} className="grid grid-cols-12 gap-3 items-end bg-white p-3 rounded-lg border border-charcoal/5 shadow-sm">
                      <div className="col-span-3 space-y-1">
                        <label className="text-[9px] uppercase font-bold text-charcoal/40">Stage</label>
                        <select 
                          value={line.stage}
                          onChange={(e) => {
                            const newLines = ensureArray<any>(formData.bomLines).map(l => l.id === line.id ? {...l, stage: e.target.value} : l);
                            setFormData({...formData, bomLines: newLines});
                          }}
                          className="w-full px-2 py-1.5 text-sm rounded border border-charcoal/10 outline-none bg-white"
                        >
                          {ensureArray<string>(STAGES).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-span-4 space-y-1">
                        <label className="text-[9px] uppercase font-bold text-charcoal/40">Ingredient</label>
                        <select 
                          value={line.ingredientId}
                          onChange={(e) => {
                            const newLines = ensureArray<any>(formData.bomLines).map(l => l.id === line.id ? {...l, ingredientId: e.target.value} : l);
                            setFormData({...formData, bomLines: newLines});
                          }}
                          className="w-full px-2 py-1.5 text-sm rounded border border-charcoal/10 outline-none bg-white"
                        >
                          {ensureArray<Ingredient>(INGREDIENTS).map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] uppercase font-bold text-charcoal/40">Qty</label>
                        <input 
                          type="number" 
                          value={line.quantity}
                          onChange={(e) => {
                            const newLines = ensureArray<any>(formData.bomLines).map(l => l.id === line.id ? {...l, quantity: Number(e.target.value)} : l);
                            setFormData({...formData, bomLines: newLines});
                          }}
                          className="w-full px-2 py-1.5 text-sm rounded border border-charcoal/10 outline-none" 
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] uppercase font-bold text-charcoal/40">Unit</label>
                        <input type="text" disabled className="w-full px-2 py-1.5 text-sm rounded border border-charcoal/10 bg-charcoal/5 text-charcoal/40" value={ensureArray<Ingredient>(INGREDIENTS).find(ing => ing.id === line.ingredientId)?.unit || 'kg'} />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button 
                          onClick={() => handleRemoveBomLine(line.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {ensureArray<any>(formData.bomLines).length === 0 && (
                    <p className="text-xs text-charcoal/30 italic py-4 text-center bg-white rounded-lg border border-dashed border-charcoal/10">
                      No ingredients added yet. Click "+ Add Row" to begin.
                    </p>
                  )}
                </div>
              </div>

              {/* Packaging Builder Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-charcoal/5 pb-2">
                  <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider">4. Packaging Items</h4>
                  <button 
                    onClick={handleAddPackagingItem}
                    className="text-amber-honey text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ensureArray<any>(formData.packagingItems).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-charcoal/5 shadow-sm flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <input 
                          type="text" 
                          value={item.name}
                          onChange={(e) => {
                            const newItems = ensureArray<any>(formData.packagingItems).map(i => i.id === item.id ? {...i, name: e.target.value} : i);
                            setFormData({...formData, packagingItems: newItems});
                          }}
                          className="text-sm font-bold bg-transparent border-b border-transparent focus:border-amber-honey outline-none w-full"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = ensureArray<any>(formData.packagingItems).map(i => i.id === item.id ? {...i, quantity: Number(e.target.value)} : i);
                              setFormData({...formData, packagingItems: newItems});
                            }}
                            className="text-xs text-charcoal/40 bg-transparent border-b border-transparent focus:border-amber-honey outline-none w-12"
                          />
                          <span className="text-xs text-charcoal/40">units @ R{(item.cost || 0.5).toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemovePackagingItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {ensureArray<any>(formData.packagingItems).length === 0 && (
                    <p className="text-xs text-charcoal/30 italic col-span-2 py-4 text-center bg-white rounded-lg border border-dashed border-charcoal/10">
                      No packaging items added yet. Click "+ Add Item" to begin.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-secondary-cream border-t border-charcoal/5 flex justify-between items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] uppercase font-bold text-charcoal/40">Est. Total Cost:</span>
                <span className="text-xl font-bold text-charcoal">R0.00</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 text-charcoal/60 font-bold hover:text-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    toast.success('Recipe saved successfully (Mock)');
                    setIsFormOpen(false);
                  }}
                  className="bg-charcoal text-warm-cream px-8 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                >
                  <Save size={20} />
                  Save Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Custom Icons ---

export default Recipes;
