import { useEffect, useState } from 'react';
import { AlertTriangle, Building2 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { SuperAdminShell, StatCard } from '../../components/superadmin/SuperAdminShell';
import { Pagination, paginate } from '../../components/superadmin/Pagination';
import { api } from '../../services/api';
import { useNavigation } from '../../context/NavigationContext';
import { useTenant } from '../../context/TenantContext';

const LOCATION_PAGE_SIZE = 5;

export default function OrgOverview() {
  const [data, setData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [byLocation, setByLocation] = useState<any[]>([]);
  const [locationSummary, setLocationSummary] = useState<any>(null);
  const [locationPage, setLocationPage] = useState(1);
  const { setCurrentPage } = useNavigation();
  const { activeLocationId, accessibleLocations } = useTenant();

  const isFiltered = activeLocationId !== 'all';
  const activeLocation = isFiltered
    ? accessibleLocations.find(l => l.id === activeLocationId)
    : null;

  // Reload whenever the location selector changes
  useEffect(() => {
    let active = true;

    if (isFiltered) {
      // Single-location mode
      Promise.all([
        api.getLocationSummary(activeLocationId as number),
        api.getOrgAlerts(activeLocationId as number),
        api.getOrgAnalytics('6m'),
        api.getFinancialByLocation(),
      ]).then(([ls, a, an, bl]) => {
        if (!active) return;
        setLocationSummary(ls);
        setAlerts(a);
        setAnalytics(an);
        setByLocation(bl);
        setData(null); // clear org-wide data
        setLocationPage(1);
      });
    } else {
      // Org-wide mode
      Promise.all([
        api.getOrgOverview(),
        api.getOrgAlerts('all'),
        api.getOrgAnalytics('6m'),
        api.getFinancialByLocation(),
      ]).then(([o, a, an, bl]) => {
        if (!active) return;
        setData(o);
        setAlerts(a);
        setAnalytics(an);
        setByLocation(bl);
        setLocationSummary(null); // clear single-location data
        setLocationPage(1);
      });
    }

    return () => { active = false; };
  }, [activeLocationId]);

  // ── Single-location view ──────────────────────────────────────────────────
  if (isFiltered) {
    if (!locationSummary || !analytics) {
      return <SuperAdminShell title="Org Overview" active="Org Overview"><div className="text-gray-500">Loading…</div></SuperAdminShell>;
    }

    const loc = locationSummary.location;
    const occupancyPct = Math.round((loc.occupancy / loc.capacity) * 100);
    const siteRevenue = byLocation.find((b: any) => b.locationId === loc.id);

    return (
      <SuperAdminShell
        title={loc.name}
        subtitle={`${loc.region} · filtered view — switch to All Locations for org-wide data`}
        active="Org Overview"
      >
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Occupancy"      value={`${loc.occupancy}/${loc.capacity}`}                                          hint={`${occupancyPct}%`}       tone="blue" />
          <StatCard label="Service Users"  value={locationSummary.serviceUsers}                                                                                  tone="green" />
          <StatCard label="Staff"          value={locationSummary.staff}                                                                                         tone="blue" />
          <StatCard label="Open Alerts"    value={locationSummary.openAlerts}                                                                                    tone="red" />
          <StatCard label="Compliance"     value={`${locationSummary.complianceScore}%`}                                                                         tone="amber" />
          <StatCard label="Revenue"        value={siteRevenue ? `£${siteRevenue.revenue.toLocaleString()}` : '—'}                                               tone="green" />
          <StatCard label="Outstanding"    value={siteRevenue ? `£${siteRevenue.outstanding.toLocaleString()}` : '—'}                                           tone="amber" />
          <StatCard label="Status"         value={loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}                                                     tone="gray" />
        </div>

        {/* Occupancy bar + trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-1">Occupancy trend</h2>
            <p className="text-xs text-gray-500 mb-4">Org-wide proxy — site-level trend over last 6 months</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.occupancyTrend}>
                  <defs>
                    <linearGradient id="occGradSite" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} unit="%" />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Area type="monotone" dataKey="value" stroke="#1D4ED8" strokeWidth={2} fill="url(#occGradSite)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-1">Occupancy & compliance</h2>
            <p className="text-xs text-gray-500 mb-4">{loc.name} snapshot</p>
            <div className="space-y-4 mt-6">
              <Gauge label="Occupancy" value={occupancyPct} color="#1D4ED8" />
              <Gauge label="Compliance" value={locationSummary.complianceScore} color="#10B981" />
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" /> Open alerts for this site
          </h2>
          <div className="space-y-3">
            {alerts.filter(a => !a.acknowledged).map(a => (
              <div key={a.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900">{a.title}</div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${a.severity === 'critical' ? 'bg-red-50 text-red-700' : a.severity === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{a.severity}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{a.description}</div>
                <div className="text-[11px] text-gray-400 mt-1">{a.category} · {a.raisedAt}</div>
              </div>
            ))}
            {alerts.filter(a => !a.acknowledged).length === 0 && (
              <div className="text-sm text-gray-500">No open alerts for this site.</div>
            )}
          </div>
        </div>
      </SuperAdminShell>
    );
  }

  // ── Org-wide view ─────────────────────────────────────────────────────────
  if (!data || !analytics) {
    return <SuperAdminShell title="Org Overview" active="Org Overview"><div className="text-gray-500">Loading…</div></SuperAdminShell>;
  }

  const occupancyByLocation = data.perLocation
    .filter((l: any) => l.location.status !== 'closed')
    .slice(0, 7)
    .map((l: any) => ({
      name: l.location.name.split(' ')[0],
      Occupancy: Math.round((l.location.occupancy / l.location.capacity) * 100),
      Compliance: Number(l.complianceScore) || 0,
    }));

  return (
    <SuperAdminShell title="Org Overview" subtitle="Cross-location health at a glance" active="Org Overview">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Locations"        value={data.totalLocations}                     tone="blue" />
        <StatCard label="Service Users"    value={data.totalServiceUsers}                  tone="green" />
        <StatCard label="Staff"            value={data.totalStaff}                         tone="blue" />
        <StatCard label="Open Alerts"      value={data.openAlerts}                         tone="red" />
        <StatCard label="Compliance Avg"   value={`${data.complianceAverage}%`}            tone="amber" />
        <StatCard label="Revenue (period)" value={`£${data.revenue.toLocaleString()}`}     tone="green" />
        <StatCard label="Outstanding"      value={`£${data.outstanding.toLocaleString()}`} tone="amber" />
        <StatCard label="Top Risks"        value={data.topRisks.length}                    tone="red" />
      </div>

      {/* Row 1 — trend + per-site bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Occupancy trend</h2>
          <p className="text-xs text-gray-500 mb-4">Org-wide average over last 6 months</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.occupancyTrend}>
                <defs>
                  <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} unit="%" />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Area type="monotone" dataKey="value" stroke="#1D4ED8" strokeWidth={2} fill="url(#occGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Occupancy & compliance by site</h2>
          <p className="text-xs text-gray-500 mb-4">Current snapshot per location</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByLocation} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} unit="%" />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Occupancy"  fill="#1D4ED8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Compliance" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 — per-location list + top risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" /> Per-location health
            </h2>
            <button onClick={() => setCurrentPage('org-locations')} className="text-sm text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-100">
            {paginate(data.perLocation, locationPage, LOCATION_PAGE_SIZE).map((l: any) => (
              <div
                key={l.location.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => setCurrentPage('org-location-detail', { id: l.location.id })}
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{l.location.name}</div>
                  <div className="text-xs text-gray-500">{l.location.region} · {l.serviceUsers} SU · {l.staff} staff</div>
                  <div className="mt-1.5 h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((l.location.occupancy / l.location.capacity) * 100)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="text-gray-600">Compliance <b className="text-gray-900">{l.complianceScore}%</b></span>
                  <span className={`px-2 py-0.5 rounded-full ${l.openAlerts > 0 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{l.openAlerts} alerts</span>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={locationPage} pageSize={LOCATION_PAGE_SIZE} total={data.perLocation.length} onChange={setLocationPage} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" /> Top risks
          </h2>
          <div className="space-y-3">
            {alerts.filter(a => !a.acknowledged).slice(0, 5).map(a => (
              <div key={a.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900">{a.title}</div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${a.severity === 'critical' ? 'bg-red-50 text-red-700' : a.severity === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{a.severity}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{a.description}</div>
                <div className="text-[11px] text-gray-400 mt-1">{a.category} · {a.raisedAt}</div>
              </div>
            ))}
            {alerts.filter(a => !a.acknowledged).length === 0 && (
              <div className="text-sm text-gray-500">No open alerts.</div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
