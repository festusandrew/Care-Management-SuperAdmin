export type ClockEvent = {
  staffId: number;
  name: string;
  employeeId: string;
  avatarUrl: string;
  clockIn: string | null;
  clockOut: string | null;
  scheduledIn: string;
  scheduledOut: string;
  location: string;
  role: string;
};

export type LeaveStatus = 'pending' | 'approved' | 'declined';
export type LeaveRequest = {
  id: number;
  staffId: number;
  name: string;
  employeeId: string;
  avatarUrl: string;
  role: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  submittedOn: string;
  status: LeaveStatus;
  adminNote: string;
};

export type HistoryRecord = ClockEvent & {
  date: string;
  hoursWorked: number | null;
};

export type ServiceUser = {
  id: number;
  name: string;
  age: number;
  photo: string;
  status: string;
  riskLevel: 'red' | 'amber' | 'green';
  mood: string;
  location: string;
  careManager: string;
  lastIncident: string;
  upcomingReview: string;
  conditions: string[];
  phone: string;
};

export type StaffMember = {
  id: number;
  employeeId: string;
  name: string;
  role: string;
  status: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  nextShift: string;
  qualifications: string[];
};

export type Alert = {
  type: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  icon: 'medication' | 'review' | 'incident' | 'compliance';
};

export type MedicationRecord = {
  id: number;
  serviceUser: string;
  userId: number;
  userPhoto: string;
  medication: string;
  dosage: string;
  time: string;
  route: string;
  status: string;
  administeredBy: string;
  administeredAt: string;
  notes: string;
  riskLevel: 'red' | 'amber' | 'green';
};

// --- In-Memory Database State ---

let alerts: Alert[] = [
  {
    type: 'medication',
    title: 'Missed Medication',
    description: '3 missed MAR entries',
    severity: 'critical',
    icon: 'medication'
  },
  {
    type: 'review',
    title: 'Care Plan Reviews',
    description: '2 care plans overdue',
    severity: 'warning',
    icon: 'review'
  },
  {
    type: 'incident',
    title: 'Unresolved Incidents',
    description: '2 incidents pending review',
    severity: 'warning',
    icon: 'incident'
  },
  {
    type: 'compliance',
    title: 'Compliance Updates',
    description: '5 items require attention',
    severity: 'info',
    icon: 'compliance'
  }
];

let serviceUsers: ServiceUser[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    age: 14,
    photo: '👧',
    status: 'active',
    riskLevel: 'amber',
    mood: '😊',
    location: 'Riverside House',
    careManager: 'Dr. Emily Carter',
    lastIncident: '3 days ago',
    upcomingReview: '5 days',
    conditions: ['Autism', 'Anxiety'],
    phone: '07700 900123',
  },
  {
    id: 2,
    name: 'Michael Thompson',
    age: 16,
    photo: '👦',
    status: 'active',
    riskLevel: 'red',
    mood: '😰',
    location: 'Oak Tree Lodge',
    careManager: 'Sarah Williams',
    lastIncident: '12 hours ago',
    upcomingReview: '2 weeks',
    conditions: ['ADHD', 'Behavioral'],
    phone: '07700 900456',
  },
  {
    id: 3,
    name: 'Emma Roberts',
    age: 12,
    photo: '👧',
    status: 'active',
    riskLevel: 'green',
    mood: '😌',
    location: 'Riverside House',
    careManager: 'Dr. Emily Carter',
    lastIncident: '2 weeks ago',
    upcomingReview: '1 month',
    conditions: ['None'],
    phone: '07700 900789',
  },
  {
    id: 4,
    name: 'Oliver Parker',
    age: 15,
    photo: '👦',
    status: 'active',
    riskLevel: 'amber',
    mood: '😐',
    location: 'Meadow View',
    careManager: 'James Mitchell',
    lastIncident: '1 week ago',
    upcomingReview: '10 days',
    conditions: ['Depression'],
    phone: '07700 900321',
  },
  {
    id: 5,
    name: 'Sophie Martinez',
    age: 13,
    photo: '👧',
    status: 'active',
    riskLevel: 'green',
    mood: '😊',
    location: 'Oak Tree Lodge',
    careManager: 'Sarah Williams',
    lastIncident: '1 month ago',
    upcomingReview: '3 weeks',
    conditions: ['None'],
    phone: '07700 900654',
  },
  {
    id: 6,
    name: 'Lucas Chen',
    age: 14,
    photo: '👦',
    status: 'active',
    riskLevel: 'red',
    mood: '😢',
    location: 'Meadow View',
    careManager: 'James Mitchell',
    lastIncident: '6 hours ago',
    upcomingReview: '1 week',
    conditions: ['PTSD', 'Anxiety'],
    phone: '07700 900987',
  },
  {
    id: 7,
    name: 'David Thompson',
    age: 15,
    photo: '👦',
    status: 'active',
    riskLevel: 'green',
    mood: '😊',
    location: 'Meadow View',
    careManager: 'James Mitchell',
    lastIncident: 'None',
    upcomingReview: '3 weeks',
    conditions: ['None'],
    phone: '07700 900555',
  },
  {
    id: 8,
    name: 'Lily Watson',
    age: 13,
    photo: '👧',
    status: 'active',
    riskLevel: 'amber',
    mood: '😐',
    location: 'Riverside House',
    careManager: 'Sarah Williams',
    lastIncident: '2 days ago',
    upcomingReview: '1 week',
    conditions: ['Anxiety'],
    phone: '07700 900222',
  }
];

let staffMembers: StaffMember[] = [
  {
    id: 1,
    employeeId: 'EMP-0001',
    name: 'Mary Thompson',
    role: 'Support Worker',
    status: 'Active',
    email: 'm.thompson@mpoweredcare.com',
    phone: '+44 7700 900123',
    location: 'Main House',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
    nextShift: '7 Dec, 07:00 - 15:00',
    qualifications: ['Care Certificate', 'First Aid'],
  },
  {
    id: 2,
    employeeId: 'EMP-0002',
    name: 'John Davies',
    role: 'Senior Support Worker',
    status: 'Active',
    email: 'j.davies@mpoweredcare.com',
    phone: '+44 7700 900234',
    location: 'Annex Building',
    avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=60',
    nextShift: '7 Dec, 07:00 - 15:00',
    qualifications: ['NVQ Level 3', 'Medication Admin'],
  },
  {
    id: 3,
    employeeId: 'EMP-0003',
    name: 'Sarah Williams',
    role: 'Support Worker',
    status: 'On Leave',
    email: 's.williams@mpoweredcare.com',
    phone: '+44 7700 900345',
    location: 'Main House',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
    nextShift: '15 Dec, 15:00 - 23:00',
    qualifications: ['Care Certificate'],
  },
  {
    id: 4,
    employeeId: 'EMP-0004',
    name: 'James Mitchell',
    role: 'Care Manager',
    status: 'Active',
    email: 'j.mitchell@mpoweredcare.com',
    phone: '+44 7700 900456',
    location: 'Office',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60',
    nextShift: '7 Dec, 09:00 - 17:00',
    qualifications: ['Level 5 Diploma', 'Safeguarding Lead'],
  },
  {
    id: 7,
    employeeId: 'EMP-0007',
    name: 'Lisa Anderson',
    role: 'Nurse',
    status: 'Active',
    email: 'l.anderson@mpoweredcare.com',
    phone: '+44 7700 900789',
    location: 'Main House',
    avatarUrl: 'https://images.unsplash.com/photo-1594824419266-9b16414777a8?w=800&auto=format&fit=crop&q=60',
    nextShift: '7 Dec, 08:00 - 16:00',
    qualifications: ['NMC Registered', 'Advanced First Aid'],
  }
];

let clockEvents: ClockEvent[] = [
  { staffId: 1, name: 'Mary Thompson',  employeeId: 'EMP-0001', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60', clockIn: '07:02', clockOut: null,    scheduledIn: '07:00', scheduledOut: '15:00', location: 'Main House',     role: 'Support Worker' },
  { staffId: 2, name: 'John Davies',    employeeId: 'EMP-0002', avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=60', clockIn: '06:58', clockOut: '15:01', scheduledIn: '07:00', scheduledOut: '15:00', location: 'Annex Building', role: 'Senior Support Worker' },
  { staffId: 7, name: 'Lisa Anderson',  employeeId: 'EMP-0007', avatarUrl: 'https://images.unsplash.com/photo-1594824419266-9b16414777a8?w=800&auto=format&fit=crop&q=60', clockIn: '07:59', clockOut: '16:03', scheduledIn: '08:00', scheduledOut: '16:00', location: 'Main House',     role: 'Nurse' },
  { staffId: 4, name: 'James Mitchell', employeeId: 'EMP-0004', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60', clockIn: '09:14', clockOut: null,    scheduledIn: '09:00', scheduledOut: '17:00', location: 'Office',         role: 'Care Manager' },
  { staffId: 3, name: 'Sarah Williams', employeeId: 'EMP-0003', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60', clockIn: null,    clockOut: null,    scheduledIn: '15:00', scheduledOut: '23:00', location: 'Main House',     role: 'Support Worker' },
];

let leaveRequests: LeaveRequest[] = [
  { id: 1, staffId: 1, name: 'Mary Thompson',  employeeId: 'EMP-0001', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60', role: 'Support Worker',        type: 'Annual Leave',    from: '23 Jun 2026', to: '27 Jun 2026', days: 5, reason: 'Family holiday booked in advance.',          submittedOn: '8 Jun 2026',  status: 'pending',  adminNote: '' },
  { id: 2, staffId: 4, name: 'James Mitchell',  employeeId: 'EMP-0004', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60', role: 'Care Manager',          type: 'Medical Leave',   from: '15 Jun 2026', to: '16 Jun 2026', days: 2, reason: 'GP appointment and recovery.',               submittedOn: '9 Jun 2026',  status: 'pending',  adminNote: '' },
  { id: 3, staffId: 2, name: 'John Davies',     employeeId: 'EMP-0002', avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=60', role: 'Senior Support Worker', type: 'Annual Leave',    from: '30 Jun 2026', to: '4 Jul 2026',  days: 5, reason: 'Pre-booked holiday abroad.',                submittedOn: '5 Jun 2026',  status: 'approved', adminNote: 'Cover arranged with agency.' },
  { id: 4, staffId: 7, name: 'Lisa Anderson',   employeeId: 'EMP-0007', avatarUrl: 'https://images.unsplash.com/photo-1594824419266-9b16414777a8?w=800&auto=format&fit=crop&q=60', role: 'Nurse',                 type: 'Emergency Leave', from: '11 Jun 2026', to: '11 Jun 2026', days: 1, reason: 'Family emergency — urgent travel required.', submittedOn: '10 Jun 2026', status: 'approved', adminNote: '' },
  { id: 5, staffId: 3, name: 'Sarah Williams',  employeeId: 'EMP-0003', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60', role: 'Support Worker',        type: 'Annual Leave',    from: '14 Jun 2026', to: '14 Jun 2026', days: 1, reason: 'Personal appointment.',                     submittedOn: '7 Jun 2026',  status: 'declined', adminNote: 'Insufficient cover on that date.' },
];

let attendanceHistory: HistoryRecord[] = [
  { date: '2026-06-09', staffId: 1, name: 'Mary Thompson',  employeeId: 'EMP-0001', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60', clockIn: '07:01', clockOut: '15:03', scheduledIn: '07:00', scheduledOut: '15:00', location: 'Main House',     role: 'Support Worker',        hoursWorked: 8.0 },
  { date: '2026-06-09', staffId: 2, name: 'John Davies',    employeeId: 'EMP-0002', avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=60', clockIn: '07:12', clockOut: '15:00', scheduledIn: '07:00', scheduledOut: '15:00', location: 'Annex Building', role: 'Senior Support Worker',  hoursWorked: 7.8 },
  { date: '2026-06-09', staffId: 7, name: 'Lisa Anderson',  employeeId: 'EMP-0007', avatarUrl: 'https://images.unsplash.com/photo-1594824419266-9b16414777a8?w=800&auto=format&fit=crop&q=60', clockIn: '08:00', clockOut: '16:05', scheduledIn: '08:00', scheduledOut: '16:00', location: 'Main House',     role: 'Nurse',                 hoursWorked: 8.1 },
  { date: '2026-06-09', staffId: 4, name: 'James Mitchell', employeeId: 'EMP-0004', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60', clockIn: '09:20', clockOut: '17:01', scheduledIn: '09:00', scheduledOut: '17:00', location: 'Office',         role: 'Care Manager',          hoursWorked: 7.7 },
  { date: '2026-06-09', staffId: 3, name: 'Sarah Williams', employeeId: 'EMP-0003', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60', clockIn: '14:58', clockOut: '23:02', scheduledIn: '15:00', scheduledOut: '23:00', location: 'Main House',     role: 'Support Worker',        hoursWorked: 8.1 },
  { date: '2026-06-08', staffId: 1, name: 'Mary Thompson',  employeeId: 'EMP-0001', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60', clockIn: '07:05', clockOut: '15:00', scheduledIn: '07:00', scheduledOut: '15:00', location: 'Main House',     role: 'Support Worker',        hoursWorked: 7.9 },
  { date: '2026-06-08', staffId: 2, name: 'John Davies',    employeeId: 'EMP-0002', avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=60', clockIn: '06:55', clockOut: '15:10', scheduledIn: '07:00', scheduledOut: '15:00', location: 'Annex Building', role: 'Senior Support Worker',  hoursWorked: 8.3 },
  { date: '2026-06-08', staffId: 7, name: 'Lisa Anderson',  employeeId: 'EMP-0007', avatarUrl: 'https://images.unsplash.com/photo-1594824419266-9b16414777a8?w=800&auto=format&fit=crop&q=60', clockIn: '08:02', clockOut: '16:00', scheduledIn: '08:00', scheduledOut: '16:00', location: 'Main House',     role: 'Nurse',                 hoursWorked: 8.0 },
  { date: '2026-06-07', staffId: 1, name: 'Mary Thompson',  employeeId: 'EMP-0001', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60', clockIn: '07:00', clockOut: '15:00', scheduledIn: '07:00', scheduledOut: '15:00', location: 'Main House',     role: 'Support Worker',        hoursWorked: 8.0 },
  { date: '2026-06-07', staffId: 4, name: 'James Mitchell', employeeId: 'EMP-0004', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60', clockIn: '09:45', clockOut: '17:00', scheduledIn: '09:00', scheduledOut: '17:00', location: 'Office',         role: 'Care Manager',          hoursWorked: 7.3 },
  { date: '2026-06-06', staffId: 3, name: 'Sarah Williams', employeeId: 'EMP-0003', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60', clockIn: '15:02', clockOut: '23:00', scheduledIn: '15:00', scheduledOut: '23:00', location: 'Main House',     role: 'Support Worker',        hoursWorked: 8.0 },
  { date: '2026-06-06', staffId: 2, name: 'John Davies',    employeeId: 'EMP-0002', avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=60', clockIn: '07:00', clockOut: '15:01', scheduledIn: '07:00', scheduledOut: '15:00', location: 'Annex Building', role: 'Senior Support Worker',  hoursWorked: 8.0 },
];

let medications: MedicationRecord[] = [
  {
    id: 1,
    serviceUser: 'Sarah Johnson',
    userId: 1,
    userPhoto: '👧',
    medication: 'Sertraline',
    dosage: '50mg',
    time: '08:00',
    route: 'Oral',
    status: 'administered',
    administeredBy: 'Mary Thompson',
    administeredAt: '08:05',
    notes: '',
    riskLevel: 'amber',
  },
  {
    id: 2,
    serviceUser: 'Michael Thompson',
    userId: 2,
    userPhoto: '👦',
    medication: 'Methylphenidate',
    dosage: '20mg',
    time: '08:00',
    route: 'Oral',
    status: 'due',
    administeredBy: '',
    administeredAt: '',
    notes: '',
    riskLevel: 'green',
  },
  {
    id: 3,
    serviceUser: 'Emma Roberts',
    userId: 3,
    userPhoto: '👧',
    medication: 'Fluoxetine',
    dosage: '20mg',
    time: '08:00',
    route: 'Oral',
    status: 'administered',
    administeredBy: 'John Davies',
    administeredAt: '08:10',
    notes: '',
    riskLevel: 'green',
  },
  {
    id: 4,
    serviceUser: 'Oliver Parker',
    userId: 4,
    userPhoto: '👦',
    medication: 'Risperidone',
    dosage: '2mg',
    time: '09:00',
    route: 'Oral',
    status: 'due',
    administeredBy: '',
    administeredAt: '',
    notes: '',
    riskLevel: 'red',
  },
  {
    id: 5,
    serviceUser: 'Sarah Johnson',
    userId: 1,
    userPhoto: '👧',
    medication: 'Paracetamol (PRN)',
    dosage: '500mg',
    time: '10:30',
    route: 'Oral',
    status: 'refused',
    administeredBy: 'Mary Thompson',
    administeredAt: '10:30',
    notes: 'Patient refused, said feeling better',
    riskLevel: 'amber',
  },
  {
    id: 6,
    serviceUser: 'Michael Thompson',
    userId: 2,
    userPhoto: '👦',
    medication: 'Melatonin',
    dosage: '3mg',
    time: '19:00',
    route: 'Oral',
    status: 'pending',
    administeredBy: '',
    administeredAt: '',
    notes: '',
    riskLevel: 'green',
  },
  {
    id: 7,
    serviceUser: 'Emma Roberts',
    userId: 3,
    userPhoto: '👧',
    medication: 'Vitamin D',
    dosage: '1000 IU',
    time: '12:00',
    route: 'Oral',
    status: 'administered',
    administeredBy: 'Sarah Williams',
    administeredAt: '12:05',
    notes: '',
    riskLevel: 'green',
  },
  {
    id: 8,
    serviceUser: 'Oliver Parker',
    userId: 4,
    userPhoto: '👦',
    medication: 'Lorazepam (PRN)',
    dosage: '1mg',
    time: '11:00',
    route: 'Oral',
    status: 'missed',
    administeredBy: '',
    administeredAt: '',
    notes: 'Service user was off-site',
    riskLevel: 'red',
  },
  {
    id: 9,
    serviceUser: 'Sarah Johnson',
    userId: 1,
    userPhoto: '👧',
    medication: 'Sertraline',
    dosage: '50mg',
    time: '20:00',
    route: 'Oral',
    status: 'pending',
    administeredBy: '',
    administeredAt: '',
    notes: '',
    riskLevel: 'amber',
  },
  {
    id: 10,
    serviceUser: 'Michael Thompson',
    userId: 2,
    userPhoto: '👦',
    medication: 'Methylphenidate',
    dosage: '20mg',
    time: '12:00',
    route: 'Oral',
    status: 'administered',
    administeredBy: 'James Mitchell',
    administeredAt: '12:03',
    notes: '',
    riskLevel: 'green',
  },
];

// --- Super Admin / Multi-Tenant Types ---

export type LocationStatus = 'active' | 'paused' | 'closed';
export type Organisation = {
  id: number;
  name: string;
  plan: string;
  createdAt: string;
  billingEmail: string;
  address: string;
  dataRetentionYears: number;
};
export type Location = {
  id: number;
  orgId: number;
  name: string;
  region: string;
  address: string;
  timezone: string;
  capacity: number;
  occupancy: number;
  status: LocationStatus;
  manager: string;
  openedAt: string;
};
export type Role = {
  id: number;
  name: string;
  scope: 'org' | 'location';
  permissions: string[];
  description: string;
};
export type AdminUserStatus = 'active' | 'suspended' | 'invited';
export type AdminUser = {
  id: number;
  orgId: number;
  name: string;
  email: string;
  roleId: number;
  locationScope: number[] | 'all';
  status: AdminUserStatus;
  lastLogin: string;
  avatarUrl: string;
};
export type AuditLogEntry = {
  id: number;
  orgId: number;
  actorId: number;
  actorName: string;
  action: string;
  entityType: string;
  entityId: number | string;
  locationId: number | null;
  at: string;
  meta: string;
};
export type InvoiceStatus = 'paid' | 'due' | 'overdue';
export type BillingInvoice = {
  id: number;
  orgId: number;
  locationId: number | null;
  locationName: string;
  period: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
};
export type ComplianceMatrixCell = {
  locationId: number;
  area: string;
  score: number;
  status: 'green' | 'amber' | 'red';
  lastReviewed: string;
};
export type OrgAlert = {
  id: number;
  locationId: number;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  raisedAt: string;
  acknowledged: boolean;
  acknowledgedBy: string;
};

// --- Super Admin In-Memory State ---

let organisation: Organisation = {
  id: 1,
  name: 'MpoweredCare Group',
  plan: 'Enterprise',
  createdAt: '2021-04-12',
  billingEmail: 'billing@mpoweredcare.com',
  address: '25 Kingsway, London, WC2B 6LE',
  dataRetentionYears: 7
};

let locations: Location[] = [
  { id: 1, orgId: 1, name: 'Riverside House',  region: 'London',       address: '14 Riverside Rd, London',         timezone: 'Europe/London', capacity: 24, occupancy: 22, status: 'active', manager: 'Dr. Emily Carter', openedAt: '2019-03-01' },
  { id: 2, orgId: 1, name: 'Oak Tree Lodge',   region: 'Manchester',   address: '3 Oak Tree Lane, Manchester',      timezone: 'Europe/London', capacity: 18, occupancy: 17, status: 'active', manager: 'Sarah Williams',   openedAt: '2020-06-15' },
  { id: 3, orgId: 1, name: 'Meadow View',      region: 'Bristol',      address: '89 Meadow View, Bristol',          timezone: 'Europe/London', capacity: 20, occupancy: 14, status: 'active', manager: 'James Mitchell',   openedAt: '2022-09-05' },
  { id: 4, orgId: 1, name: 'Birchwood Court',  region: 'Birmingham',   address: '42 Birchwood Ave, Birmingham',     timezone: 'Europe/London', capacity: 16, occupancy: 13, status: 'active', manager: 'Priya Shah',       openedAt: '2023-01-10' },
  { id: 5, orgId: 1, name: 'Hazel Lodge',      region: 'Leeds',        address: '7 Hazel Grove, Leeds',             timezone: 'Europe/London', capacity: 22, occupancy: 19, status: 'active', manager: 'Rohan Patel',      openedAt: '2021-11-20' },
  { id: 6, orgId: 1, name: 'Cedar Heights',    region: 'Edinburgh',    address: '18 Cedar Lane, Edinburgh',         timezone: 'Europe/London', capacity: 14, occupancy: 10, status: 'paused', manager: 'Ada McGregor',     openedAt: '2023-07-01' },
  { id: 7, orgId: 1, name: 'Willow Springs',   region: 'Cardiff',      address: '55 Willow Rd, Cardiff',            timezone: 'Europe/London', capacity: 18, occupancy: 16, status: 'active', manager: 'James Mitchell',   openedAt: '2022-03-14' },
  { id: 8, orgId: 1, name: 'Ashford Grange',   region: 'Sheffield',    address: '21 Ashford Rd, Sheffield',         timezone: 'Europe/London', capacity: 20, occupancy: 15, status: 'active', manager: 'Tom Hargreaves',   openedAt: '2023-05-18' },
  { id: 9, orgId: 1, name: 'Elmwood House',    region: 'Nottingham',   address: '9 Elmwood Close, Nottingham',      timezone: 'Europe/London', capacity: 12, occupancy: 11, status: 'active', manager: 'Fiona Baxter',     openedAt: '2024-02-01' },
  { id:10, orgId: 1, name: 'Maple Rise',       region: 'Newcastle',    address: '33 Maple Rise, Newcastle',         timezone: 'Europe/London', capacity: 18, occupancy:  8, status: 'paused', manager: 'Callum Reid',      openedAt: '2024-06-10' },
  { id:11, orgId: 1, name: 'Sycamore Place',   region: 'Southampton',  address: '64 Sycamore Pl, Southampton',      timezone: 'Europe/London', capacity: 16, occupancy: 14, status: 'active', manager: 'Nkechi Obi',       openedAt: '2023-09-22' },
];

let roles: Role[] = [
  { id: 1, name: 'Super Admin', scope: 'org',      permissions: ['*'],                                            description: 'Full organisation-wide access.' },
  { id: 2, name: 'Regional Director', scope: 'org', permissions: ['view.*', 'edit.compliance', 'edit.financial'], description: 'Cross-location oversight, limited edit.' },
  { id: 3, name: 'Location Admin',    scope: 'location', permissions: ['view.*', 'edit.staff', 'edit.serviceUser'], description: 'Manages a single location.' },
  { id: 4, name: 'Care Manager',      scope: 'location', permissions: ['view.serviceUser', 'edit.carePlan'],       description: 'Clinical oversight within a location.' }
];

let adminUsers: AdminUser[] = [
  { id:  1, orgId: 1, name: 'Ada McGregor',      email: 'ada@mpoweredcare.com',         roleId: 1, locationScope: 'all',    status: 'active',    lastLogin: '2026-07-05 08:12', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60' },
  { id:  2, orgId: 1, name: 'Rohan Patel',        email: 'rohan@mpoweredcare.com',       roleId: 2, locationScope: 'all',    status: 'active',    lastLogin: '2026-07-04 17:44', avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=60' },
  { id:  3, orgId: 1, name: 'Dr. Emily Carter',   email: 'emily@mpoweredcare.com',       roleId: 3, locationScope: [1],      status: 'active',    lastLogin: '2026-07-05 07:02', avatarUrl: 'https://images.unsplash.com/photo-1594824419266-9b16414777a8?w=800&auto=format&fit=crop&q=60' },
  { id:  4, orgId: 1, name: 'Sarah Williams',     email: 's.williams@mpoweredcare.com',  roleId: 3, locationScope: [2],      status: 'active',    lastLogin: '2026-07-04 22:01', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60' },
  { id:  5, orgId: 1, name: 'James Mitchell',     email: 'j.mitchell@mpoweredcare.com',  roleId: 3, locationScope: [3],      status: 'active',    lastLogin: '2026-07-03 09:20', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60' },
  { id:  6, orgId: 1, name: 'Priya Shah',         email: 'priya@mpoweredcare.com',       roleId: 4, locationScope: [1, 2],   status: 'invited',   lastLogin: '—',                avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60' },
  { id:  7, orgId: 1, name: 'Marcus Okafor',      email: 'm.okafor@mpoweredcare.com',    roleId: 3, locationScope: [4],      status: 'active',    lastLogin: '2026-07-05 06:55', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60' },
  { id:  8, orgId: 1, name: 'Fiona Baxter',       email: 'f.baxter@mpoweredcare.com',    roleId: 4, locationScope: [4, 5],   status: 'active',    lastLogin: '2026-07-04 14:30', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60' },
  { id:  9, orgId: 1, name: 'Tom Hargreaves',     email: 't.hargreaves@mpoweredcare.com',roleId: 3, locationScope: [5],      status: 'active',    lastLogin: '2026-07-03 16:10', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60' },
  { id: 10, orgId: 1, name: 'Amara Diallo',       email: 'a.diallo@mpoweredcare.com',    roleId: 4, locationScope: [6],      status: 'suspended', lastLogin: '2026-06-28 09:40', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60' },
  { id: 11, orgId: 1, name: 'Callum Reid',        email: 'c.reid@mpoweredcare.com',      roleId: 3, locationScope: [6, 7],   status: 'active',    lastLogin: '2026-07-05 07:30', avatarUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60' },
  { id: 12, orgId: 1, name: 'Nkechi Obi',         email: 'n.obi@mpoweredcare.com',       roleId: 4, locationScope: [7],      status: 'invited',   lastLogin: '—',                avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=60' },
  { id: 13, orgId: 1, name: 'David Thornton',     email: 'd.thornton@mpoweredcare.com',  roleId: 2, locationScope: [1,2,3],  status: 'active',    lastLogin: '2026-07-04 11:05', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60' },
];

let auditLog: AuditLogEntry[] = [
  // Org-level
  { id:  1, orgId: 1, actorId: 1, actorName: 'Ada McGregor',     action: 'user.invited',          entityType: 'AdminUser',    entityId: 6,  locationId: null, at: '2026-07-05 08:14', meta: 'Invited priya@mpoweredcare.com as Care Manager.' },
  { id:  2, orgId: 1, actorId: 1, actorName: 'Ada McGregor',     action: 'role.updated',           entityType: 'Role',         entityId: 3,  locationId: null, at: '2026-07-04 10:01', meta: 'Updated Location Admin permissions.' },
  // Location 1 — Riverside House
  { id:  3, orgId: 1, actorId: 3, actorName: 'Dr. Emily Carter', action: 'medication.administered',entityType: 'Medication',   entityId: 1,  locationId: 1,    at: '2026-07-05 08:05', meta: 'Marked Sertraline as administered for Sarah Johnson.' },
  { id:  4, orgId: 1, actorId: 3, actorName: 'Dr. Emily Carter', action: 'care-plan.updated',      entityType: 'CarePlan',     entityId: 11, locationId: 1,    at: '2026-07-05 07:50', meta: 'Updated care plan goals for Emma Roberts.' },
  { id:  5, orgId: 1, actorId: 3, actorName: 'Dr. Emily Carter', action: 'incident.logged',        entityType: 'Incident',     entityId: 31, locationId: 1,    at: '2026-07-04 14:22', meta: 'Logged minor fall incident — no injury.' },
  { id:  6, orgId: 1, actorId: 2, actorName: 'Rohan Patel',      action: 'invoice.viewed',         entityType: 'Invoice',      entityId: 10, locationId: 1,    at: '2026-07-04 13:00', meta: 'Viewed June invoice for Riverside House.' },
  { id:  7, orgId: 1, actorId: 3, actorName: 'Dr. Emily Carter', action: 'staff.clock-out',        entityType: 'Staff',        entityId: 1,  locationId: 1,    at: '2026-07-04 15:03', meta: 'Clocked out Mary Thompson (admin override).' },
  { id:  8, orgId: 1, actorId: 3, actorName: 'Dr. Emily Carter', action: 'medication.missed',      entityType: 'Medication',   entityId: 5,  locationId: 1,    at: '2026-07-03 10:35', meta: 'Paracetamol PRN marked as refused by Sarah Johnson.' },
  { id:  9, orgId: 1, actorId: 2, actorName: 'Rohan Patel',      action: 'compliance.reviewed',    entityType: 'Compliance',   entityId: 21, locationId: 1,    at: '2026-07-03 09:15', meta: 'Fire Safety compliance reviewed — score 88%.' },
  { id: 10, orgId: 1, actorId: 3, actorName: 'Dr. Emily Carter', action: 'service-user.updated',   entityType: 'ServiceUser',  entityId: 1,  locationId: 1,    at: '2026-07-02 16:44', meta: 'Updated risk level for Sarah Johnson to amber.' },
  { id: 11, orgId: 1, actorId: 3, actorName: 'Dr. Emily Carter', action: 'leave.approved',         entityType: 'LeaveRequest', entityId: 4,  locationId: 1,    at: '2026-07-02 12:00', meta: 'Approved emergency leave for Lisa Anderson.' },
  // Location 2 — Oak Tree Lodge
  { id: 12, orgId: 1, actorId: 4, actorName: 'Sarah Williams',   action: 'leave.approved',         entityType: 'LeaveRequest', entityId: 3,  locationId: 2,    at: '2026-07-04 16:22', meta: 'Approved annual leave for John Davies.' },
  { id: 13, orgId: 1, actorId: 4, actorName: 'Sarah Williams',   action: 'medication.administered',entityType: 'Medication',   entityId: 3,  locationId: 2,    at: '2026-07-05 08:10', meta: 'Marked Fluoxetine as administered for Emma Roberts.' },
  { id: 14, orgId: 1, actorId: 4, actorName: 'Sarah Williams',   action: 'incident.logged',        entityType: 'Incident',     entityId: 32, locationId: 2,    at: '2026-07-04 11:05', meta: 'Logged behavioural incident — de-escalated.' },
  { id: 15, orgId: 1, actorId: 4, actorName: 'Sarah Williams',   action: 'staff.added',            entityType: 'Staff',        entityId: 8,  locationId: 2,    at: '2026-07-03 14:30', meta: 'Added agency support worker to rota.' },
  { id: 16, orgId: 1, actorId: 4, actorName: 'Sarah Williams',   action: 'care-plan.created',      entityType: 'CarePlan',     entityId: 14, locationId: 2,    at: '2026-07-03 10:00', meta: 'Created new care plan for Sophie Martinez.' },
  { id: 17, orgId: 1, actorId: 4, actorName: 'Sarah Williams',   action: 'compliance.updated',     entityType: 'Compliance',   entityId: 22, locationId: 2,    at: '2026-07-02 15:55', meta: 'Updated training records — 3 staff renewed certificates.' },
  { id: 18, orgId: 1, actorId: 4, actorName: 'Sarah Williams',   action: 'service-user.updated',   entityType: 'ServiceUser',  entityId: 5,  locationId: 2,    at: '2026-07-01 09:20', meta: 'Updated mood and wellbeing log for Sophie Martinez.' },
  // Location 3 — Meadow View
  { id: 19, orgId: 1, actorId: 1, actorName: 'Ada McGregor',     action: 'location.updated',       entityType: 'Location',     entityId: 3,  locationId: 3,    at: '2026-07-03 11:07', meta: 'Updated Meadow View capacity to 20.' },
  { id: 20, orgId: 1, actorId: 5, actorName: 'James Mitchell',   action: 'incident.logged',        entityType: 'Incident',     entityId: 44, locationId: 3,    at: '2026-07-02 09:12', meta: 'Logged behavioural incident for Lucas Chen.' },
  { id: 21, orgId: 1, actorId: 5, actorName: 'James Mitchell',   action: 'medication.administered',entityType: 'Medication',   entityId: 4,  locationId: 3,    at: '2026-07-05 09:10', meta: 'Administered Risperidone for Oliver Parker.' },
  { id: 22, orgId: 1, actorId: 5, actorName: 'James Mitchell',   action: 'care-plan.reviewed',     entityType: 'CarePlan',     entityId: 17, locationId: 3,    at: '2026-07-04 13:45', meta: 'Quarterly review completed for Lucas Chen.' },
  { id: 23, orgId: 1, actorId: 5, actorName: 'James Mitchell',   action: 'staff.clock-out',        entityType: 'Staff',        entityId: 4,  locationId: 3,    at: '2026-07-04 17:01', meta: 'Clocked out James Mitchell.' },
  { id: 24, orgId: 1, actorId: 5, actorName: 'James Mitchell',   action: 'leave.declined',         entityType: 'LeaveRequest', entityId: 5,  locationId: 3,    at: '2026-07-03 16:00', meta: 'Declined leave request — insufficient cover.' },
  { id: 25, orgId: 1, actorId: 5, actorName: 'James Mitchell',   action: 'compliance.reviewed',    entityType: 'Compliance',   entityId: 23, locationId: 3,    at: '2026-07-02 11:30', meta: 'CQC Standards review — score 79%.' },
  { id: 26, orgId: 1, actorId: 5, actorName: 'James Mitchell',   action: 'service-user.updated',   entityType: 'ServiceUser',  entityId: 6,  locationId: 3,    at: '2026-07-01 14:20', meta: 'Updated risk assessment for Lucas Chen to red.' },
];

let invoices: BillingInvoice[] = [
  // 2026-07 (current — due)
  { id: 10, orgId: 1, locationId: 1, locationName: 'Riverside House', period: '2026-07', amount: 49100, status: 'due',     issuedAt: '2026-07-01', dueAt: '2026-07-31', paidAt: null },
  { id: 11, orgId: 1, locationId: 2, locationName: 'Oak Tree Lodge',  period: '2026-07', amount: 37200, status: 'due',     issuedAt: '2026-07-01', dueAt: '2026-07-31', paidAt: null },
  { id: 12, orgId: 1, locationId: 3, locationName: 'Meadow View',     period: '2026-07', amount: 30400, status: 'due',     issuedAt: '2026-07-01', dueAt: '2026-07-31', paidAt: null },
  // 2026-06
  { id: 13, orgId: 1, locationId: 1, locationName: 'Riverside House', period: '2026-06', amount: 48250, status: 'paid',    issuedAt: '2026-06-30', dueAt: '2026-07-15', paidAt: '2026-07-02' },
  { id: 14, orgId: 1, locationId: 2, locationName: 'Oak Tree Lodge',  period: '2026-06', amount: 36740, status: 'overdue', issuedAt: '2026-06-30', dueAt: '2026-07-15', paidAt: null },
  { id: 15, orgId: 1, locationId: 3, locationName: 'Meadow View',     period: '2026-06', amount: 29910, status: 'overdue', issuedAt: '2026-06-30', dueAt: '2026-07-15', paidAt: null },
  // 2026-05
  { id: 16, orgId: 1, locationId: 1, locationName: 'Riverside House', period: '2026-05', amount: 47100, status: 'paid',    issuedAt: '2026-05-31', dueAt: '2026-06-15', paidAt: '2026-06-04' },
  { id: 17, orgId: 1, locationId: 2, locationName: 'Oak Tree Lodge',  period: '2026-05', amount: 35980, status: 'paid',    issuedAt: '2026-05-31', dueAt: '2026-06-15', paidAt: '2026-06-08' },
  { id: 18, orgId: 1, locationId: 3, locationName: 'Meadow View',     period: '2026-05', amount: 28150, status: 'paid',    issuedAt: '2026-05-31', dueAt: '2026-06-15', paidAt: '2026-06-11' },
  // 2026-04
  { id: 19, orgId: 1, locationId: 1, locationName: 'Riverside House', period: '2026-04', amount: 46800, status: 'paid',    issuedAt: '2026-04-30', dueAt: '2026-05-15', paidAt: '2026-05-03' },
  { id: 20, orgId: 1, locationId: 2, locationName: 'Oak Tree Lodge',  period: '2026-04', amount: 35200, status: 'paid',    issuedAt: '2026-04-30', dueAt: '2026-05-15', paidAt: '2026-05-07' },
  { id: 21, orgId: 1, locationId: 3, locationName: 'Meadow View',     period: '2026-04', amount: 27600, status: 'paid',    issuedAt: '2026-04-30', dueAt: '2026-05-15', paidAt: '2026-05-10' },
  // 2026-03
  { id: 22, orgId: 1, locationId: 1, locationName: 'Riverside House', period: '2026-03', amount: 46100, status: 'paid',    issuedAt: '2026-03-31', dueAt: '2026-04-15', paidAt: '2026-04-02' },
  { id: 23, orgId: 1, locationId: 2, locationName: 'Oak Tree Lodge',  period: '2026-03', amount: 34800, status: 'paid',    issuedAt: '2026-03-31', dueAt: '2026-04-15', paidAt: '2026-04-06' },
  { id: 24, orgId: 1, locationId: 3, locationName: 'Meadow View',     period: '2026-03', amount: 27100, status: 'paid',    issuedAt: '2026-03-31', dueAt: '2026-04-15', paidAt: '2026-04-09' },
];

const complianceAreas = ['Safeguarding', 'Medication', 'Fire Safety', 'Training', 'CQC Standards', 'Data Protection'];
let complianceMatrix: ComplianceMatrixCell[] = locations.flatMap(loc =>
  complianceAreas.map((area, i) => {
    const score = 65 + ((loc.id * 7 + i * 11) % 34);
    const status: ComplianceMatrixCell['status'] = score >= 90 ? 'green' : score >= 75 ? 'amber' : 'red';
    return { locationId: loc.id, area, score, status, lastReviewed: '2026-06-2' + (i % 9) };
  })
);

let orgAlerts: OrgAlert[] = [
  { id: 1, locationId: 3, severity: 'critical', category: 'Medication', title: 'Missed dose — Lucas Chen', description: 'Risperidone 2mg not administered at 09:00.', raisedAt: '2026-07-05 09:15', acknowledged: false, acknowledgedBy: '' },
  { id: 2, locationId: 2, severity: 'warning',  category: 'Compliance', title: 'Fire drill overdue',        description: 'Last drill 14 weeks ago (policy: 12).',      raisedAt: '2026-07-04 12:00', acknowledged: false, acknowledgedBy: '' },
  { id: 3, locationId: 1, severity: 'warning',  category: 'Staffing',   title: 'Understaffed night shift',  description: 'Only 1 support worker on rota tonight.',     raisedAt: '2026-07-05 07:40', acknowledged: false, acknowledgedBy: '' },
  { id: 4, locationId: 3, severity: 'info',     category: 'Care Plan',  title: '2 care plans due review',   description: 'Reviews overdue by >7 days.',                 raisedAt: '2026-07-03 10:00', acknowledged: true,  acknowledgedBy: 'Ada McGregor' }
];

// --- Database Helpers / Accessors ---

export const mockStore = {
  getAlerts: () => [...alerts],
  
  getServiceUsers: () => [...serviceUsers],
  
  getServiceUserById: (id: number) => serviceUsers.find(u => u.id === id),
  
  addServiceUser: (user: Omit<ServiceUser, 'id'>) => {
    const newId = serviceUsers.length > 0 ? Math.max(...serviceUsers.map(u => u.id)) + 1 : 1;
    const newUser: ServiceUser = { ...user, id: newId };
    serviceUsers.push(newUser);
    return newUser;
  },

  getStaffMembers: () => [...staffMembers],
  
  addStaffMember: (staff: Omit<StaffMember, 'id'>) => {
    const newId = staffMembers.length > 0 ? Math.max(...staffMembers.map(s => s.id)) + 1 : 1;
    const newStaff: StaffMember = { ...staff, id: newId };
    staffMembers.push(newStaff);
    
    // Add an initial clock event for the new staff member as well
    const newEvent: ClockEvent = {
      staffId: newId,
      name: newStaff.name,
      employeeId: newStaff.employeeId,
      avatarUrl: newStaff.avatarUrl,
      clockIn: null,
      clockOut: null,
      scheduledIn: '09:00',
      scheduledOut: '17:00',
      location: newStaff.location,
      role: newStaff.role
    };
    clockEvents.push(newEvent);
    
    return newStaff;
  },

  getClockEvents: () => [...clockEvents],
  
  clockOutStaff: (staffId: number, note?: string) => {
    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    let updatedEvent: ClockEvent | null = null;
    clockEvents = clockEvents.map(e => {
      if (e.staffId === staffId) {
        updatedEvent = { ...e, clockOut: nowStr };
        return updatedEvent;
      }
      return e;
    });
    return updatedEvent;
  },

  clockInStaff: (staffId: number) => {
    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    let updatedEvent: ClockEvent | null = null;
    clockEvents = clockEvents.map(e => {
      if (e.staffId === staffId) {
        updatedEvent = { ...e, clockIn: nowStr, clockOut: null };
        return updatedEvent;
      }
      return e;
    });
    return updatedEvent;
  },

  getLeaveRequests: () => [...leaveRequests],
  
  updateLeaveRequestStatus: (id: number, status: LeaveStatus, note?: string) => {
    let updatedRequest: LeaveRequest | null = null;
    leaveRequests = leaveRequests.map(r => {
      if (r.id === id) {
        updatedRequest = { ...r, status, adminNote: note || '' };
        return updatedRequest;
      }
      return r;
    });
    return updatedRequest;
  },

  logLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'submittedOn'>) => {
    const newId = Date.now();
    const submittedOn = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const newRequest: LeaveRequest = {
      ...request,
      id: newId,
      submittedOn
    };
    leaveRequests.unshift(newRequest);
    return newRequest;
  },

  getAttendanceHistory: () => [...attendanceHistory],

  getMedications: () => [...medications],

  addMedications: (newMeds: Omit<MedicationRecord, 'id' | 'status' | 'administeredBy' | 'administeredAt' | 'notes'>[]) => {
    const added: MedicationRecord[] = [];
    newMeds.forEach(med => {
      const newId = medications.length > 0 ? Math.max(...medications.map(m => m.id)) + 1 : 1;
      const newRecord: MedicationRecord = {
        ...med,
        id: newId,
        status: 'due',
        administeredBy: '',
        administeredAt: '',
        notes: ''
      };
      medications.push(newRecord);
      added.push(newRecord);
    });
    return added;
  },

  administerMedication: (id: number, administeredBy: string, notes?: string) => {
    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    let updated: MedicationRecord | null = null;
    medications = medications.map(m => {
      if (m.id === id) {
        updated = {
          ...m,
          status: 'administered',
          administeredBy,
          administeredAt: nowStr,
          notes: notes || ''
        };
        return updated;
      }
      return m;
    });
    return updated;
  },

  updateMedicationStatus: (id: number, status: string, notes?: string) => {
    let updated: MedicationRecord | null = null;
    medications = medications.map(m => {
      if (m.id === id) {
        updated = {
          ...m,
          status,
          notes: notes || ''
        };
        return updated;
      }
      return m;
    });
    return updated;
  },

  updateMedicationSchedule: (id: number, schedule: Partial<MedicationRecord>) => {
    let updated: MedicationRecord | null = null;
    medications = medications.map(m => {
      if (m.id === id) {
        updated = {
          ...m,
          ...schedule
        };
        return updated;
      }
      return m;
    });
    return updated;
  },

  // --- Super Admin accessors ---
  getOrganisation: () => ({ ...organisation }),
  updateOrganisation: (patch: Partial<Organisation>) => {
    organisation = { ...organisation, ...patch };
    return { ...organisation };
  },

  getLocations: () => [...locations],
  getLocationById: (id: number) => locations.find(l => l.id === id),
  addLocation: (loc: Omit<Location, 'id' | 'orgId'>) => {
    const newId = locations.length ? Math.max(...locations.map(l => l.id)) + 1 : 1;
    const newLoc: Location = { ...loc, id: newId, orgId: organisation.id };
    locations.push(newLoc);
    return newLoc;
  },
  updateLocation: (id: number, patch: Partial<Location>) => {
    let updated: Location | null = null;
    locations = locations.map(l => {
      if (l.id === id) { updated = { ...l, ...patch }; return updated; }
      return l;
    });
    return updated;
  },
  setLocationStatus: (id: number, status: LocationStatus) => {
    return mockStore.updateLocation(id, { status });
  },
  archiveLocation: (id: number) => {
    const removed = locations.find(l => l.id === id);
    locations = locations.filter(l => l.id !== id);
    return removed || null;
  },
  getLocationSummary: (id: number) => {
    const loc = locations.find(l => l.id === id);
    if (!loc) return null;
    const suCount = serviceUsers.filter(s => s.location === loc.name).length;
    const staffCount = staffMembers.filter(s => s.location === loc.name).length;
    const openAlerts = orgAlerts.filter(a => a.locationId === id && !a.acknowledged).length;
    const compAvg = Math.round(
      complianceMatrix.filter(c => c.locationId === id).reduce((s, c) => s + c.score, 0) /
      complianceMatrix.filter(c => c.locationId === id).length
    );
    return { location: loc, serviceUsers: suCount, staff: staffCount, openAlerts, complianceScore: compAvg };
  },

  getAdminUsers: () => [...adminUsers],
  inviteAdminUser: (payload: Omit<AdminUser, 'id' | 'orgId' | 'status' | 'lastLogin' | 'avatarUrl'> & { status?: AdminUserStatus; lastLogin?: string; avatarUrl?: string }) => {
    const newId = adminUsers.length ? Math.max(...adminUsers.map(u => u.id)) + 1 : 1;
    const newUser: AdminUser = {
      id: newId,
      orgId: organisation.id,
      status: payload.status || 'invited',
      lastLogin: payload.lastLogin || '—',
      avatarUrl: payload.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
      ...payload
    };
    adminUsers.push(newUser);
    return newUser;
  },
  updateAdminUser: (id: number, patch: Partial<AdminUser>) => {
    let updated: AdminUser | null = null;
    adminUsers = adminUsers.map(u => {
      if (u.id === id) { updated = { ...u, ...patch }; return updated; }
      return u;
    });
    return updated;
  },
  setAdminUserStatus: (id: number, status: AdminUserStatus) => mockStore.updateAdminUser(id, { status }),
  setUserLocationScope: (id: number, scope: number[] | 'all') => mockStore.updateAdminUser(id, { locationScope: scope }),
  resetAdminUserPassword: (id: number) => {
    const u = adminUsers.find(a => a.id === id);
    return u ? { ok: true, tempPassword: 'Temp-' + Math.random().toString(36).slice(2, 8) } : { ok: false };
  },

  getRoles: () => [...roles],
  addRole: (r: Omit<Role, 'id'>) => {
    const newId = roles.length ? Math.max(...roles.map(x => x.id)) + 1 : 1;
    const nr: Role = { ...r, id: newId };
    roles.push(nr);
    return nr;
  },
  updateRole: (id: number, patch: Partial<Role>) => {
    let updated: Role | null = null;
    roles = roles.map(r => {
      if (r.id === id) { updated = { ...r, ...patch }; return updated; }
      return r;
    });
    return updated;
  },
  deleteRole: (id: number) => {
    const removed = roles.find(r => r.id === id);
    roles = roles.filter(r => r.id !== id);
    return removed || null;
  },
  getPermissionCatalog: () => [
    'view.dashboard', 'view.serviceUser', 'edit.serviceUser',
    'view.staff', 'edit.staff', 'view.medication', 'edit.medication',
    'view.compliance', 'edit.compliance', 'view.financial', 'edit.financial',
    'view.audit', 'edit.carePlan', 'edit.incident', 'admin.users', 'admin.locations', 'admin.roles', '*'
  ],

  getComplianceMatrix: () => [...complianceMatrix],
  getComplianceSummary: (locationId?: number | 'all') => {
    const cells = locationId && locationId !== 'all'
      ? complianceMatrix.filter(c => c.locationId === locationId)
      : complianceMatrix;
    const avg = Math.round(cells.reduce((s, c) => s + c.score, 0) / cells.length);
    const red = cells.filter(c => c.status === 'red').length;
    const amber = cells.filter(c => c.status === 'amber').length;
    const green = cells.filter(c => c.status === 'green').length;
    return { averageScore: avg, red, amber, green, total: cells.length };
  },
  getExpiringCompliance: (days: number) => {
    return complianceMatrix
      .filter(c => c.status !== 'green')
      .map(c => ({ ...c, expiresIn: Math.max(1, (days - (c.locationId * 3 + c.area.length) % days)) }))
      .sort((a, b) => a.expiresIn - b.expiresIn);
  },

  getInvoices: () => [...invoices],
  getFinancialSummary: (locationId?: number | 'all') => {
    const invs = locationId && locationId !== 'all'
      ? invoices.filter(i => i.locationId === locationId)
      : invoices;
    const revenue = invs.reduce((s, i) => s + i.amount, 0);
    const outstanding = invs.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
    const overdue = invs.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
    return { revenue, outstanding, overdue, count: invs.length };
  },
  getFinancialByLocation: () => locations.map(l => ({
    locationId: l.id,
    locationName: l.name,
    revenue: invoices.filter(i => i.locationId === l.id).reduce((s, i) => s + i.amount, 0),
    outstanding: invoices.filter(i => i.locationId === l.id && i.status !== 'paid').reduce((s, i) => s + i.amount, 0)
  })),
  markInvoicePaid: (id: number, paidAt?: string) => {
    let updated: BillingInvoice | null = null;
    invoices = invoices.map(i => {
      if (i.id === id) { updated = { ...i, status: 'paid', paidAt: paidAt || new Date().toISOString().slice(0,10) }; return updated; }
      return i;
    });
    return updated;
  },
  getPayouts: () => [
    { id: 1, period: '2026-06', staffCosts: 82400, agencyCosts: 6200, other: 3400 },
    { id: 2, period: '2026-05', staffCosts: 80100, agencyCosts: 7100, other: 3200 }
  ],

  getAuditLog: (filters?: { actorId?: number; action?: string; locationId?: number; from?: string; to?: string; page?: number }) => {
    let data = [...auditLog];
    if (filters?.actorId) data = data.filter(a => a.actorId === filters.actorId);
    if (filters?.action) data = data.filter(a => a.action.includes(filters.action!));
    if (filters?.locationId) data = data.filter(a => a.locationId === filters.locationId);
    return data;
  },
  addAuditLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'orgId' | 'at'>) => {
    const newId = auditLog.length ? Math.max(...auditLog.map(a => a.id)) + 1 : 1;
    const at = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const ne: AuditLogEntry = { id: newId, orgId: organisation.id, at, ...entry };
    auditLog.unshift(ne);
    return ne;
  },

  getOrgAlerts: (locationId?: number | 'all', severity?: string) => {
    let data = [...orgAlerts];
    if (locationId && locationId !== 'all') data = data.filter(a => a.locationId === locationId);
    if (severity) data = data.filter(a => a.severity === severity);
    return data;
  },
  acknowledgeAlert: (id: number, actorName: string) => {
    let updated: OrgAlert | null = null;
    orgAlerts = orgAlerts.map(a => {
      if (a.id === id) { updated = { ...a, acknowledged: true, acknowledgedBy: actorName }; return updated; }
      return a;
    });
    return updated;
  },

  getOrgOverview: () => {
    const totalSU = serviceUsers.length;
    const totalStaff = staffMembers.length;
    const openAlerts = orgAlerts.filter(a => !a.acknowledged).length;
    const compAvg = Math.round(complianceMatrix.reduce((s, c) => s + c.score, 0) / complianceMatrix.length);
    const revenue = invoices.reduce((s, i) => s + i.amount, 0);
    const outstanding = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
    const perLocation = locations.map(l => mockStore.getLocationSummary(l.id)!);
    const topRisks = orgAlerts.filter(a => !a.acknowledged).slice(0, 5);
    return { totalLocations: locations.length, totalServiceUsers: totalSU, totalStaff, openAlerts, complianceAverage: compAvg, revenue, outstanding, perLocation, topRisks };
  },

  getOrgAnalytics: (_range?: string) => ({
    occupancyTrend: [
      { month: 'Feb', value: 78 }, { month: 'Mar', value: 82 }, { month: 'Apr', value: 85 },
      { month: 'May', value: 88 }, { month: 'Jun', value: 89 }, { month: 'Jul', value: 91 }
    ],
    incidentsTrend: [
      { month: 'Feb', value: 12 }, { month: 'Mar', value: 9 }, { month: 'Apr', value: 14 },
      { month: 'May', value: 8 },  { month: 'Jun', value: 11 }, { month: 'Jul', value: 6 }
    ],
    staffTurnover: [
      { month: 'Feb', value: 4 }, { month: 'Mar', value: 3 }, { month: 'Apr', value: 5 },
      { month: 'May', value: 2 }, { month: 'Jun', value: 3 }, { month: 'Jul', value: 1 }
    ],
    medicationAdherence: [
      { month: 'Feb', value: 96 }, { month: 'Mar', value: 97 }, { month: 'Apr', value: 95 },
      { month: 'May', value: 98 }, { month: 'Jun', value: 97 }, { month: 'Jul', value: 98 }
    ]
  }),

  getServiceUsersSummary: (locationId?: number | 'all') => {
    const locName = locationId && locationId !== 'all' ? locations.find(l => l.id === locationId)?.name : null;
    const list = locName ? serviceUsers.filter(s => s.location === locName) : serviceUsers;
    return {
      total: list.length,
      red: list.filter(s => s.riskLevel === 'red').length,
      amber: list.filter(s => s.riskLevel === 'amber').length,
      green: list.filter(s => s.riskLevel === 'green').length
    };
  },
  getStaffSummary: (locationId?: number | 'all') => {
    const locName = locationId && locationId !== 'all' ? locations.find(l => l.id === locationId)?.name : null;
    const list = locName ? staffMembers.filter(s => s.location === locName) : staffMembers;
    return {
      total: list.length,
      active: list.filter(s => s.status === 'Active').length,
      onLeave: list.filter(s => s.status === 'On Leave').length
    };
  },
  getIncidentsSummary: () => ({ total: 32, critical: 3, moderate: 12, minor: 17 }),
  getMedicationAdherence: () => {
    const done = medications.filter(m => m.status === 'administered').length;
    const total = medications.length;
    return { rate: Math.round((done / total) * 100), administered: done, missed: medications.filter(m => m.status === 'missed').length, total };
  },
  getAttendanceSummary: () => ({ onTime: 22, late: 3, absent: 1 }),
  getRecruitmentSummary: () => ({ openRoles: 4, applicants: 27, interviewsThisWeek: 6, rejected: 12 }),
  getCarePlanReviewStatus: () => ({ upToDate: 18, dueSoon: 4, overdue: 2 })
};
