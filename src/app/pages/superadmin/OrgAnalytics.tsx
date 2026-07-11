import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { SuperAdminShell, StatCard } from '../../components/superadmin/SuperAdminShell';
import { api } from '../../services/api';
import { Location } from '../../mockData/mockStore';

type Point = { month: string; value: number };
type Trend = { direction: 'up' | 'down' | 'flat'; delta: number };

function computeTrend(data: Point[]): Trend {
  if (data.length < 2) return { direction: 'flat', delta: 0 };
  const first = data[0].value;
  const last = data[data.length - 1].value;
  if (first === 0) return { direction: 'flat', delta: 0 };
  const delta = Math.round(((last - first) / first) * 100);
  return { direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat', delta };
}

function TrendPill({ trend, invertColor = false }: { trend: Trend; invertColor?: boolean }) {
  const positive = invertColor ? trend.direction === 'down' : trend.direction === 'up';
  const negative = invertColor ? trend.direction === 'up' : trend.direction === 'down';
  const cls = positive ? 'bg-emerald-50 text-emerald-700' : negative ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600';
  const Icon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${cls}`}>
      <Icon size={12} /> {trend.delta > 0 ? '+' : ''}{trend.delta}%
    </span>
  );
}

function ChartCard({
  title, subtitle, children, trend, invertColor
}: {
  title: string; subtitle?: string; children: React.ReactNode; trend?: Trend; invertColor?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {trend && <TrendPill trend={trend} invertColor={invertColor} />}
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children as any}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function OrgAnalytics() {
  const [range, setRange] = useState('6m');
  const [analytics, setAnalytics] = useState<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [byLocation, setByLocation] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any>(null);
  const [recruitment, setRecruitment] = useState<any>(null);
  const [carePlans, setCarePlans] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [suSummary, setSuSummary] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.getOrgAnalytics(range),
      api.getLocations(),
      api.getFinancialByLocation(range),
      api.getIncidentsSummary('all', range),
      api.getRecruitmentSummary(),
      api.getCarePlanReviewStatus('all'),
      api.getAttendanceSummary('all', range),
      api.getServiceUsersSummary('all')
    ]).then(([a, l, byLoc, inc, rec, cp, att, su]) => {
      setAnalytics(a); setLocations(l); setByLocation(byLoc);
      setIncidents(inc); setRecruitment(rec); setCarePlans(cp);
      setAttendance(att); setSuSummary(su);
    });
  }, [range]);

  if (!analytics) {
    return (
      <SuperAdminShell title="Org Analytics" active="Org Analytics">
        <div className="text-gray-500">Loading…</div>
      </SuperAdminShell>
    );
  }

  const occTrend  = computeTrend(analytics.occupancyTrend);
  const incTrend  = computeTrend(analytics.incidentsTrend);
  const turnTrend = computeTrend(analytics.staffTurnover);
  const medTrend  = computeTrend(analytics.medicationAdherence);

  const last = (arr: Point[]) => arr[arr.length - 1]?.value ?? 0;

  const revenueByLocation = byLocation.map(l => ({ name: l.locationName, revenue: l.revenue, outstanding: l.outstanding }));

  const riskBreakdown = suSummary ? [
    { name: 'Green', value: suSummary.green, color: '#10B981' },
    { name: 'Amber', value: suSummary.amber, color: '#F59E0B' },
    { name: 'Red',   value: suSummary.red,   color: '#EF4444' }
  ] : [];

  const incidentSeverity = incidents ? [
    { name: 'Critical', value: incidents.critical, color: '#EF4444' },
    { name: 'Moderate', value: incidents.moderate, color: '#F59E0B' },
    { name: 'Minor',    value: incidents.minor,    color: '#3B82F6' }
  ] : [];

  const attendanceMix = attendance ? [
    { name: 'On time', value: attendance.onTime, color: '#10B981' },
    { name: 'Late',    value: attendance.late,   color: '#F59E0B' },
    { name: 'Absent',  value: attendance.absent, color: '#EF4444' }
  ] : [];

  return (
    <SuperAdminShell
      title="Org Analytics"
      subtitle="Trends and cross-site comparison across the organisation"
      active="Org Analytics"
      actions={
        <select value={range} onChange={e => setRange(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white/70 text-gray-600 focus:outline-none focus:border-blue-400 transition-colors">
          {['3m', '6m', '12m'].map(r => <option key={r} value={r}>Last {r.toUpperCase()}</option>)}
        </select>
      }
    >

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Occupancy"           value={`${last(analytics.occupancyTrend)}%`}  hint={`${occTrend.delta >= 0 ? '+' : ''}${occTrend.delta}% vs start`} tone="blue" />
        <StatCard label="Incidents / month"   value={last(analytics.incidentsTrend)}         hint={`${incTrend.delta >= 0 ? '+' : ''}${incTrend.delta}% vs start`} tone="red" />
        <StatCard label="Staff turnover"      value={last(analytics.staffTurnover)}          hint={`${turnTrend.delta >= 0 ? '+' : ''}${turnTrend.delta}% vs start`} tone="amber" />
        <StatCard label="Med adherence"       value={`${last(analytics.medicationAdherence)}%`} hint={`${medTrend.delta >= 0 ? '+' : ''}${medTrend.delta}% vs start`} tone="green" />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Occupancy %" subtitle="Average across all sites" trend={occTrend}>
          <AreaChart data={analytics.occupancyTrend}>
            <defs>
              <linearGradient id="occFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#1D4ED8" strokeWidth={2} fill="url(#occFill)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Incidents" subtitle="Reported per month" trend={incTrend} invertColor>
          <LineChart data={analytics.incidentsTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Staff turnover" subtitle="Leavers per month" trend={turnTrend} invertColor>
          <BarChart data={analytics.staffTurnover}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Medication adherence" subtitle="Doses administered on time" trend={medTrend}>
          <LineChart data={analytics.medicationAdherence}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>
      </div>

      {/* Revenue by location */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Revenue by location</h3>
            <p className="text-xs text-gray-500 mt-0.5">Revenue vs outstanding for the selected period</p>
          </div>
          <div className="text-xs text-gray-500">{locations.length} sites</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByLocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `£${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue"     name="Revenue"     fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outstanding" name="Outstanding" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Composition strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <CompositionCard title="Service users by risk"   items={riskBreakdown} />
        <CompositionCard title="Incidents by severity"   items={incidentSeverity} />
        <CompositionCard title="Attendance mix (today)"  items={attendanceMix} />
      </div>

      {/* Bottom summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Recruitment pipeline</h3>
          {recruitment && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Metric label="Open roles"          value={recruitment.openRoles} />
              <Metric label="Applicants"          value={recruitment.applicants} />
              <Metric label="Interviews / week"   value={recruitment.interviewsThisWeek} />
              <Metric label="Rejected"            value={recruitment.rejected} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Care plan review status</h3>
          {carePlans && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <Metric label="Up to date" value={carePlans.upToDate} tone="green" />
              <Metric label="Due soon"   value={carePlans.dueSoon}  tone="amber" />
              <Metric label="Overdue"    value={carePlans.overdue}  tone="red" />
            </div>
          )}
        </div>
      </div>
    </SuperAdminShell>
  );
}

function CompositionCard({ title, items }: { title: string; items: { name: string; value: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 mb-4">
        {items.map(i => (
          <div key={i.name} style={{ width: `${(i.value / total) * 100}%`, backgroundColor: i.color }} />
        ))}
      </div>
      <div className="space-y-2">
        {items.map(i => (
          <div key={i.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: i.color }} />
              <span className="text-gray-700">{i.name}</span>
            </div>
            <div className="text-gray-900 font-medium">{i.value} <span className="text-xs text-gray-500">({Math.round((i.value / total) * 100)}%)</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, tone = 'blue' }: { label: string; value: number; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  const tones: Record<string, string> = {
    blue: 'text-blue-700',
    green: 'text-emerald-700',
    amber: 'text-amber-700',
    red: 'text-red-700'
  };
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-2xl font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
