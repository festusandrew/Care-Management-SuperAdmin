import { useEffect, useState } from 'react';
import { Plus, XCircle, MapPin } from 'lucide-react';
import { SuperAdminShell } from '../../components/superadmin/SuperAdminShell';
import { Pagination, paginate } from '../../components/superadmin/Pagination';
import { Modal } from '../../components/Modal';
import { api } from '../../services/api';
import { Location } from '../../mockData/mockStore';
import { AddLocationModal } from '../../components/superadmin/AddLocationModal';
import { LocationDetailModal } from '../../components/superadmin/LocationDetailModal';

const PAGE_SIZE = 9; // 3-col grid — keeps rows even

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [confirmClose, setConfirmClose] = useState<Location | null>(null);

  const load = () => api.getLocations().then(data => { setLocations(data); setPage(1); });
  useEffect(() => { load(); }, []);

  const close = async (loc: Location) => {
    const updated = await api.setLocationStatus(loc.id, 'closed');
    setLocations(prev => prev.map(l => l.id === loc.id ? updated : l));
    setConfirmClose(null);
  };

  const visible = paginate(locations, page, PAGE_SIZE);

  return (
    <SuperAdminShell
      title="Locations"
      subtitle="Manage sites, capacity, and status across the organisation"
      active="Locations"
      actions={
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
          <Plus size={16} /> Add Location
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map(loc => {
          const pct = Math.round((loc.occupancy / loc.capacity) * 100);
          const statusStyle = loc.status === 'active' ? 'bg-emerald-50 text-emerald-700' : loc.status === 'paused' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600';
          return (
            <div key={loc.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-gray-900 truncate">{loc.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {loc.region}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${statusStyle}`}>{loc.status}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">{loc.address}</div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Occupancy</span>
                  <span className="text-gray-900 font-semibold">{loc.occupancy}/{loc.capacity} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-4">Manager: <span className="text-gray-700">{loc.manager}</span></div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedLocationId(loc.id)} className="flex-1 px-3 py-2 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg">Open</button>
                {loc.status !== 'closed' && (
                  <button onClick={() => setConfirmClose(loc)} className="px-3 py-2 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-lg flex items-center gap-1">
                    <XCircle size={12} /> Set to Closed
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="col-span-3 py-16 text-center text-sm text-gray-400">No locations found.</div>
        )}
      </div>

      {/* Pagination sits below the grid */}
      {locations.length > PAGE_SIZE && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200">
          <Pagination page={page} pageSize={PAGE_SIZE} total={locations.length} onChange={setPage} />
        </div>
      )}

      <AddLocationModal show={showAdd} onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />

      <LocationDetailModal isOpen={selectedLocationId !== null} onClose={() => setSelectedLocationId(null)} id={selectedLocationId} />

      <Modal isOpen={!!confirmClose} onClose={() => setConfirmClose(null)} title="Close location" size="sm">
        <p className="text-sm text-gray-700 mb-1">
          You are about to mark <span className="font-semibold">{confirmClose?.name}</span> as closed.
        </p>
        <p className="text-sm text-gray-500 mb-6">This signals the site is decommissioned. The location manager should be informed separately before this action is taken.</p>
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setConfirmClose(null)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={() => confirmClose && close(confirmClose)} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg">Confirm closure</button>
        </div>
      </Modal>
    </SuperAdminShell>
  );
}
