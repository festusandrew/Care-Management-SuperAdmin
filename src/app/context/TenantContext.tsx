import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../services/api';
import { Location } from '../mockData/mockStore';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff';

interface TenantContextType {
  currentOrgId: number;
  currentUserRole: UserRole;
  setCurrentUserRole: (r: UserRole) => void;
  activeLocationId: number | 'all';
  setActiveLocation: (id: number | 'all') => void;
  accessibleLocations: Location[];
  currentUserName: string;
  hasPermission: (key: string) => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const ROLE_PERMS: Record<UserRole, string[]> = {
  super_admin: ['*'],
  admin: ['view.*', 'edit.staff', 'edit.serviceUser', 'edit.compliance', 'edit.financial'],
  manager: ['view.*', 'edit.serviceUser', 'edit.carePlan'],
  staff: ['view.dashboard', 'view.serviceUser', 'view.medication']
};

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('super_admin');
  const [activeLocationId, setActiveLocationId] = useState<number | 'all'>('all');
  const [accessibleLocations, setAccessibleLocations] = useState<Location[]>([]);

  useEffect(() => {
    api.getLocations().then(setAccessibleLocations);
  }, []);

  const hasPermission = (key: string) => {
    const perms = ROLE_PERMS[currentUserRole] || [];
    if (perms.includes('*')) return true;
    if (perms.includes(key)) return true;
    const prefix = key.split('.')[0] + '.*';
    return perms.includes(prefix);
  };

  return (
    <TenantContext.Provider
      value={{
        currentOrgId: 1,
        currentUserRole,
        setCurrentUserRole,
        activeLocationId,
        setActiveLocation: setActiveLocationId,
        accessibleLocations,
        currentUserName: 'Ada McGregor',
        hasPermission
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}
