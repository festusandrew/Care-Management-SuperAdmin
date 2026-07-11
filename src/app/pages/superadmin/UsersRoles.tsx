import { useEffect, useState } from 'react';
import { Plus, KeyRound, ShieldOff, ShieldCheck } from 'lucide-react';
import { SuperAdminShell } from '../../components/superadmin/SuperAdminShell';
import { Pagination, paginate } from '../../components/superadmin/Pagination';
import { api } from '../../services/api';
import { AdminUser, Role, Location } from '../../mockData/mockStore';
import { InviteAdminUserModal } from '../../components/superadmin/InviteAdminUserModal';
import { EditRoleModal } from '../../components/superadmin/EditRoleModal';

const PAGE_SIZE = 10;

export default function UsersRoles() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [rolePage, setRolePage] = useState(1);

  const load = () => Promise.all([api.getAdminUsers(), api.getRoles(), api.getLocations()]).then(([u, r, l]) => {
    setUsers(u); setRoles(r); setLocations(l);
    setUserPage(1); setRolePage(1);
  });
  useEffect(() => { load(); }, []);

  const roleName = (id: number) => roles.find(r => r.id === id)?.name ?? '—';
  const scopeLabel = (s: number[] | 'all') => s === 'all' ? 'All Locations' : s.map(id => locations.find(l => l.id === id)?.name).filter(Boolean).join(', ');

  const toggleStatus = async (u: AdminUser) => {
    const next = u.status === 'active' ? 'suspended' : 'active';
    const updated = await api.setAdminUserStatus(u.id, next);
    setUsers(prev => prev.map(x => x.id === u.id ? updated : x));
  };

  const reset = async (u: AdminUser) => {
    const res = await api.resetAdminUserPassword(u.id);
    alert(`Temporary password: ${res.tempPassword}`);
  };

  const visibleUsers = paginate(users, userPage, PAGE_SIZE);
  const visibleRoles = paginate(roles, rolePage, PAGE_SIZE);

  return (
    <SuperAdminShell
      title="Users & Roles"
      subtitle="Manage organisation-wide admin access"
      active="Users & Roles"
      actions={
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
          <Plus size={16} /> Invite user
        </button>
      }
    >
      {/* Admin users table */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Admin users</h2>
          <span className="text-xs text-gray-500">{users.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Location scope</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Last login</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map(u => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-5 py-3">
                    <div className="text-gray-900 font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{roleName(u.roleId)}</td>
                  <td className="px-5 py-3 text-gray-700 max-w-xs truncate">{scopeLabel(u.locationScope)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : u.status === 'invited' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{u.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{u.lastLogin}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={() => reset(u)} title="Reset password" className="p-1.5 hover:bg-gray-100 rounded"><KeyRound size={14} className="text-gray-600" /></button>
                      <button onClick={() => toggleStatus(u)} title={u.status === 'active' ? 'Suspend' : 'Activate'} className="p-1.5 hover:bg-gray-100 rounded">
                        {u.status === 'active' ? <ShieldOff size={14} className="text-red-600" /> : <ShieldCheck size={14} className="text-emerald-600" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={userPage} pageSize={PAGE_SIZE} total={users.length} onChange={setUserPage} />
      </div>

      {/* Roles table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Roles</h2>
          <span className="text-xs text-gray-500">{roles.length} total</span>
        </div>
        <div className="divide-y divide-gray-100">
          {visibleRoles.map(r => (
            <div key={r.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-gray-900 font-medium">{r.name} <span className="text-xs text-gray-500 ml-2">({r.scope})</span></div>
                <div className="text-xs text-gray-500 mt-0.5">{r.description}</div>
                <div className="text-[11px] text-gray-400 mt-1">{r.permissions.join(' · ')}</div>
              </div>
              <button onClick={() => setEditingRole(r)} className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg shrink-0">Edit</button>
            </div>
          ))}
          {visibleRoles.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No roles found.</div>
          )}
        </div>
        <Pagination page={rolePage} pageSize={PAGE_SIZE} total={roles.length} onChange={setRolePage} />
      </div>

      <InviteAdminUserModal show={showInvite} onClose={() => setShowInvite(false)} onCreated={() => { setShowInvite(false); load(); }} roles={roles} locations={locations} />
      <EditRoleModal show={!!editingRole} onClose={() => setEditingRole(null)} role={editingRole} onSaved={() => { setEditingRole(null); load(); }} />
    </SuperAdminShell>
  );
}
