import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, ChevronRight, 
  Building, BedDouble, Plus, QrCode
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { UserCard } from '@/components/common/UserCard';
import { NotificationBell } from '@/components/common/NotificationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SupervisorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, patients, appointments, getAvailableBeds, addAppointment, updateAppointment } = useData();
  const { addNotification } = useNotifications();

  const therapists = users.filter(u => u.role === 'physiotherapist' && u.isApproved);
  const activePatients = patients.filter(p => p.status === 'admitted' || p.status === 'outpatient');
  const admittedPatients = patients.filter(p => p.status === 'admitted');
  const availableBeds = getAvailableBeds();
  const unassignedPatients = admittedPatients.filter(p => !p.assignedPhysiotherapistId);
  
  const todayStr = selectedDate.toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const therapyAppointments = todayAppointments.filter(a => a.physiotherapistId);

  const getTherapistAvailability = (therapistId: string) => {
    const therapistAppointments = todayAppointments.filter(a => a.physiotherapistId === therapistId);
    return {
      bookedSlots: therapistAppointments.length,
      isAvailable: therapistAppointments.length < 5,
      nextFreeSlot: therapistAppointments.length < 5 ? getNextFreeSlot(therapistAppointments) : null,
      appointments: therapistAppointments,
    };
  };

  const getNextFreeSlot = (bookedAppointments: typeof todayAppointments) => {
    const allSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    const bookedTimes = bookedAppointments.map(a => a.time);
    return allSlots.find(slot => !bookedTimes.includes(slot)) || null;
  };

  const handleQuickAssign = (therapistId: string, therapistName: string, patientId: string, patientName: string) => {
    const availability = getTherapistAvailability(therapistId);
    if (!availability.nextFreeSlot) {
      toast.error('No available slots for this therapist');
      return;
    }
    
    const newAppointment = {
      id: `apt-${Date.now()}`,
      patientId,
      patientName,
      physiotherapistId: therapistId,
      physiotherapistName: therapistName,
      date: todayStr,
      time: availability.nextFreeSlot,
      duration: 45,
      status: 'upcoming' as const,
      type: 'therapy' as const,
      notes: `Assigned by Supervisor ${user?.fullName}`,
      createdAt: new Date().toISOString(),
    };

    addAppointment(newAppointment);
    addNotification({
      title: 'Therapy Session Scheduled',
      message: `${patientName} assigned to ${therapistName} at ${availability.nextFreeSlot}`,
      type: 'success',
      role: 'all',
    });
    toast.success(`Assigned ${patientName} to ${therapistName} at ${availability.nextFreeSlot}`);
  };

  const handleCancelAppointment = (aptId: string, patientName: string) => {
    updateAppointment(aptId, { status: 'cancelled' });
    addNotification({
      title: 'Appointment Cancelled',
      message: `Supervisor ${user?.fullName} cancelled appointment for ${patientName}`,
      type: 'warning',
      role: 'all',
    });
    toast.success('Appointment cancelled');
  };

  const stats = {
    patients: activePatients.length,
    therapists: therapists.length,
    availableBeds: availableBeds.length,
    todayAppointments: todayAppointments.length,
  };

  // State for quick assign modal
  const [assigningTherapist, setAssigningTherapist] = useState<{ id: string; name: string } | null>(null);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="dashboard-header animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Supervisor</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Supervisor'}</h1>
            </div>
            <NotificationBell />
          </div>
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard icon={Users} value={stats.patients} label="Patients" variant="primary" onClick={() => navigate('/patients')} />
          <StatCard icon={BedDouble} value={stats.availableBeds} label="Free Beds" onClick={() => navigate('/rooms')} />
          <StatCard icon={Calendar} value={stats.todayAppointments} label="Today" variant="secondary" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button onClick={() => navigate('/rooms')} className="role-card">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Building size={20} className="text-primary" /></div>
            <div className="flex-1 text-left">
              <p className="font-medium">Room Management</p>
              <p className="text-sm text-muted-foreground">{stats.availableBeds} beds available</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate('/scan-patient')} className="role-card">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><QrCode size={20} className="text-success" /></div>
            <div className="flex-1 text-left">
              <p className="font-medium">Scan Patient</p>
              <p className="text-sm text-muted-foreground">Scan QR or enter ID</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Active Patients (Admitted & Outpatient) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Active Patients ({activePatients.length})</h2>
            <button onClick={() => navigate('/patients')} className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {activePatients.slice(0, 5).map((patient) => (
              <UserCard key={patient.id || (patient as any)._id} id={patient.id || (patient as any)._id} name={patient.fullName} subtitle={`${patient.age} Age, ${patient.gender} • ${patient.status === 'admitted' ? `Room ${patient.roomNumber || 'N/A'}` : 'Outpatient'}`} phone={patient.phone} showActions onClick={() => navigate(`/patients/${patient.id || (patient as any)._id}`)} />
            ))}
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}
