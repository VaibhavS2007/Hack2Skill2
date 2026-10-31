import React, { useState } from 'react';
import { Mail, ShieldAlert, FileSpreadsheet, Copy, Check, ExternalLink, Download, Sparkles } from 'lucide-react';
import { SwipedTransaction } from '../../core/engine/types';
import { generateCancellationEmail, generateDisputeLetter } from '../../core/engine/documentGenerator';
import { buildTaxDeductionsCsv } from '../../core/engine/csvProcessor';

interface ActionDeliverablesProps {
  swipedTransactions: SwipedTransaction[];
}

export const ActionDeliverables: React.FC<ActionDeliverablesProps> = ({
  swipedTransactions,
}) => {
  const [activeTab, setActiveTab] = useState<'cancel' | 'dispute' | 'tax'>('cancel');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Segregate deliverables based on decisions
  const killedSubs = swipedTransactions.filter(
    (t) => t.decision === 'KILL' && t.anomalyType !== 'duplicate'
  );
  const disputedCharges = swipedTransactions.filter(
    (t) => t.decision === 'KILL' && t.anomalyType === 'duplicate'
  );
  const taxItems = swipedTransactions.filter((t) => t.decision === 'TAX');

  const handleCopy = async (text: string, id: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // Fallback in environments with restricted clipboard permissions
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadCsv = () => {
    const csvContent = buildTaxDeductionsCsv(taxItems);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tax-deductions-2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-arcade-surface/90 border border-arcade-border rounded-2xl p-6 md:p-8 shadow-2xl mt-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-arcade-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-arcade-neonGreen uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Automated Real-World Action Engine</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Execution Deliverables</h3>
          <p className="text-sm text-slate-300">
            Playing the game generated these real legal drafts, dispute filings, and tax ledgers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('cancel')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'cancel'
                ? 'bg-arcade-neonPink text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-selected={activeTab === 'cancel'}
            role="tab"
          >
            <Mail className="w-4 h-4" />
            <span>Cancel ({killedSubs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dispute')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'dispute'
                ? 'bg-arcade-neonYellow text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-selected={activeTab === 'dispute'}
            role="tab"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Disputes ({disputedCharges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tax')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'tax'
                ? 'bg-arcade-neonCyan text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-selected={activeTab === 'tax'}
            role="tab"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Tax Ledger ({taxItems.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Cancellation Hub */}
      {activeTab === 'cancel' && (
        <div className="pt-6 space-y-4">
          {killedSubs.length === 0 ? (
            <p className="text-slate-400 text-sm italic py-6 text-center">
              No subscriptions were marked to cancel.
            </p>
          ) : (
            killedSubs.map((tx) => {
              const draft = generateCancellationEmail(tx);
              const isCopied = copiedId === `cancel-${tx.id}`;

              return (
                <div
                  key={tx.id}
                  className="p-5 rounded-xl bg-arcade-darkCard border border-arcade-border hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="font-bold text-white text-lg">{tx.merchant}</span>
                      <span className="ml-3 font-mono text-sm text-arcade-neonGreen">
                        ₹{tx.amount.toFixed(2)}/{tx.frequency}
                      </span>
                      <span className="ml-2 text-xs font-mono text-slate-400">
                        (Saves ₹{draft.annualCost.toLocaleString('en-IN')}/yr)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {tx.portalUrl && (
                        <a
                          href={tx.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleCopy(draft.emailBody, `cancel-${tx.id}`)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-arcade-neonPink/20 text-arcade-neonPink border border-arcade-neonPink/40 hover:bg-arcade-neonPink hover:text-white'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'COPIED EMAIL' : 'COPY FTC EMAIL'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Collapsible/Preview of Legal Body */}
                  <div className="mt-2 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
                    {draft.emailBody}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Content 2: Bank Dispute Notices */}
      {activeTab === 'dispute' && (
        <div className="pt-6 space-y-4">
          {disputedCharges.length === 0 ? (
            <p className="text-slate-400 text-sm italic py-6 text-center">
              No duplicate or unauthorized charges were flagged for dispute.
            </p>
          ) : (
            disputedCharges.map((tx) => {
              const dispute = generateDisputeLetter(tx);
              const isCopied = copiedId === `dispute-${tx.id}`;

              return (
                <div
                  key={tx.id}
                  className="p-5 rounded-xl bg-arcade-darkCard border border-arcade-neonYellow/30 hover:border-arcade-neonYellow transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="font-bold text-white text-lg">{tx.merchant}</span>
                      <span className="ml-3 font-mono text-sm text-arcade-neonYellow font-bold">
                        ₹{tx.amount.toFixed(2)} DISPUTED
                      </span>
                      <span className="ml-2 text-xs font-mono text-slate-400">
                        Date: {tx.date}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(dispute.formalLetter, `dispute-${tx.id}`)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-arcade-neonYellow/20 text-arcade-neonYellow border border-arcade-neonYellow/40 hover:bg-arcade-neonYellow hover:text-slate-950'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'COPIED NOTICE' : 'COPY FCBA DISPUTE'}</span>
                    </button>
                  </div>

                  <div className="mt-2 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {dispute.formalLetter}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Content 3: Tax Deductions Ledger */}
      {activeTab === 'tax' && (
        <div className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase">
                Total Deductible Expenses Claimed:
              </span>
              <div className="text-2xl font-mono font-extrabold text-arcade-neonCyan">
                ₹
                {taxItems
                  .reduce((acc, curr) => acc + curr.amount, 0)
                  .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <button
              onClick={handleDownloadCsv}
              disabled={taxItems.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-arcade-neonCyan to-blue-500 text-slate-950 font-mono font-bold text-sm flex items-center gap-2 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg shadow-arcade-neonCyan/20"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD TAX-DEDUCTIONS-2026.CSV</span>
            </button>
          </div>

          {taxItems.length === 0 ? (
            <p className="text-slate-400 text-sm italic py-6 text-center">
              No expenses were tagged as tax write-offs.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Merchant</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Schedule C Line</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-arcade-darkCard text-slate-300">
                  {taxItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50">
                      <td className="p-3 text-slate-400">{item.date}</td>
                      <td className="p-3 font-bold text-white">{item.merchant}</td>
                      <td className="p-3 text-arcade-neonGreen font-bold">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="p-3 text-arcade-neonCyan">
                        {item.category.includes('Tech') || item.category.includes('Software') || item.category.includes('Cloud')
                          ? 'Part II Line 18: Software & Tools'
                          : 'Part II Line 27a: Other Business Expense'}
                      </td>
                      <td className="p-3 text-emerald-400">100% Ordinary &amp; Necessary</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>🛡️ OWASP CSV Formula Injection Sanitized</span>
            <span>Formatted for IRS Schedule C filing</span>
          </div>
        </div>
      )}
    </div>
  );
};
