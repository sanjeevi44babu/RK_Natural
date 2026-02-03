import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Activity, Calendar, Bell, ChevronRight, 
  Building, BedDouble, Plus, Clock, CheckCircle 
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { UserCard } from '@/components/common/UserCard';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function SupervisorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, patients, appointments, rooms, beds, getAvailableBeds } = useData();

  // Filter therapists only (no doctors for supervisor)
  const therapists = users.filter(u => u.role === 'physiotherapist' && u.isApproved);
  const admittedPatients = patients.filter(p => p.status === 'admitted');
  const availableBeds = getAvailableBeds();
  
  // Today's appointments
  const todayStr = selectedDate.toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);

  // Get therapist availability (therapists with fewer than 5 appointments today)
  const getTherapistAvailability = (therapistId: string) => {
    const therapistAppointments = todayAppointments.filter(a => a.physiotherapistId === therapistId);
    return {
      bookedSlots: therapistAppointments.length,
      isAvailable: therapistAppointments.length < 5,
      nextFreeSlot: therapistAppointments.length < 5 ? getNextFreeSlot(therapistAppointments) : null,
    };
  };

  const getNextFreeSlot = (bookedAppointments: typeof todayAppointments) => {
    const allSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    const bookedTimes = bookedAppointments.map(a => a.time);
    const freeSlot = allSlots.find(slot => !bookedTimes.includes(slot));
    return freeSlot || null;
  };

  const stats = {
    patients: admittedPatients.length,
    therapists: therapists.length,
    availableBeds: availableBeds.length,
    todayAppointments: todayAppointments.length,
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Supervisor</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Supervisor'}</h1>
            </div>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Bell size={20} />
            </button>
          </div>
          
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Users}
            value={stats.patients}
            label="Patients"
            variant="primary"
            onClick={() => navigate('/patients')}
          />
          <StatCard
            icon={Activity}
            value={stats.therapists}
            label="Therapists"
            onClick={() => navigate('/physiotherapists')}
          />
          <StatCard
            icon={BedDouble}
            value={stats.availableBeds}
            label="Free Beds"
            onClick={() => navigate('/rooms')}
          />
          <StatCard
            icon={Calendar}
            value={stats.todayAppointments}
            label="Today"
            variant="secondary"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/rooms')}
            className="role-card"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building size={20} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Room Management</p>
              <p className="text-sm text-muted-foreground">{stats.availableBeds} beds available</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/appointments/new')}
            className="role-card"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Plus size={20} className="text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Book Appointment</p>
              <p className="text-sm text-muted-foreground">Schedule therapy session</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Therapist Availability - MAIN FEATURE */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Therapist Availability</h2>
              <p className="text-sm text-muted-foreground">Book appointments with available therapists</p>
            </div>
            <button 
              onClick={() => navigate('/physiotherapists')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {therapists.map((therapist) => {
              const availability = getTherapistAvailability(therapist.id);
              
              return (
                <div 
                  key={therapist.id} 
                  className="card-medical"
                >
                  <div className="flex items-center gap-4">
                    <div className="avatar-wrapper">
                      <span className="text-primary font-semibold text-sm">
                        {therapist.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{therapist.fullName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {therapist.specialization || 'Physiotherapist'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {availability.bookedSlots}/5 slots booked
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        availability.isAvailable 
                          ? 'bg-success/10 text-success' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {availability.isAvailable ? 'Available' : 'Fully Booked'}
                      </span>
                      {availability.isAvailable && availability.nextFreeSlot && (
                        <span className="text-xs text-secondary">
                          Next: {availability.nextFreeSlot}
                        </span>
                      )}
                      {availability.isAvailable && (
                        <button
                          onClick={() => navigate(`/appointments/new?therapist=${therapist.id}`)}
                          className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Today's Appointments</h2>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No appointments scheduled for today</p>
              </div>
            ) : (
              todayAppointments.slice(0, 3).map((apt) => (
                <div 
                  key={apt.id}
                  className="card-medical cursor-pointer"
                  onClick={() => navigate(`/appointments/${apt.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Clock size={20} className="text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{apt.patientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {apt.time} • {apt.physiotherapistName || apt.doctorName}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      apt.status === 'upcoming' ? 'bg-primary/10 text-primary' :
                      apt.status === 'completed' ? 'bg-success/10 text-success' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Admitted Patients</h2>
            <button 
              onClick={() => navigate('/patients')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {admittedPatients.slice(0, 3).map((patient) => (
              <UserCard
                key={patient.id}
                id={patient.id}
                name={patient.fullName}
                subtitle={`${patient.age} Age, ${patient.gender} • Room ${patient.roomNumber || 'N/A'}`}
                phone={patient.phone}
                showActions
                onClick={() => navigate(`/patients/${patient.id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FAB for quick appointment booking */}
      <button 
        className="fab"
        onClick={() => navigate('/appointments/new')}
      >
        <Plus size={24} />
      </button>
    </DashboardLayout>
  );
}
