import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SuperAdminShell, StatCard } from '../../components/superadmin/SuperAdminShell';
import { Pagination, paginate } from '../../components/superadmin/Pagination';
import { api } from '../../services/api';
import { useNavigation } from '../../context/NavigationContext';
import { ComplianceMatrixCell, BillingInvoice, AuditLogEntry, OrgAlert } from '../../mockData/mockStore';

const AUDIT_PAGE_SIZE = 5;

export default function LocationDetail({ id }: { id?: number }) {
  const [summary, setSummary] = useState<any>(null);
  const [matrix, setMatrix] = useState<ComplianceMatrixCell[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [audit, setAudit] = useState<AuditLogEntry[]>([]);
  const [alerts, setAlerts] = useState<OrgAlert[]>([]);
  const [adherence, setAdherence] = useState<any>(null);
  const [staff, setStaff] = useState<any>(null);
  const [auditPage, setAuditPage] = useState(1);
  const { setCurrentPage } = useNavigation();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.getLocationSummary(id),
      api.getComplianceMatrix(),
      api.getInvoices(),
      api.getAuditLog({ locationId: id }),
      api.getOrgAlerts(id),
      api.getMedicationAdherence(id),
      api.getStaffSummary(id)
    ]).then(([s, m, inv, a, al, ad, st]) => {
      setSummary(s); setMatrix(m); setInvoices(inv); setAudit(a); setAlerts(al); setAdherence(ad); setStaff(st);
    });
  }, [id]);

  if (!id || !summary) return <SuperAdminShell title="Location" active="Locations"><div className="text-gray-500">Loading…</div></SuperAdminShell>;

  const loc = summary.location;
  const siteMatrix = matrix.filter(c => c.locationId === id);
  const siteInvoices = invoices.filter(i => i.locationId === id).slice(0, 5);
  const cellClass = (status: string) => status === 'green' ? 'bg-emerald-50 text-emerald-700' : status === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';

  return (
    <SuperAdminShell
      title={loc.name}
      subtitle={`${loc.region} · ${loc.address} · read-only oversight view`}
      active="Locations"
      actions={
        <button onClick={() => setCurrentPage('org-locations')} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg">
          <ArrowLeft size={14} /> Back
        </button>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Service Users" value={summary.serviceUsers} tone="green" />
        <StatCard label="Staff"         value={summary.staff}         tone="blue" />
        <StatCard label="Open Alerts"   value={summary.openAlerts}    tone="red" />
        <StatCard label="Compliance"    value={`${summary.complianceScore}%`} tone="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Site info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Item label="Manager"    value={loc.manager} />
            <Item label="Capacity"   value={`${loc.occupancy}/${loc.capacity}`} />
            <Item label="Timezone"   value={loc.timezone} />
            <Item label="Opened"     value={loc.openedAt} />
            <Item label="Status"     value={loc.status} />
            <Item label="Staff mix"  value={staff ? `${staff.active} active · ${staff.onLeave} on leave` : '—'} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Medication adherence</h2>
          {adherence ? (
            <>
              <div className="text-3xl font-bold text-gray-900">{adherence.rate}%</div>
              <div className="text-xs text-gray-500 mt-1">{adherence.administered} of {adherence.total} doses administered · {adherence.missed} missed</div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-emerald-500" style={{ width: `${adherence.rate}%` }} />
              </div>
            </>
          ) : <div className="text-sm text-gray-500">Loading…</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Compliance breakdown</h2>
          <div className="space-y-2">
            {siteMatrix.map(c => (
              <div key={c.area} className="flex items-center justify-between p-2.5 border border-gray-100 rounded-lg">
                <div>
                  <div className="text-sm text-gray-900">{c.area}</div>
                  <div className="text-[11px] text-gray-500">Last reviewed {c.lastReviewed}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${cellClass(c.status)}`}>{c.score}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Open alerts</h2>
          <div className="space-y-2">
            {alerts.filter(a => !a.acknowledged).length === 0 && <div className="text-sm text-gray-500">No open alerts.</div>}
            {alerts.filter(a => !a.acknowledged).map(a => (
              <div key={a.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">{a.title}</div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${a.severity === 'critical' ? 'bg-red-50 text-red-700' : a.severity === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{a.severity}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{a.description}</div>
                <div className="text-[11px] text-gray-400 mt-1">{a.category} · {a.raisedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Recent invoices</h2>
          <div className="space-y-2">
            {siteInvoices.length === 0 && <div className="text-sm text-gray-500">No invoices.</div>}
            {siteInvoices.map(i => (
              <div key={i.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <div className="text-sm text-gray-900">{i.period}</div>
                  <div className="text-[11px] text-gray-500">Due {i.dueAt}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-900">£{i.amount.toLocaleString()}</div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${i.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : i.status === 'overdue' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{i.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent activity</h2>
            <span className="text-xs text-gray-500">{audit.length} entries</span>
          </div>
          <div className="divide-y divide-gray-100">
            {audit.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No recent activity.</div>
            )}
            {paginate(audit, auditPage, AUDIT_PAGE_SIZE).map(e => (
              <div key={e.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-900 truncate">{e.actorName}</div>
                  <div className="text-[11px] text-gray-400 whitespace-nowrap">{e.at}</div>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{e.action} · {e.meta}</div>
              </div>
            ))}
          </div>
          <Pagination page={auditPage} pageSize={AUDIT_PAGE_SIZE} total={audit.length} onChange={setAuditPage} />
        </div>
      </div>
    </SuperAdminShell>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}
