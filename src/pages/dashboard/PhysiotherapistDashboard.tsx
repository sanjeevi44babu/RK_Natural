import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, Bell, ChevronRight, CheckCircle, 
  Clock, Activity, Eye 
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PhysiotherapistDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, appointments, updateAppointment, addHealthRecord } = useData();

  // Get therapist's appointments
  const myAppointments = appointments.filter(a => a.physiotherapistId === user?.id);
  const todayStr = selectedDate.toISOString().split('T')[0];
  const todayAppointments = myAppointments.filter(a => a.date === todayStr);
  const upcomingAppointments = todayAppointments.filter(a => a.status === 'upcoming');
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;

  // Get all my patients
  const myPatients = patients.filter(p => p.assignedPhysiotherapistId === user?.id);

  const stats = {
    patients: myPatients.length,
    todayAppointments: todayAppointments.length,
    completed: completedToday,
    pending: upcomingAppointments.length,
  };

  // One-click complete treatment
  const handleCompleteTreatment = (appointmentId: string, patientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update appointment status to completed
    updateAppointment(appointmentId, { status: 'completed' });
    
    // Add health record
    addHealthRecord({
      id: `hr-${Date.now()}`,
      patientId,
      physiotherapistId: user?.id,
      physiotherapistName: user?.fullName,
      date: new Date().toISOString().split('T')[0],
      notes: 'Therapy session completed successfully',
      createdAt: new Date().toISOString(),
    });

    toast.success('Treatment completed! Health record added.');
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Physiotherapist</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Therapist'}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Activity size={16} />
                <span className="text-sm">{stats.pending} sessions pending today</span>
              </div>
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
            label="My Patients"
            variant="primary"
            onClick={() => navigate('/patients')}
          />
          <StatCard
            icon={Calendar}
            value={stats.todayAppointments}
            label="Today"
            variant="secondary"
          />
          <StatCard
            icon={CheckCircle}
            value={stats.completed}
            label="Completed"
          />
          <StatCard
            icon={Clock}
            value={stats.pending}
            label="Pending"
          />
        </div>

        {/* Quick Actions - View Only, No Create */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/patients')}
            className="role-card"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">View All Patients</p>
              <p className="text-sm text-muted-foreground">{stats.patients} assigned patients</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/appointments')}
            className="role-card"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Calendar size={20} className="text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">View Appointments</p>
              <p className="text-sm text-muted-foreground">Scheduled by supervisor</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Today's Sessions - One Click Complete */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Today's Sessions</h2>
              <p className="text-sm text-muted-foreground">Click "Complete" to finish treatment</p>
            </div>
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
                <Calendar size={40} className="mx-auto mb-2 opacity-50" />
                <p>No sessions scheduled for today</p>
              </div>
            ) : (
              todayAppointments.map((apt) => (
                <div 
                  key={apt.id}
                  className={`card-medical ${apt.status === 'completed' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      apt.status === 'completed' 
                        ? 'bg-success/10' 
                        : 'bg-secondary/10'
                    }`}>
                      {apt.status === 'completed' ? (
                        <CheckCircle size={20} className="text-success" />
                      ) : (
                        <Clock size={20} className="text-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{apt.patientName}</h3>
                        {apt.patientAge && (
                          <span className="text-xs text-muted-foreground">
                            {apt.patientAge} yrs, {apt.patientGender}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {apt.time} • {apt.duration} mins • {apt.type}
                      </p>
                      {apt.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {apt.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs text-center ${
                        apt.status === 'upcoming' ? 'bg-primary/10 text-primary' :
                        apt.status === 'completed' ? 'bg-success/10 text-success' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {apt.status}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/patients/${apt.patientId}`);
                          }}
                        >
                          <Eye size={14} />
                        </Button>
                        {apt.status === 'upcoming' && (
                          <Button
                            size="sm"
                            className="h-8 px-2 bg-success hover:bg-success/90"
                            onClick={(e) => handleCompleteTreatment(apt.id, apt.patientId, e)}
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All My Patients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">All My Patients</h2>
            <button 
              onClick={() => navigate('/patients')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {myPatients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users size={40} className="mx-auto mb-2 opacity-50" />
                <p>No patients assigned yet</p>
              </div>
            ) : (
              myPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="card-medical cursor-pointer"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="avatar-wrapper">
                      <span className="text-primary font-semibold text-sm">
                        {patient.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{patient.fullName}</h3>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          ID: {patient.id.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender} • {patient.diagnosis || 'Therapy'}
                      </p>
                      {patient.roomNumber && (
                        <p className="text-xs text-secondary">
                          Room {patient.roomNumber}, {patient.blockName}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        patient.status === 'admitted' ? 'bg-success/10 text-success' :
                        patient.status === 'discharged' ? 'bg-muted text-muted-foreground' :
                        'bg-secondary/10 text-secondary'
                      }`}>
                        {patient.status}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patients/${patient.id}/health-check`);
                        }}
                      >
                        Health Check
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
