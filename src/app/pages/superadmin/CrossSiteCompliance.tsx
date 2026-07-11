import { useEffect, useState } from 'react';
import { SuperAdminShell, StatCard } from '../../components/superadmin/SuperAdminShell';
import { Pagination, paginate } from '../../components/superadmin/Pagination';
import { api } from '../../services/api';
import { ComplianceMatrixCell, Location } from '../../mockData/mockStore';

const MATRIX_PAGE_SIZE = 5;
const EXPIRING_PAGE_SIZE = 5;

export default function CrossSiteCompliance() {
  const [matrix, setMatrix] = useState<ComplianceMatrixCell[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [expiring, setExpiring] = useState<any[]>([]);
  const [matrixPage, setMatrixPage] = useState(1);
  const [expiringPage, setExpiringPage] = useState(1);

  useEffect(() => {
    Promise.all([
      api.getComplianceMatrix(),
      api.getLocations(),
      api.getComplianceSummary('all'),
      api.getExpiringCompliance(30)
    ]).then(([m, l, s, e]) => { setMatrix(m); setLocations(l); setSummary(s); setExpiring(e); });
  }, []);

  const areas = Array.from(new Set(matrix.map(m => m.area)));
  const cellFor = (locId: number, area: string) => matrix.find(m => m.locationId === locId && m.area === area);
  const cellClass = (status: string) => status === 'green' ? 'bg-emerald-50 text-emerald-700' : status === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';

  const visibleLocations = paginate(locations, matrixPage, MATRIX_PAGE_SIZE);
  const visibleExpiring = paginate(expiring, expiringPage, EXPIRING_PAGE_SIZE);

  return (
    <SuperAdminShell title="Cross-Site Compliance" subtitle="RAG status across every location and area" active="Cross-Site Compliance">
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Average score" value={`${summary.averageScore}%`} tone="blue" />
          <StatCard label="Green"         value={summary.green}  tone="green" />
          <StatCard label="Amber"         value={summary.amber}  tone="amber" />
          <StatCard label="Red"           value={summary.red}    tone="red" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Compliance matrix</h2>
          <span className="text-xs text-gray-500">{locations.length} locations</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">Location</th>
                {areas.map(a => <th key={a} className="text-left px-5 py-3">{a}</th>)}
              </tr>
            </thead>
            <tbody>
              {visibleLocations.map(loc => (
                <tr key={loc.id} className="border-t border-gray-100">
                  <td className="px-5 py-3">
                    <div className="text-gray-900 font-medium">{loc.name}</div>
                    <div className="text-xs text-gray-500">{loc.region}</div>
                  </td>
                  {areas.map(area => {
                    const c = cellFor(loc.id, area);
                    if (!c) return <td key={area} className="px-5 py-3 text-gray-400">—</td>;
                    return (
                      <td key={area} className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${cellClass(c.status)}`}>{c.score}%</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={matrixPage} pageSize={MATRIX_PAGE_SIZE} total={locations.length} onChange={setMatrixPage} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Expiring within 30 days</h2>
          <span className="text-xs text-gray-500">{expiring.length} items</span>
        </div>
        <div className="divide-y divide-gray-100">
          {visibleExpiring.map((e, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div>
                <div className="text-sm text-gray-900">{e.area}</div>
                <div className="text-xs text-gray-500">{locations.find(l => l.id === e.locationId)?.name}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${e.status === 'red' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                  {e.status}
                </span>
                <div className="text-xs text-gray-500 text-right">
                  <div>In {e.expiresIn}d</div>
                  <div className="text-gray-400">reviewed {e.lastReviewed}</div>
                </div>
              </div>
            </div>
          ))}
          {visibleExpiring.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No expiring items.</div>
          )}
        </div>
        <Pagination page={expiringPage} pageSize={EXPIRING_PAGE_SIZE} total={expiring.length} onChange={setExpiringPage} />
      </div>
    </SuperAdminShell>
  );
}
