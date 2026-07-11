BACKEND INTEGRATION AND API SPECIFICATION GUIDE

OVERVIEW
This document provides instructions on how to connect this React frontend to a live backend API server. By default, the application runs in local Mock Mode using the in-memory database store (mockStore.ts). To enable Live Integration, you configure the API base URL in your environment.

TOGGLING INTEGRATION MODES

1. Live Backend Mode
   To switch to the live API, define the VITE_API_URL environment variable. In your project root, create a file named .env and define the variable:
   VITE_API_URL=/api

   When VITE_API_URL is populated, the application automatically disables Mock Mode and sends all requests through the fetch-based client wrapper (apiClient.ts).

2. Local Mock Mode
   To return to local mock mode, delete the .env file or comment out the VITE_API_URL line.

DEVELOPMENT PROXIES
During local development, running your frontend (on port 5173) and backend (e.g., on port 3000) will trigger CORS issues if queried directly.
To resolve this, Vite is pre-configured with a development server proxy (vite.config.ts) that forwards all requests beginning with /api to http://localhost:3000.
Ensure your backend development server runs on http://localhost:3000 or modify the proxy target in vite.config.ts to match your server's port.

API ENDPOINTS LOG

Below is the list of endpoints that the frontend requests when running in Live Backend Mode:

A. Dashboard and Core Overview
   - GET /dashboard/alerts: Fetch alerts and notifications.

B. Locations Management
   - GET /locations: Retrieve all care locations.
   - GET /locations/:id: Retrieve details of a specific location.
   - POST /locations: Add a new location.
   - PUT /locations/:id: Update location information.
   - PUT /locations/:id/status: Change location status.
   - DELETE /locations/:id: Archive or decommission a location.
   - GET /locations/:id/summary: Fetch occupancy, staff and compliance summaries.

C. Service Users Directory
   - GET /service-users: Fetch all service users.
   - GET /service-users/:id: Fetch profile details for a service user.
   - POST /service-users: Add a new service user.

D. Staff and Shift Scheduling
   - GET /staff: Retrieve staff directory.
   - POST /staff: Add a staff member.
   - GET /leave-requests: Fetch leave requests.
   - PUT /leave-requests/:id/status: Approve or decline a leave request.

E. Audit and Logging
   - GET /audit/log: Retrieve audit logs.
   - POST /audit/log: Create an audit log entry.
