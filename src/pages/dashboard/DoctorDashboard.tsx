import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, UserPlus, Bell, ChevronRight, Plus, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { UserCard } from '@/components/common/UserCard';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { isSameDay } from 'date-fns';

export default function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, appointments } = useData();

  // Get doctor's patients and appointments
  const myPatients = patients.filter(p => p.assignedDoctorId === user?.id);
  const myAppointments = appointments.filter(a => a.doctorId === user?.id);
  const todayAppointments = myAppointments.filter(a => 
    isSameDay(new Date(a.date), selectedDate) && a.status !== 'cancelled'
  );
  const completedAppointments = myAppointments.filter(a => a.status === 'completed');
  const upcomingAppointments = myAppointments.filter(a => a.status === 'upcoming');

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Doctor</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Doctor'}</h1>
              {user?.specialization && (
                <p className="text-primary-foreground/80 text-sm">{user.specialization}</p>
              )}
            </div>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105">
              <Bell size={20} />
            </button>
          </div>
          
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatCard
              icon={Users}
              value={myPatients.length}
              label="Patients"
              variant="primary"
              onClick={() => navigate('/patients')}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <StatCard
              icon={Calendar}
              value={todayAppointments.length}
              label="Today"
              variant="secondary"
              onClick={() => navigate('/appointments')}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <StatCard
              icon={Clock}
              value={upcomingAppointments.length}
              label="Upcoming"
              onClick={() => navigate('/appointments')}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <StatCard
              icon={Calendar}
              value={completedAppointments.length}
              label="Completed"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/patients/new')}
            className="role-card w-full animate-fade-in hover:scale-[1.02] transition-transform duration-200"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus size={20} className="text-primary" />
            </div>
            <span className="flex-1 text-left font-medium">New Patient</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/my-schedule')}
            className="role-card w-full animate-fade-in hover:scale-[1.02] transition-transform duration-200"
            style={{ animationDelay: '0.35s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Clock size={20} className="text-secondary" />
            </div>
            <span className="flex-1 text-left font-medium">My Schedule</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/patients')}
            className="role-card w-full animate-fade-in hover:scale-[1.02] transition-transform duration-200"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Users size={20} className="text-accent-foreground" />
            </div>
            <span className="flex-1 text-left font-medium">All Patients</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Today's Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Today's Appointments ({todayAppointments.length})</h2>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="card-medical text-center py-8">
              <Calendar size={40} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No appointments for today</p>
              <button 
                onClick={() => navigate('/appointments/new')}
                className="mt-3 text-primary font-medium hover:underline"
              >
                Schedule an appointment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Patients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">My Patients ({myPatients.length})</h2>
            <button 
              onClick={() => navigate('/patients')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          {myPatients.length === 0 ? (
            <div className="card-medical text-center py-8">
              <Users size={40} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No patients assigned yet</p>
              <button 
                onClick={() => navigate('/patients/new')}
                className="mt-3 text-primary font-medium hover:underline"
              >
                Add a new patient
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myPatients.slice(0, 3).map((patient) => (
                <UserCard
                  key={patient.id}
                  id={patient.id}
                  name={patient.fullName}
                  subtitle={`${patient.age} years • ${patient.gender}`}
                  phone={patient.phone}
                  showActions
                  onClick={() => navigate(`/patients/${patient.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button 
        className="fab hover:scale-110 transition-transform duration-200 animate-scale-in"
        onClick={() => navigate('/patients/new')}
      >
        <Plus size={24} />
      </button>
    </DashboardLayout>
  );
}
