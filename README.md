CARE MANAGEMENT SUPERADMIN - ENTERPRISE PLATFORM DOCUMENTATION

OVERVIEW
The Care Management SuperAdmin Dashboard is an enterprise-grade web application designed for multi-tenant and multi-site organization oversight. It enables administrators, compliance officers, and executive managers to manage multiple care locations, staff rosters, service user directories, medication administration records, active incidents, and cross-site compliance requirements from a single, centralized portal.

CORE MODULES

1. Locations Management
   - Locations Directory: Displays all care homes and offices with real-time capacity and occupancy metrics. Supports adding locations and archiving/closing them.
   - Add Location: A creation modal containing fields for Name, Region, Address, Manager, Capacity, Timezone, Occupancy, Status, and Opened Date.
   - Location Details: Interactive modal view that displays site telemetry including service users, active staff mix, open alerts, compliance score, medication adherence rates, compliance breakdown by area, recent invoices, and paginated audit log entries.

2. Admin Users and Roles
   - User Directory: Displays all registered administrators, their assigned roles, location scopes, status (invited, active, suspended), and last login details.
   - Invite User Modal: Allows sending invitations by defining Full Name, Email, Role, Location Scope, and Status.
   - Roles and Permissions: Displays a list of roles with their scope, description, and permission gates. An inline edit panel enables modifying specific permissions for any role.

3. Organization Settings
   - Profile Settings: Allows managing the organization name, registered address, and billing email.
   - Plan and Data Retention: Enables switching enterprise subscription plans and configuring the data retention policy.

4. Operations and Compliance
   - Consolidated Analytics: Aggregates occupancy trends, incident rates, staff turnover, and medication adherence metrics.
   - Cross-Site Compliance: Evaluates compliance performance across different regions and sites.
   - Incident Tracking: Centralized logging, PDF export capability, and status lifecycle management for incident reporting.

TECHNICAL ARCHITECTURE

Directory Structure:
- src/main.tsx: Application entry point.
- src/app/App.tsx: Layout shell and page routing logic.
- src/app/context/TenantContext.tsx: Handles tenant-level data.
- src/app/context/NavigationContext.tsx: Manages page routes.
- src/app/services/api.ts: Service layer interacting with mock data.
- src/app/mockData/mockStore.ts: In-memory state and mock database.
- src/app/components/: Shared components (Modals, Sidebar, TopBar).
- src/app/pages/: Page layouts (Locations, UsersRoles, OrgOverview, OrgSettings).

Data Flow:
All state changes update the in-memory mock store on runtime. Page views subscribe to this store using react state hooks and fetch updates on mount.

GETTING STARTED

Prerequisites:
Ensure Node.js (version 16 or higher) is installed on your local machine.

Steps to Run:
1. Open the project root directory in your command line terminal.
2. Install the node package dependencies:
   npm install
3. Start the Vite local development server:
   npm run dev
4. Open your web browser and navigate to the URL:
   http://localhost:5173
