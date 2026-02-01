import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Bell, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { UserCard } from '@/components/common/UserCard';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';

const mockStats = {
  patients: 18,
  todayAppointments: 6,
  completed: 42,
};

const mockPatients = [
  { id: '1', name: 'Alexander Bennett', subtitle: '45 Age, Male • Knee Therapy', phone: '+1234567890' },
  { id: '2', name: 'Michael Davidson', subtitle: '32 Age, Male • Back Pain', phone: '+1234567891' },
  { id: '3', name: 'Olivia Turner', subtitle: '28 Age, Female • Sports Injury', phone: '+1234567892' },
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Alexander Bennett',
    physiotherapistId: '1',
    date: new Date().toISOString(),
    time: '09:00 AM',
    duration: 45,
    status: 'upcoming',
    type: 'therapy',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Michael Davidson',
    physiotherapistId: '1',
    date: new Date().toISOString(),
    time: '11:00 AM',
    duration: 60,
    status: 'upcoming',
    type: 'therapy',
    createdAt: new Date().toISOString(),
  },
];

export default function PhysiotherapistDashboard() {
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
              <p className="text-primary-foreground/80 text-sm">Physiotherapist</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Physiotherapist'}</h1>
            </div>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Bell size={20} />
            </button>
          </div>
          
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Users}
            value={mockStats.patients}
            label="Patients"
            variant="primary"
            onClick={() => navigate('/patients')}
          />
          <StatCard
            icon={Calendar}
            value={mockStats.todayAppointments}
            label="Today"
            variant="secondary"
            onClick={() => navigate('/appointments')}
          />
          <StatCard
            icon={Calendar}
            value={mockStats.completed}
            label="Sessions"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/patients')}
            className="role-card w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <span className="flex-1 text-left font-medium">Patients</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/appointments')}
            className="role-card w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Calendar size={20} className="text-secondary" />
            </div>
            <span className="flex-1 text-left font-medium">Appointments</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Today's Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Today's Sessions</h2>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onClick={() => navigate(`/appointments/${appointment.id}`)}
              />
            ))}
          </div>
        </div>

        {/* My Patients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">My Patients</h2>
            <button 
              onClick={() => navigate('/patients')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockPatients.map((patient) => (
              <UserCard
                key={patient.id}
                id={patient.id}
                name={patient.name}
                subtitle={patient.subtitle}
                phone={patient.phone}
                showActions
                onClick={() => navigate(`/patients/${patient.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
