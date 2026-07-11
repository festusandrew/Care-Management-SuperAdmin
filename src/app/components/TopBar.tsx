import { Search, Bell, User, Menu, MapPin, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useTenant } from '../context/TenantContext';

export function TopBar() {
  const { isSidebarOpen, setIsSidebarOpen } = useNavigation();
  const { activeLocationId, setActiveLocation, accessibleLocations } = useTenant();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeLabel = activeLocationId === 'all'
    ? 'All Locations'
    : (accessibleLocations.find(l => l.id === activeLocationId)?.name ?? 'All Locations');

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white border-b border-gray-200 z-10 px-4 md:px-8 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between">
        <div className="flex-1 max-w-2xl flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-2 hover:bg-gray-100 rounded-lg md:hidden transition-colors shrink-0"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-4 md:ml-8 shrink-0">
          {/* Location Switcher */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
            >
              <MapPin size={16} className="text-blue-600" />
              <span className="hidden sm:inline max-w-[140px] truncate">{activeLabel}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                <button
                  onClick={() => { setActiveLocation('all'); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${activeLocationId === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                >
                  All Locations
                </button>
                <div className="border-t border-gray-100" />
                {accessibleLocations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => { setActiveLocation(loc.id); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${activeLocationId === loc.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                  >
                    <div className="truncate">{loc.name}</div>
                    <div className="text-xs text-gray-500 truncate">{loc.region}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-sm text-gray-600 hidden lg:inline">{today}</span>

          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
            <User size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
