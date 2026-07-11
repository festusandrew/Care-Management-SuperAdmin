import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { SuperAdminShell, StatCard } from '../../components/superadmin/SuperAdminShell';
import { Pagination, paginate } from '../../components/superadmin/Pagination';
import { api } from '../../services/api';
import { BillingInvoice } from '../../mockData/mockStore';

const RANGES = ['30d', '90d', '6m', 'ytd', '12m'];
const PAGE_SIZE = 10;

export default function ConsolidatedFinancials() {
  const [range, setRange] = useState('90d');
  const [summary, setSummary] = useState<any>(null);
  const [byLocation, setByLocation] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [invoicePage, setInvoicePage] = useState(1);

  const load = () => Promise.all([
    api.getFinancialSummary('all', range),
    api.getFinancialByLocation(range),
    api.getInvoices(),
    api.getPayouts(range)
  ]).then(([s, l, i, p]) => {
    setSummary(s); setByLocation(l); setInvoices(i); setPayouts(p);
    setInvoicePage(1);
  });

  useEffect(() => { load(); }, [range]);

  const exportCsv = async () => {
    await api.exportFinancialReport({ range });
    alert('Report queued for export.');
  };

  const visibleInvoices = paginate(invoices, invoicePage, PAGE_SIZE);

  return (
    <SuperAdminShell
      title="Consolidated Financials"
      subtitle="Revenue, invoices, and payouts across the organisation"
      active="Consolidated Financials"
      actions={
        <div className="flex items-center gap-2">
          <select value={range} onChange={e => setRange(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white/70 text-gray-600 focus:outline-none focus:border-blue-400 transition-colors">
            {RANGES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
          </select>
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><Download size={14} /> Export</button>
        </div>
      }
    >
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Revenue"     value={`£${summary.revenue.toLocaleString()}`}     tone="green" />
          <StatCard label="Outstanding" value={`£${summary.outstanding.toLocaleString()}`} tone="amber" />
          <StatCard label="Overdue"     value={`£${summary.overdue.toLocaleString()}`}     tone="red" />
          <StatCard label="Invoices"    value={summary.count}                               tone="blue" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">By location</h2>
          <div className="space-y-3">
            {byLocation.map(l => (
              <div key={l.locationId} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="text-sm text-gray-900">{l.locationName}</div>
                <div className="text-xs text-gray-500">Rev <b className="text-gray-900">£{l.revenue.toLocaleString()}</b> · Out <b className="text-amber-700">£{l.outstanding.toLocaleString()}</b></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Payouts</h2>
          <div className="space-y-2 text-sm">
            {payouts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <div className="text-gray-900 font-medium">{p.period}</div>
                  <div className="text-xs text-gray-500">Staff £{p.staffCosts.toLocaleString()} · Agency £{p.agencyCosts.toLocaleString()} · Other £{p.other.toLocaleString()}</div>
                </div>
                <div className="text-sm font-semibold text-gray-900">£{(p.staffCosts + p.agencyCosts + p.other).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Invoices</h2>
          <span className="text-xs text-gray-500">{invoices.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">Period</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Due</th>
                <th className="text-left px-5 py-3">Paid</th>
              </tr>
            </thead>
            <tbody>
              {visibleInvoices.map(inv => (
                <tr key={inv.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 text-gray-900">{inv.period}</td>
                  <td className="px-5 py-3 text-gray-700">{inv.locationName}</td>
                  <td className="px-5 py-3 text-gray-900">£{inv.amount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : inv.status === 'overdue' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{inv.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{inv.dueAt}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{inv.paidAt ?? '—'}</td>
                </tr>
              ))}
              {visibleInvoices.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={invoicePage} pageSize={PAGE_SIZE} total={invoices.length} onChange={setInvoicePage} />
      </div>
    </SuperAdminShell>
  );
}
