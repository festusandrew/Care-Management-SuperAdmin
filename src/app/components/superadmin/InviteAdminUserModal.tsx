import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { api } from '../../services/api';
import { Role, Location, AdminUserStatus } from '../../mockData/mockStore';

export function InviteAdminUserModal({
  show, onClose, onCreated, roles, locations
}: {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
  roles: Role[];
  locations: Location[];
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<number>(roles[0]?.id ?? 0);
  const [scopeAll, setScopeAll] = useState(true);
  const [scopeIds, setScopeIds] = useState<number[]>([]);
  const [status, setStatus] = useState<AdminUserStatus>('invited');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      setName('');
      setEmail('');
      setRoleId(roles[0]?.id ?? 0);
      setScopeAll(true);
      setScopeIds([]);
      setStatus('invited');
    }
  }, [show, roles]);

  const toggleLoc = (id: number) => setScopeIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const submit = async () => {
    setSaving(true);
    await api.inviteAdminUser({
      name, email, roleId,
      locationScope: scopeAll ? 'all' : scopeIds,
      status
    });
    setSaving(false);
    onCreated();
  };

  return (
    <Modal isOpen={show} onClose={onClose} title="Invite admin user" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Full name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jane Smith" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. jane@mpoweredcare.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Role</label>
          <select value={roleId} onChange={e => setRoleId(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-gray-700 text-sm focus:outline-none focus:border-blue-400 transition-colors">
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as AdminUserStatus)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-gray-700 text-sm focus:outline-none focus:border-blue-400 transition-colors">
            <option value="invited">Invited</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2">Location scope</label>
          <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <input type="checkbox" checked={scopeAll} onChange={e => setScopeAll(e.target.checked)} /> All locations
          </label>
          {!scopeAll && (
            <div className="grid grid-cols-2 gap-2">
              {locations.map(l => (
                <label key={l.id} className="flex items-center gap-2 text-sm text-gray-700 p-2 border border-gray-100 rounded-lg">
                  <input type="checkbox" checked={scopeIds.includes(l.id)} onChange={() => toggleLoc(l.id)} />
                  <span className="truncate">{l.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={submit} disabled={saving || !name || !email} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Sending…' : 'Send invite'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
