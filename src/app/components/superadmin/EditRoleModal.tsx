import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { api } from '../../services/api';
import { Role } from '../../mockData/mockStore';

export function EditRoleModal({ show, onClose, role, onSaved }: { show: boolean; onClose: () => void; role: Role | null; onSaved: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!role) return;
    setName(role.name); setDescription(role.description); setPermissions(role.permissions);
    api.getPermissionCatalog().then(setCatalog);
  }, [role]);

  if (!role) return null;

  const toggle = (p: string) => setPermissions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const save = async () => {
    setSaving(true);
    await api.updateRole(role.id, { name, description, permissions });
    setSaving(false);
    onSaved();
  };

  return (
    <Modal isOpen={show} onClose={onClose} title={`Edit role — ${role.name}`} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Location Admin" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Describe what this role can do…" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2">Permissions</label>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-100 rounded-lg">
            {catalog.map(p => (
              <label key={p} className="flex items-center gap-2 text-xs text-gray-700 p-1.5">
                <input type="checkbox" checked={permissions.includes(p)} onChange={() => toggle(p)} />
                <span className="truncate">{p}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving…' : 'Save role'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
