import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { SuperAdminShell } from '../../components/superadmin/SuperAdminShell';
import { Pagination, paginate } from '../../components/superadmin/Pagination';
import { api } from '../../services/api';
import { AuditLogEntry, Location } from '../../mockData/mockStore';

const PAGE_SIZE = 10;

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [action, setAction] = useState('');
  const [locationId, setLocationId] = useState<number | ''>('');
  const [page, setPage] = useState(1);

  const load = () => api.getAuditLog({
    action: action || undefined,
    locationId: locationId === '' ? undefined : Number(locationId)
  }).then(data => { setEntries(data); setPage(1); });

  useEffect(() => { api.getLocations().then(setLocations); }, []);
  useEffect(() => { load(); }, [action, locationId]);

  const doExport = async () => {
    await api.exportAuditLog({ action, locationId });
    alert('Audit log export queued.');
  };

  const visible = paginate(entries, page, PAGE_SIZE);

  return (
    <SuperAdminShell
      title="Audit Log"
      subtitle="Immutable stream of admin & clinical actions across the org"
      active="Audit Log"
      actions={
        <button onClick={doExport} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          <Download size={14} /> Export
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-3">
        <input
          placeholder="Filter by action, e.g. medication.updated…"
          value={action}
          onChange={e => setAction(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white/70 flex-1 min-w-[200px] placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
        <select
          value={locationId}
          onChange={e => setLocationId(e.target.value === '' ? '' : Number(e.target.value))}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white/70 text-gray-600 focus:outline-none focus:border-blue-400 transition-colors">
          <option value="">All locations</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">When</th>
                <th className="text-left px-5 py-3">Actor</th>
                <th className="text-left px-5 py-3">Action</th>
                <th className="text-left px-5 py-3">Entity</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Detail</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(e => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{e.at}</td>
                  <td className="px-5 py-3 text-gray-900">{e.actorName}</td>
                  <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">{e.action}</span></td>
                  <td className="px-5 py-3 text-gray-700">{e.entityType} #{e.entityId}</td>
                  <td className="px-5 py-3 text-gray-700">{e.locationId ? locations.find(l => l.id === e.locationId)?.name ?? '—' : '—'}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{e.meta}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No entries match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={PAGE_SIZE} total={entries.length} onChange={setPage} />
      </div>
    </SuperAdminShell>
  );
}
