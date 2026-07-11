import { useState } from 'react';
import { Modal } from '../Modal';
import { api } from '../../services/api';

export function AddLocationModal({ show, onClose, onCreated }: { show: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: '', region: '', address: '', timezone: 'Europe/London',
    capacity: 20, occupancy: 0, status: 'active' as 'active' | 'paused' | 'closed',
    manager: '', openedAt: new Date().toISOString().slice(0, 10)
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    await api.addLocation(form);
    setSaving(false);
    onCreated();
  };

  return (
    <Modal isOpen={show} onClose={onClose} title="Add location" size="md">
      <div className="space-y-4">
        <Row><Label>Name</Label><Input value={form.name}    onChange={v => setForm({ ...form, name: v })}    placeholder="e.g. Riverside House" /></Row>
        <Row><Label>Region</Label><Input value={form.region}  onChange={v => setForm({ ...form, region: v })}  placeholder="e.g. London" /></Row>
        <Row><Label>Address</Label><Input value={form.address} onChange={v => setForm({ ...form, address: v })} placeholder="e.g. 14 Riverside Rd, London" /></Row>
        <Row><Label>Manager</Label><Input value={form.manager} onChange={v => setForm({ ...form, manager: v })} placeholder="e.g. Dr. Emily Carter" /></Row>
        <div className="grid grid-cols-2 gap-4">
          <Row><Label>Capacity</Label><Input type="number" value={String(form.capacity)} onChange={v => setForm({ ...form, capacity: Number(v) })} placeholder="e.g. 20" /></Row>
          <Row><Label>Occupancy</Label><Input type="number" value={String(form.occupancy)} onChange={v => setForm({ ...form, occupancy: Number(v) })} placeholder="e.g. 0" /></Row>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Row>
            <Label>Status</Label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </Row>
          <Row><Label>Timezone</Label><Input value={form.timezone} onChange={v => setForm({ ...form, timezone: v })} placeholder="e.g. Europe/London" /></Row>
        </div>
        <Row><Label>Opened Date</Label><Input type="date" value={form.openedAt} onChange={v => setForm({ ...form, openedAt: v })} /></Row>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={submit} disabled={saving || !form.name} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Creating…' : 'Create location'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const Row = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const Label = ({ children }: { children: React.ReactNode }) => <label className="block text-xs text-gray-500 mb-1">{children}</label>;
const Input = ({ value, onChange, type = 'text', placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
);
