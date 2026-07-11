import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { SuperAdminShell } from '../../components/superadmin/SuperAdminShell';
import { api } from '../../services/api';
import { Organisation } from '../../mockData/mockStore';

export default function OrgSettings() {
  const [org, setOrg] = useState<Organisation | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.getOrganisation().then(setOrg); }, []);

  const save = async () => {
    if (!org) return;
    setSaving(true);
    const updated = await api.updateOrganisation(org);
    setOrg(updated);
    setSaving(false);
  };

  if (!org) return <SuperAdminShell title="Org Settings" active="Org Settings"><div className="text-gray-500">Loading…</div></SuperAdminShell>;

  return (
    <SuperAdminShell
      title="Org Settings"
      subtitle="Organisation profile, plan, and data retention"
      active="Org Settings"
      actions={
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
          <Save size={14} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Profile</h2>
          <Field label="Organisation name"  value={org.name}         onChange={v => setOrg({ ...org, name: v })}         placeholder="e.g. MpoweredCare Group" />
          <Field label="Billing email"      value={org.billingEmail} onChange={v => setOrg({ ...org, billingEmail: v })} placeholder="e.g. billing@yourorg.com" />
          <Field label="Registered address" value={org.address}      onChange={v => setOrg({ ...org, address: v })}      placeholder="e.g. 25 Kingsway, London, WC2B 6LE" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Plan & retention</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Plan</label>
            <select value={org.plan} onChange={e => setOrg({ ...org, plan: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-gray-700 text-sm focus:outline-none focus:border-blue-400 transition-colors">
              {['Starter', 'Growth', 'Enterprise'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Data retention (years)</label>
            <input type="number" value={org.dataRetentionYears} onChange={e => setOrg({ ...org, dataRetentionYears: Number(e.target.value) })}
              placeholder="e.g. 7"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">SSO</label>
            <div className="text-sm text-gray-500">Contact support to enable SSO for your organisation.</div>
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
      />
    </div>
  );
}
