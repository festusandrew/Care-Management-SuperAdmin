import Dashboard from './pages/Dashboard';
import ServiceUsers from './pages/ServiceUsers';
import DailyLogs from './pages/DailyLogs';
import { CarePlans } from './pages/CarePlans';
import Medications from './pages/Medications';
import Scheduling from './pages/Scheduling';
import Activities from './pages/Activities';
import Incidents from './pages/Incidents';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';
import Staff from './pages/Staff';
import StaffProfile from './pages/StaffProfile';
import Recruitment from './pages/Recruitment';
import CommunicationHub from './pages/CommunicationHub';
import Financial from './pages/Financial';
import Analytics from './pages/Analytics';
import LeaveRequests from './pages/LeaveRequests';
import OrgOverview from './pages/superadmin/OrgOverview';
import Locations from './pages/superadmin/Locations';
import LocationDetail from './pages/superadmin/LocationDetail';
import UsersRoles from './pages/superadmin/UsersRoles';
import CrossSiteCompliance from './pages/superadmin/CrossSiteCompliance';
import ConsolidatedFinancials from './pages/superadmin/ConsolidatedFinancials';
import OrgAnalytics from './pages/superadmin/OrgAnalytics';
import AuditLog from './pages/superadmin/AuditLog';
import OrgSettings from './pages/superadmin/OrgSettings';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { TenantProvider } from './context/TenantContext';

function AppContent() {
  const { currentPage, pageParams } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':      return <Dashboard />;
      case 'service-users':  return <ServiceUsers />;
      case 'staff':          return <Staff />;
      case 'leave-requests': return <LeaveRequests />;
      case 'staff-profile':  return <StaffProfile id={pageParams?.id} showTimesheet={pageParams?.showTimesheet} />;
      case 'daily-logs':     return <DailyLogs />;
      case 'care-plans':     return <CarePlans />;
      case 'medications':    return <Medications />;
      case 'scheduling':     return <Scheduling />;
      case 'activities':     return <Activities />;
      case 'incidents':      return <Incidents />;
      case 'compliance':     return <Compliance />;
      case 'recruitment':    return <Recruitment />;
      case 'communication':  return <CommunicationHub />;
      case 'financial':      return <Financial />;
      case 'analytics':      return <Analytics />;
      case 'settings':       return <Settings />;
      // Super Admin
      case 'org-overview':         return <OrgOverview />;
      case 'org-locations':        return <Locations />;
      case 'org-location-detail':  return <LocationDetail id={pageParams?.id} />;
      case 'org-users':            return <UsersRoles />;
      case 'org-compliance':       return <CrossSiteCompliance />;
      case 'org-financial':        return <ConsolidatedFinancials />;
      case 'org-analytics':        return <OrgAnalytics />;
      case 'org-audit':            return <AuditLog />;
      case 'org-settings':         return <OrgSettings />;
      default:                     return <Dashboard />;
    }
  };

  return renderPage();
}

export default function App() {
  return (
    <TenantProvider>
      <NavigationProvider>
        {/* MARKER-MAKE-KIT-INVOKED */}
        <AppContent />
      </NavigationProvider>
    </TenantProvider>
  );
}
