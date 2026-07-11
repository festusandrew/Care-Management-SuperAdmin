# Super Admin Dashboard — Implementation Plan

## Context
MpoweredCare currently ships a single-tenant, staff/manager-facing platform: one sidebar, one `NavigationContext`, one mock store, and page-level API calls under `src/app/services/api.ts`. Everything assumes a single care location.

The next strategic step is a **Super Admin** experience for organisation owners and regional directors who operate **multiple locations**. It must give them oversight across sites (compliance, financials, staffing, incidents), plus organisation-wide user/role/location administration. It should live alongside — not replace — the existing staff-facing app, so a super admin can drill from an aggregate view into any single site's normal pages.

Design language, tokens, and modal patterns stay identical to the current app (Nunito, primary blue `#1D4ED8`, secondary green `#10B981`, 16px grid, `rounded-xl`, `bg-gray-900/20` overlays, single-scroll tab-free modals).

## Approach

### 1. Multi-tenant model (mock layer)
Extend `src/app/mockData/mockStore.ts` with:
- `Organisation { id, name, plan, createdAt }`
- `Location { id, orgId, name, region, address, timezone, capacity, status: 'active'|'paused'|'closed' }`
- `Role { id, name, scope: 'org'|'location', permissions: string[] }`
- `AdminUser { id, orgId, name, email, roleId, locationScope: number[] | 'all', status, lastLogin }`
- `AuditLogEntry { id, orgId, actorId, action, entityType, entityId, locationId?, at, meta }`
- `BillingInvoice { id, orgId, locationId?, period, amount, status, dueAt }`
- Add `locationId` to every existing tenant-scoped entity (`ServiceUser`, `StaffMember`, `ClockEvent`, `LeaveRequest`, `MedicationRecord`, incidents, care plans, compliance items, financial records). Seed 3 demo locations so aggregate views are meaningful.

Keep existing single-location pages working by defaulting queries to the "active" location from a new `TenantContext`.

### 2. Tenant + role context
Add `src/app/context/TenantContext.tsx` with:
- `currentOrgId`, `currentUserRole` (`'super_admin' | 'admin' | 'manager' | 'staff'`)
- `activeLocationId | 'all'` and `setActiveLocation`
- `accessibleLocations: Location[]`
- Helper `hasPermission(key)`

Wire it in `App.tsx` above `NavigationProvider`. Gate the Super Admin sidebar section on `currentUserRole === 'super_admin'`.

### 3. Routing & sidebar
Extend `NavigationContext` page union with the pages below. Add a new sidebar group **"Organisation"** (only rendered for super admins) in `src/app/components/Sidebar.tsx`:
- Overview
- Locations
- Users & Roles
- Cross-Site Compliance
- Consolidated Financials
- Org Analytics
- Audit Log
- Org Settings

Add a **location switcher** in `TopBar.tsx` (`All Locations ▾ | Site A | Site B …`) that updates `TenantContext.activeLocationId`. When set to a specific location, existing pages filter to it; when `'all'`, super admin pages show aggregates and staff pages show a banner "Select a location to edit."

### 4. New pages (all under `src/app/pages/superadmin/`)

**OrgOverview.tsx** — hero KPIs across the org, per-location health strip, top risks feed.
**Locations.tsx** — list/grid of sites with status pill, capacity utilisation, open alerts count; row-click drills into the existing Dashboard scoped to that location.
**LocationDetail.tsx** — a location's summary card, staff count, service users, occupancy, recent incidents, current compliance score; buttons to jump into scoped pages.
**UsersRoles.tsx** — admin users table, invite modal, role editor, per-user location scoping.
**CrossSiteCompliance.tsx** — matrix of compliance areas × locations with RAG status; drill to `Compliance` page scoped to that site.
**ConsolidatedFinancials.tsx** — revenue/expense roll-up, per-location breakdown, invoice table, timeframe filter matching existing Financial page pattern.
**OrgAnalytics.tsx** — org-wide trend charts (occupancy, incidents, staff turnover, medication adherence) using the existing chart component patterns.
**AuditLog.tsx** — filterable stream (actor, location, action type, date range).
**OrgSettings.tsx** — org profile, branding, plan/billing contact, data retention, SSO placeholder.

Reuse existing `Card`, `Badge`, `Modal`, `FilterPanel` components. New modals go in `src/app/components/superadmin/` following the single-scroll, tab-free pattern:
- `AddLocationModal`, `EditLocationModal`, `PauseCloseLocationModal`
- `InviteAdminUserModal`, `EditAdminUserModal`, `EditRoleModal`, `DeactivateUserModal`
- `AssignLocationsModal`
- `ExportOrgReportModal` (reuse `ExportReportModal` pattern)
- `AuditLogDetailModal`

### 5. API endpoints
Extend `src/app/services/api.ts` following the existing `IS_MOCK_MODE` ⇄ `apiClient` dual pattern. **Every** endpoint the Super Admin dashboard depends on:

**Organisation**
- `GET  /org` → `getOrganisation()`
- `PUT  /org` → `updateOrganisation(patch)`
- `GET  /org/overview` → `getOrgOverview()` (KPIs, per-site health, top risks)
- `GET  /org/analytics?range=` → `getOrgAnalytics(range)`

**Locations**
- `GET    /locations` → `getLocations()`
- `GET    /locations/:id` → `getLocationById(id)`
- `POST   /locations` → `addLocation(payload)`
- `PUT    /locations/:id` → `updateLocation(id, patch)`
- `PUT    /locations/:id/status` → `setLocationStatus(id, 'active'|'paused'|'closed')`
- `DELETE /locations/:id` → `archiveLocation(id)`
- `GET    /locations/:id/summary` → `getLocationSummary(id)` (staff/SU counts, occupancy, open alerts, compliance %)

**Users & Roles**
- `GET    /admin/users?locationId=&role=&status=` → `getAdminUsers(filters)`
- `POST   /admin/users/invite` → `inviteAdminUser(payload)`
- `PUT    /admin/users/:id` → `updateAdminUser(id, patch)`
- `PUT    /admin/users/:id/status` → `setAdminUserStatus(id, 'active'|'suspended')`
- `PUT    /admin/users/:id/locations` → `setUserLocationScope(id, ids | 'all')`
- `POST   /admin/users/:id/reset-password` → `resetAdminUserPassword(id)`
- `GET    /admin/roles` → `getRoles()`
- `POST   /admin/roles` → `addRole(payload)`
- `PUT    /admin/roles/:id` → `updateRole(id, patch)`
- `DELETE /admin/roles/:id` → `deleteRole(id)`
- `GET    /admin/permissions` → `getPermissionCatalog()`

**Cross-site compliance**
- `GET /compliance/matrix` → `getComplianceMatrix()` (areas × locations, RAG + score)
- `GET /compliance/summary?locationId=&range=` → `getComplianceSummary(filters)`
- `GET /compliance/expiring?days=` → `getExpiringCompliance(days)`

**Consolidated financials**
- `GET  /financial/summary?range=&locationId=` → `getFinancialSummary(filters)`
- `GET  /financial/by-location?range=` → `getFinancialByLocation(range)`
- `GET  /financial/invoices?status=&range=` → `getInvoices(filters)`
- `POST /financial/invoices/:id/mark-paid` → `markInvoicePaid(id, payload)`
- `GET  /financial/payouts?range=` → `getPayouts(range)`
- `POST /financial/exports` → `exportFinancialReport(payload)`

**Org-wide roll-ups (aggregate over existing entities, scoped by location filter)**
- `GET /org/service-users/summary?locationId=` → `getServiceUsersSummary(filters)`
- `GET /org/staff/summary?locationId=` → `getStaffSummary(filters)`
- `GET /org/incidents/summary?locationId=&range=&severity=` → `getIncidentsSummary(filters)`
- `GET /org/medications/adherence?locationId=&range=` → `getMedicationAdherence(filters)`
- `GET /org/attendance/summary?locationId=&range=` → `getAttendanceSummary(filters)`
- `GET /org/recruitment/summary` → `getRecruitmentSummary()`
- `GET /org/care-plans/review-status?locationId=` → `getCarePlanReviewStatus(filters)`

**Audit log**
- `GET  /audit-log?actorId=&action=&entity=&locationId=&from=&to=&page=` → `getAuditLog(filters)`
- `POST /audit-log/export` → `exportAuditLog(filters)`

**Alerts (org-wide, extends existing dashboard alerts)**
- `GET /org/alerts?locationId=&severity=` → `getOrgAlerts(filters)`
- `POST /org/alerts/:id/acknowledge` → `acknowledgeAlert(id, note?)`

Every mock branch reads/writes the extended `mockStore`; every non-mock branch uses `apiClient<T>` with the URL above.

### 6. Verification
- `pnpm install && pnpm dev` (dev server is already running per env rules — just reload the preview).
- Toggle a dev-only role selector in Settings to switch between `super_admin` and `admin`; confirm the "Organisation" sidebar group appears only for super admin.
- Location switcher in TopBar filters existing pages (Service Users, Staff, Medications, Incidents, Financial, Compliance) to a single site when chosen, and shows aggregate on `all`.
- Visit each new page and confirm data renders from mock endpoints; open every new modal and confirm the single-scroll, tab-free, `bg-gray-900/20` overlay pattern.
- Perform each mutating action (add location, invite user, edit role, pause location, mark invoice paid, acknowledge alert) and confirm the mock store persists it in-session and the UI reflects it.
- Drill from `Locations` into a scoped Dashboard and back; confirm `activeLocationId` round-trips.
- Confirm no regression on existing staff-facing pages when `activeLocationId` is a single site.

## Critical files
- `src/app/mockData/mockStore.ts` — extend types + seed data
- `src/app/services/api.ts` — add every endpoint above
- `src/app/context/TenantContext.tsx` — NEW
- `src/app/context/NavigationContext.tsx` — extend page union
- `src/app/App.tsx` — mount `TenantProvider`, route new pages
- `src/app/components/Sidebar.tsx` — add "Organisation" group (role-gated)
- `src/app/components/TopBar.tsx` — add location switcher
- `src/app/pages/superadmin/*` — 9 new pages
- `src/app/components/superadmin/*` — new modals
