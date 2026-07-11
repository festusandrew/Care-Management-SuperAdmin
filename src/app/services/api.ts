import { IS_MOCK_MODE, apiClient } from './apiClient';
import {
  mockStore,
  Alert,
  ServiceUser,
  StaffMember,
  ClockEvent,
  LeaveRequest,
  HistoryRecord,
  LeaveStatus,
  MedicationRecord,
  Organisation,
  Location,
  LocationStatus,
  AdminUser,
  AdminUserStatus,
  Role,
  BillingInvoice,
  AuditLogEntry,
  ComplianceMatrixCell,
  OrgAlert
} from '../mockData/mockStore';

const qs = (o: Record<string, any>) => {
  const p = new URLSearchParams();
  Object.entries(o).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') p.append(k, String(v)); });
  const s = p.toString();
  return s ? `?${s}` : '';
};

// Helper to simulate network latency in mock mode
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- Dashboard Services ---
  getDashboardAlerts: async (): Promise<Alert[]> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.getAlerts();
    }
    return apiClient<Alert[]>('/dashboard/alerts');
  },

  // --- Service Users Services ---
  getServiceUsers: async (): Promise<ServiceUser[]> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.getServiceUsers();
    }
    return apiClient<ServiceUser[]>('/service-users');
  },

  getServiceUserById: async (id: number): Promise<ServiceUser | undefined> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.getServiceUserById(id);
    }
    return apiClient<ServiceUser>(`/service-users/${id}`);
  },

  addServiceUser: async (user: Omit<ServiceUser, 'id'>): Promise<ServiceUser> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.addServiceUser(user);
    }
    return apiClient<ServiceUser>('/service-users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  // --- Staff Management Services ---
  getStaffMembers: async (): Promise<StaffMember[]> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.getStaffMembers();
    }
    return apiClient<StaffMember[]>('/staff');
  },

  addStaffMember: async (staff: Omit<StaffMember, 'id'>): Promise<StaffMember> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.addStaffMember(staff);
    }
    return apiClient<StaffMember>('/staff', {
      method: 'POST',
      body: JSON.stringify(staff)
    });
  },

  getClockEvents: async (): Promise<ClockEvent[]> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.getClockEvents();
    }
    return apiClient<ClockEvent[]>('/attendance/clock-events');
  },

  clockOutStaff: async (staffId: number, note?: string): Promise<ClockEvent> => {
    if (IS_MOCK_MODE) {
      await delay();
      const res = mockStore.clockOutStaff(staffId, note);
      if (!res) throw new Error('Staff member clock event not found');
      return res;
    }
    return apiClient<ClockEvent>(`/attendance/clock-out/${staffId}`, {
      method: 'POST',
      body: JSON.stringify({ note })
    });
  },

  clockInStaff: async (staffId: number): Promise<ClockEvent> => {
    if (IS_MOCK_MODE) {
      await delay();
      const res = mockStore.clockInStaff(staffId);
      if (!res) throw new Error('Staff member clock event not found');
      return res;
    }
    return apiClient<ClockEvent>(`/attendance/clock-in/${staffId}`, {
      method: 'POST'
    });
  },

  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.getLeaveRequests();
    }
    return apiClient<LeaveRequest[]>('/leave-requests');
  },

  updateLeaveRequestStatus: async (
    id: number, 
    status: LeaveStatus, 
    note?: string
  ): Promise<LeaveRequest> => {
    if (IS_MOCK_MODE) {
      await delay();
      const res = mockStore.updateLeaveRequestStatus(id, status, note);
      if (!res) throw new Error('Leave request not found');
      return res;
    }
    return apiClient<LeaveRequest>(`/leave-requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note })
    });
  },

  logLeaveRequest: async (
    request: Omit<LeaveRequest, 'id' | 'submittedOn'>
  ): Promise<LeaveRequest> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.logLeaveRequest(request);
    }
    return apiClient<LeaveRequest>('/leave-requests', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  },

  getAttendanceHistory: async (): Promise<HistoryRecord[]> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.getAttendanceHistory();
    }
    return apiClient<HistoryRecord[]>('/attendance/history');
  },

  getMedications: async (): Promise<MedicationRecord[]> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.getMedications();
    }
    return apiClient<MedicationRecord[]>('/medications');
  },

  addMedications: async (newMeds: Omit<MedicationRecord, 'id' | 'status' | 'administeredBy' | 'administeredAt' | 'notes'>[]): Promise<MedicationRecord[]> => {
    if (IS_MOCK_MODE) {
      await delay();
      return mockStore.addMedications(newMeds);
    }
    return apiClient<MedicationRecord[]>('/medications', {
      method: 'POST',
      body: JSON.stringify({ medications: newMeds })
    });
  },

  administerMedication: async (id: number, administeredBy: string, notes?: string): Promise<MedicationRecord> => {
    if (IS_MOCK_MODE) {
      await delay();
      const res = mockStore.administerMedication(id, administeredBy, notes);
      if (!res) throw new Error('Medication record not found');
      return res;
    }
    return apiClient<MedicationRecord>(`/medications/${id}/administer`, {
      method: 'POST',
      body: JSON.stringify({ administeredBy, notes })
    });
  },

  updateMedicationStatus: async (id: number, status: string, notes?: string): Promise<MedicationRecord> => {
    if (IS_MOCK_MODE) {
      await delay();
      const res = mockStore.updateMedicationStatus(id, status, notes);
      if (!res) throw new Error('Medication record not found');
      return res;
    }
    return apiClient<MedicationRecord>(`/medications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  },

  updateMedicationSchedule: async (id: number, schedule: Partial<MedicationRecord>): Promise<MedicationRecord> => {
    if (IS_MOCK_MODE) {
      await delay();
      const res = mockStore.updateMedicationSchedule(id, schedule);
      if (!res) throw new Error('Medication record not found');
      return res;
    }
    return apiClient<MedicationRecord>(`/medications/${id}/schedule`, {
      method: 'PUT',
      body: JSON.stringify(schedule)
    });
  },

  // --- Organisation ---
  getOrganisation: async (): Promise<Organisation> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getOrganisation(); }
    return apiClient<Organisation>('/org');
  },
  updateOrganisation: async (patch: Partial<Organisation>): Promise<Organisation> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.updateOrganisation(patch); }
    return apiClient<Organisation>('/org', { method: 'PUT', body: JSON.stringify(patch) });
  },
  getOrgOverview: async (): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getOrgOverview(); }
    return apiClient<any>('/org/overview');
  },
  getOrgAnalytics: async (range = '6m'): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getOrgAnalytics(range); }
    return apiClient<any>(`/org/analytics${qs({ range })}`);
  },

  // --- Locations ---
  getLocations: async (): Promise<Location[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getLocations(); }
    return apiClient<Location[]>('/locations');
  },
  getLocationById: async (id: number): Promise<Location | undefined> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getLocationById(id); }
    return apiClient<Location>(`/locations/${id}`);
  },
  addLocation: async (payload: Omit<Location, 'id' | 'orgId'>): Promise<Location> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.addLocation(payload); }
    return apiClient<Location>('/locations', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateLocation: async (id: number, patch: Partial<Location>): Promise<Location> => {
    if (IS_MOCK_MODE) {
      await delay();
      const r = mockStore.updateLocation(id, patch);
      if (!r) throw new Error('Location not found');
      return r;
    }
    return apiClient<Location>(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
  },
  setLocationStatus: async (id: number, status: LocationStatus): Promise<Location> => {
    if (IS_MOCK_MODE) {
      await delay();
      const r = mockStore.setLocationStatus(id, status);
      if (!r) throw new Error('Location not found');
      return r;
    }
    return apiClient<Location>(`/locations/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  },
  archiveLocation: async (id: number): Promise<Location | null> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.archiveLocation(id); }
    return apiClient<Location>(`/locations/${id}`, { method: 'DELETE' });
  },
  getLocationSummary: async (id: number): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getLocationSummary(id); }
    return apiClient<any>(`/locations/${id}/summary`);
  },

  // --- Admin Users & Roles ---
  getAdminUsers: async (filters: { locationId?: number; role?: string; status?: string } = {}): Promise<AdminUser[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getAdminUsers(); }
    return apiClient<AdminUser[]>(`/admin/users${qs(filters)}`);
  },
  inviteAdminUser: async (payload: { name: string; email: string; roleId: number; locationScope: number[] | 'all'; status?: AdminUserStatus; lastLogin?: string; avatarUrl?: string }): Promise<AdminUser> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.inviteAdminUser(payload); }
    return apiClient<AdminUser>('/admin/users/invite', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateAdminUser: async (id: number, patch: Partial<AdminUser>): Promise<AdminUser> => {
    if (IS_MOCK_MODE) {
      await delay();
      const r = mockStore.updateAdminUser(id, patch);
      if (!r) throw new Error('User not found');
      return r;
    }
    return apiClient<AdminUser>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
  },
  setAdminUserStatus: async (id: number, status: AdminUserStatus): Promise<AdminUser> => {
    if (IS_MOCK_MODE) {
      await delay();
      const r = mockStore.setAdminUserStatus(id, status);
      if (!r) throw new Error('User not found');
      return r;
    }
    return apiClient<AdminUser>(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  },
  setUserLocationScope: async (id: number, scope: number[] | 'all'): Promise<AdminUser> => {
    if (IS_MOCK_MODE) {
      await delay();
      const r = mockStore.setUserLocationScope(id, scope);
      if (!r) throw new Error('User not found');
      return r;
    }
    return apiClient<AdminUser>(`/admin/users/${id}/locations`, { method: 'PUT', body: JSON.stringify({ scope }) });
  },
  resetAdminUserPassword: async (id: number): Promise<{ ok: boolean; tempPassword?: string }> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.resetAdminUserPassword(id); }
    return apiClient(`/admin/users/${id}/reset-password`, { method: 'POST' });
  },
  getRoles: async (): Promise<Role[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getRoles(); }
    return apiClient<Role[]>('/admin/roles');
  },
  addRole: async (payload: Omit<Role, 'id'>): Promise<Role> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.addRole(payload); }
    return apiClient<Role>('/admin/roles', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateRole: async (id: number, patch: Partial<Role>): Promise<Role> => {
    if (IS_MOCK_MODE) {
      await delay();
      const r = mockStore.updateRole(id, patch);
      if (!r) throw new Error('Role not found');
      return r;
    }
    return apiClient<Role>(`/admin/roles/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
  },
  deleteRole: async (id: number): Promise<Role | null> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.deleteRole(id); }
    return apiClient<Role>(`/admin/roles/${id}`, { method: 'DELETE' });
  },
  getPermissionCatalog: async (): Promise<string[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getPermissionCatalog(); }
    return apiClient<string[]>('/admin/permissions');
  },

  // --- Compliance ---
  getComplianceMatrix: async (): Promise<ComplianceMatrixCell[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getComplianceMatrix(); }
    return apiClient<ComplianceMatrixCell[]>('/compliance/matrix');
  },
  getComplianceSummary: async (locationId?: number | 'all', range?: string): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getComplianceSummary(locationId); }
    return apiClient<any>(`/compliance/summary${qs({ locationId, range })}`);
  },
  getExpiringCompliance: async (days = 30): Promise<any[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getExpiringCompliance(days); }
    return apiClient<any[]>(`/compliance/expiring${qs({ days })}`);
  },

  // --- Consolidated Financials ---
  getFinancialSummary: async (locationId?: number | 'all', range?: string): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getFinancialSummary(locationId); }
    return apiClient<any>(`/financial/summary${qs({ locationId, range })}`);
  },
  getFinancialByLocation: async (range?: string): Promise<any[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getFinancialByLocation(); }
    return apiClient<any[]>(`/financial/by-location${qs({ range })}`);
  },
  getInvoices: async (filters: { status?: string; range?: string } = {}): Promise<BillingInvoice[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getInvoices(); }
    return apiClient<BillingInvoice[]>(`/financial/invoices${qs(filters)}`);
  },
  markInvoicePaid: async (id: number, paidAt?: string): Promise<BillingInvoice> => {
    if (IS_MOCK_MODE) {
      await delay();
      const r = mockStore.markInvoicePaid(id, paidAt);
      if (!r) throw new Error('Invoice not found');
      return r;
    }
    return apiClient<BillingInvoice>(`/financial/invoices/${id}/mark-paid`, { method: 'POST', body: JSON.stringify({ paidAt }) });
  },
  getPayouts: async (range?: string): Promise<any[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getPayouts(); }
    return apiClient<any[]>(`/financial/payouts${qs({ range })}`);
  },
  exportFinancialReport: async (payload: any): Promise<{ ok: boolean; url: string }> => {
    if (IS_MOCK_MODE) { await delay(); return { ok: true, url: 'blob:mock-report.csv' }; }
    return apiClient(`/financial/exports`, { method: 'POST', body: JSON.stringify(payload) });
  },

  // --- Org roll-ups ---
  getServiceUsersSummary: async (locationId?: number | 'all'): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getServiceUsersSummary(locationId); }
    return apiClient<any>(`/org/service-users/summary${qs({ locationId })}`);
  },
  getStaffSummary: async (locationId?: number | 'all'): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getStaffSummary(locationId); }
    return apiClient<any>(`/org/staff/summary${qs({ locationId })}`);
  },
  getIncidentsSummary: async (locationId?: number | 'all', range?: string, severity?: string): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getIncidentsSummary(); }
    return apiClient<any>(`/org/incidents/summary${qs({ locationId, range, severity })}`);
  },
  getMedicationAdherence: async (locationId?: number | 'all', range?: string): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getMedicationAdherence(); }
    return apiClient<any>(`/org/medications/adherence${qs({ locationId, range })}`);
  },
  getAttendanceSummary: async (locationId?: number | 'all', range?: string): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getAttendanceSummary(); }
    return apiClient<any>(`/org/attendance/summary${qs({ locationId, range })}`);
  },
  getRecruitmentSummary: async (): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getRecruitmentSummary(); }
    return apiClient<any>('/org/recruitment/summary');
  },
  getCarePlanReviewStatus: async (locationId?: number | 'all'): Promise<any> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getCarePlanReviewStatus(); }
    return apiClient<any>(`/org/care-plans/review-status${qs({ locationId })}`);
  },

  // --- Audit Log ---
  getAuditLog: async (filters: { actorId?: number; action?: string; entity?: string; locationId?: number; from?: string; to?: string; page?: number } = {}): Promise<AuditLogEntry[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getAuditLog(filters); }
    return apiClient<AuditLogEntry[]>(`/audit-log${qs(filters)}`);
  },
  exportAuditLog: async (filters: any): Promise<{ ok: boolean; url: string }> => {
    if (IS_MOCK_MODE) { await delay(); return { ok: true, url: 'blob:mock-audit.csv' }; }
    return apiClient(`/audit-log/export`, { method: 'POST', body: JSON.stringify(filters) });
  },

  // --- Org Alerts ---
  getOrgAlerts: async (locationId?: number | 'all', severity?: string): Promise<OrgAlert[]> => {
    if (IS_MOCK_MODE) { await delay(); return mockStore.getOrgAlerts(locationId, severity); }
    return apiClient<OrgAlert[]>(`/org/alerts${qs({ locationId, severity })}`);
  },
  acknowledgeAlert: async (id: number, actorName: string, note?: string): Promise<OrgAlert> => {
    if (IS_MOCK_MODE) {
      await delay();
      const r = mockStore.acknowledgeAlert(id, actorName);
      if (!r) throw new Error('Alert not found');
      return r;
    }
    return apiClient<OrgAlert>(`/org/alerts/${id}/acknowledge`, { method: 'POST', body: JSON.stringify({ actorName, note }) });
  }
};
