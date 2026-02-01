import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCog, Activity, Calendar, TrendingUp, 
  Bell, Search, ChevronRight 
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { UserCard } from '@/components/common/UserCard';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const mockStats = {
  doctors: 25,
  patients: 150,
  appointments: 45,
  supervisors: 8,
  physiotherapists: 12,
};

const mockStaff = [
  { id: '1', name: 'Dr. Olivia Turner', role: 'Doctor', subtitle: 'Cardiologist', email: 'olivia@naturecure.com' },
  { id: '2', name: 'Michael Davidson', role: 'Physiotherapist', subtitle: 'Sports Therapy', email: 'michael@naturecure.com' },
  { id: '3', name: 'Sarah Mitchell', role: 'Supervisor', subtitle: 'Main Clinic', email: 'sarah@naturecure.com' },
];

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Admin'}</h1>
            </div>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Bell size={20} />
            </button>
          </div>
          
          {/* Calendar */}
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            icon={UserCog}
            value={mockStats.doctors}
            label="Doctors"
            variant="primary"
            onClick={() => navigate('/doctors')}
          />
          <StatCard
            icon={Users}
            value={mockStats.patients}
            label="Patients"
            onClick={() => navigate('/patients')}
          />
          <StatCard
            icon={Activity}
            value={mockStats.physiotherapists}
            label="Therapists"
            onClick={() => navigate('/physiotherapists')}
          />
          <StatCard
            icon={Users}
            value={mockStats.supervisors}
            label="Supervisors"
            onClick={() => navigate('/supervisors')}
          />
          <StatCard
            icon={Calendar}
            value={mockStats.appointments}
            label="Today"
            variant="secondary"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/doctors')}
            className="role-card"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserCog size={20} className="text-primary" />
            </div>
            <span className="flex-1 text-left font-medium">Doctors</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/supervisors')}
            className="role-card"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Users size={20} className="text-secondary" />
            </div>
            <span className="flex-1 text-left font-medium">Supervisor</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/physiotherapists')}
            className="role-card"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity size={20} className="text-primary" />
            </div>
            <span className="flex-1 text-left font-medium">Physiotherapist</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Recent Staff */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Staff</h2>
            <button 
              onClick={() => navigate('/users')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockStaff.map((staff) => (
              <UserCard
                key={staff.id}
                id={staff.id}
                name={staff.name}
                role={staff.role}
                subtitle={staff.subtitle}
                email={staff.email}
                showActions
                onClick={() => navigate(`/users/${staff.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
