import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  User,
  Building2,
  RefreshCw,
  MoreVertical,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { JOURNAL_ENTRIES, BRANCHES } from '../data/entities';

// --- Helpers ---

const formatCurrency = (value: number) => {
  return 'R' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace(/,/g, ' ');
};

// --- Types ---

type JournalStatus = 'Draft' | 'Pending Approval' | 'Posted' | 'Rejected';

interface JournalLine {
  accountCode: string;
  accountName: string;
  costCenter: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  date: string;
  period: string;
  description: string;
  status: JournalStatus;
  preparedBy: string;
  approvedBy?: string;
  postedDate?: string;
  lines: JournalLine[];
}

// --- Components ---

const Badge = ({ children, color = 'gray' }: { children: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${colors[color]}`}>
      {children}
    </span>
  );
};

const JournalDetail = ({ journal, onBack }: { journal: JournalEntry, onBack: () => void }) => {
  const totalDebit = journal.lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = journal.lines.reduce((sum, line) => sum + line.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal font-bold text-sm transition-colors"
        >
          <ArrowLeft size={18} />
          BACK TO JOURNALS
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-secondary-cream transition-colors">
            <Printer size={16} />
            PRINT PDF
          </button>
          <button className="px-4 py-2 bg-amber-honey text-charcoal rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-amber-600 transition-colors shadow-sm">
            <Download size={16} />
            EXPORT CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-charcoal/5 rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-charcoal/5">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Journal ID</p>
              <p className="text-xl font-black text-charcoal">{journal.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Status</p>
              <Badge color={journal.status === 'Posted' ? 'green' : journal.status === 'Draft' ? 'amber' : 'blue'}>
                {journal.status}
              </Badge>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Period / Date</p>
              <p className="text-sm font-bold text-charcoal flex items-center gap-2">
                <Calendar size={14} className="text-amber-honey" />
                {journal.period} — {journal.date}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Prepared By</p>
              <p className="text-sm font-bold text-charcoal flex items-center gap-2">
                <User size={14} className="text-amber-honey" />
                {journal.preparedBy}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Description</p>
              <p className="text-sm font-medium text-charcoal/70 leading-relaxed italic">
                "{journal.description}"
              </p>
            </div>
            {journal.approvedBy && (
              <div>
                <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Approved By</p>
                <p className="text-sm font-bold text-charcoal flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-600" />
                  {journal.approvedBy}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden border border-charcoal/5 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
                <th className="px-6 py-4">Account Code</th>
                <th className="px-6 py-4">Account Name</th>
                <th className="px-6 py-4">Cost Centre (Branch)</th>
                <th className="px-6 py-4 text-right">Debit (ZAR)</th>
                <th className="px-6 py-4 text-right">Credit (ZAR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {journal.lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-secondary-cream/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-charcoal/60">{line.accountCode}</td>
                  <td className="px-6 py-4 font-bold text-charcoal text-sm">{line.accountName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-charcoal/60">
                      <Building2 size={12} />
                      {line.costCenter}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-charcoal">
                    {line.debit > 0 ? formatCurrency(line.debit) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-charcoal">
                    {line.credit > 0 ? formatCurrency(line.credit) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-charcoal text-warm-cream">
                <td colSpan={3} className="px-6 py-4 font-bold text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                    TOTALS
                    {isBalanced ? (
                      <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">
                        <CheckCircle2 size={10} /> BALANCED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                        <AlertCircle size={10} /> UNBALANCED
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-black">
                  {formatCurrency(totalDebit)}
                </td>
                <td className="px-6 py-4 text-right font-black">
                  {formatCurrency(totalCredit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const GenerateJournalsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [period, setPeriod] = useState('2026-03');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Month-end journals generated! (Mock)');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-charcoal/5 bg-charcoal text-warm-cream">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <RefreshCw size={24} className="text-amber-honey" />
            Generate Month-End
          </h3>
          <p className="text-warm-cream/60 text-xs mt-1 uppercase tracking-widest">IFRS Compliance Engine</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Select Accounting Period</label>
            <input 
              type="month" 
              className="w-full px-4 py-3 bg-secondary-cream border border-charcoal/5 rounded-xl focus:ring-2 focus:ring-amber-honey outline-none font-bold"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </div>

          <div className="bg-amber-honey/10 border border-amber-honey/20 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} />
              Process Scope
            </h4>
            <ul className="text-xs text-charcoal/70 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-amber-honey rounded-full" />
                IAS 2 Inventory Consumption
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-amber-honey rounded-full" />
                Labour Allocation (WIP)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-amber-honey rounded-full" />
                Overhead Absorption
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-amber-honey rounded-full" />
                COGS Recognition
              </li>
            </ul>
          </div>

          <p className="text-[10px] text-charcoal/40 italic text-center">
            System will scan all production batches and stage records for {period}.
          </p>
        </div>

        <div className="p-6 bg-secondary-cream border-t border-charcoal/5 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 text-charcoal/60 font-bold hover:bg-charcoal/5 rounded-xl transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 px-6 py-3 bg-charcoal text-warm-cream font-bold rounded-xl hover:bg-charcoal/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                PROCESSING...
              </>
            ) : (
              'GENERATE JOURNALS'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function JournalEntries() {
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const journals = useMemo(() => {
    // Map entities data to our component type
    return JOURNAL_ENTRIES.map(je => ({
      ...je,
      status: je.status as JournalStatus,
      lines: je.lines.map(l => ({
        accountCode: l.accountCode,
        accountName: l.accountName,
        costCenter: l.costCenter,
        debit: l.debit,
        credit: l.credit
      }))
    }));
  }, []);

  const filteredJournals = journals.filter(j => 
    j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: JournalStatus) => {
    switch (status) {
      case 'Draft': return 'amber';
      case 'Pending Approval': return 'blue';
      case 'Posted': return 'green';
      case 'Rejected': return 'red';
      default: return 'gray';
    }
  };

  if (selectedJournal) {
    return <JournalDetail journal={selectedJournal} onBack={() => setSelectedJournal(null)} />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight uppercase">Accounting Journals</h1>
          <p className="text-charcoal/50 font-medium">IFRS-compliant month-end manufacturing accounting</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsGenerateModalOpen(true)}
            className="bg-white border border-charcoal/10 text-charcoal px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary-cream transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={20} className="text-amber-honey" />
            AUTO-GENERATE
          </button>
          <button className="bg-charcoal text-warm-cream px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-charcoal/90 transition-all shadow-lg active:scale-95">
            <Plus size={20} className="text-amber-honey" />
            NEW JOURNAL
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-charcoal/5 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={20} />
          <input 
            type="text" 
            placeholder="Search by ID or description..." 
            className="w-full pl-12 pr-4 py-3 bg-secondary-cream border-none rounded-xl focus:ring-2 focus:ring-amber-honey outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 bg-secondary-cream text-charcoal/60 rounded-xl font-bold flex items-center gap-2 hover:bg-charcoal/5 transition-colors">
            <Filter size={18} />
            FILTERS
          </button>
          <button className="px-4 py-3 bg-secondary-cream text-charcoal/60 rounded-xl font-bold flex items-center gap-2 hover:bg-charcoal/5 transition-colors">
            <Download size={18} />
            EXPORT ALL
          </button>
        </div>
      </div>

      {/* Journal Table */}
      <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-cream text-[10px] font-bold text-charcoal/40 uppercase tracking-widest border-b border-charcoal/5">
              <th className="px-6 py-4">Journal ID</th>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Total Debit</th>
              <th className="px-6 py-4 text-right">Total Credit</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Prepared By</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {filteredJournals.map((journal) => {
              const totalDebit = journal.lines.reduce((sum, line) => sum + line.debit, 0);
              const totalCredit = journal.lines.reduce((sum, line) => sum + line.credit, 0);
              return (
                <tr 
                  key={journal.id} 
                  className="hover:bg-secondary-cream/30 transition-colors cursor-pointer group"
                  onClick={() => setSelectedJournal(journal)}
                >
                  <td className="px-6 py-4 font-mono text-xs font-bold text-charcoal/60">{journal.id}</td>
                  <td className="px-6 py-4 font-bold text-charcoal text-sm">{journal.period}</td>
                  <td className="px-6 py-4 text-sm text-charcoal/60">{journal.date}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-charcoal truncate max-w-[200px]">{journal.description}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-charcoal">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-charcoal">
                    {formatCurrency(totalCredit)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={getStatusColor(journal.status)}>{journal.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-charcoal/60">
                      <User size={12} />
                      {journal.preparedBy}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-charcoal/20 group-hover:text-amber-honey transition-colors">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredJournals.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-secondary-cream rounded-full flex items-center justify-center mx-auto">
              <FileText className="text-charcoal/20" size={32} />
            </div>
            <p className="text-charcoal/40 font-medium">No journals found matching your search.</p>
          </div>
        )}
      </div>

      <GenerateJournalsModal 
        isOpen={isGenerateModalOpen} 
        onClose={() => setIsGenerateModalOpen(false)} 
      />
    </div>
  );
}
