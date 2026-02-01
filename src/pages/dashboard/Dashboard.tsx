import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import SupervisorDashboard from './SupervisorDashboard';
import DoctorDashboard from './DoctorDashboard';
import PhysiotherapistDashboard from './PhysiotherapistDashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'supervisor':
      return <SupervisorDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'physiotherapist':
      return <PhysiotherapistDashboard />;
    default:
      return <AdminDashboard />;
  }
}
