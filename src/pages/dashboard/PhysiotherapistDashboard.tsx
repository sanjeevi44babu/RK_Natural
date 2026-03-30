import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, ChevronRight, CheckCircle, 
  Clock, Activity, Eye, QrCode, Stethoscope, LogOut
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { StatCard } from '@/components/common/StatCard';
import { NotificationBell } from '@/components/common/NotificationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PhysiotherapistDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllPatients, setShowAllPatients] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, appointments, updateAppointment, addHealthRecord, dischargePatient } = useData();
  const { addNotification } = useNotifications();

  // Get ALL patients (not just assigned)
  const allPatients = (patients || []).filter(p => p.status !== 'discharged');
  const myPatients = (patients || []).filter(p => p.assignedPhysiotherapistId === user?.id);

  // Get therapist's appointments
  const myAppointments = appointments.filter(a => a.physiotherapistId === user?.id);
  const todayStr = selectedDate.toISOString().split('T')[0];
  const todayAppointments = myAppointments.filter(a => a.date === todayStr);
  const upcomingAppointments = todayAppointments.filter(a => a.status === 'upcoming');
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;

  const stats = {
    allPatients: allPatients.length,
    myPatients: myPatients.length,
    todayAppointments: todayAppointments.length,
    completed: completedToday,
    pending: upcomingAppointments.length,
  };

  // One-click complete treatment
  const handleCompleteTreatment = (appointmentId: string, patientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    updateAppointment(appointmentId, { status: 'completed' });
    
    addHealthRecord({
      id: `hr-${Date.now()}`,
      patientId,
      physiotherapistId: user?.id,
      physiotherapistName: user?.fullName,
      date: new Date().toISOString().split('T')[0],
      notes: 'Therapy session completed successfully',
      createdAt: new Date().toISOString(),
    });

    const patientName = patients.find(p => p.id === patientId)?.fullName || 'Patient';
    addNotification({
      title: 'Treatment Completed',
      message: `${user?.fullName} completed therapy for ${patientName}.`,
      type: 'success',
      role: 'all',
    });

    toast.success('Treatment completed! Health record added.');
  };

  // Discharge patient
  const handleDischarge = (patientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const patientName = patients.find(p => p.id === patientId)?.fullName || 'Patient';
    dischargePatient(patientId);
    addNotification({
      title: 'Patient Discharged',
      message: `${patientName} has been discharged by ${user?.fullName}.`,
      type: 'info',
      role: 'all',
    });
    toast.success(`${patientName} discharged successfully!`);
  };

  const [viewMode, setViewMode] = useState<'therapy' | 'treatment'>('treatment');
  const displayPatients = showAllPatients ? allPatients : myPatients;

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        {/* Welcome Header */}
        <div className="dashboard-header animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Physiotherapist</p>
              <h1 className="text-2xl font-bold">{user?.fullName || 'Therapist'}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Activity size={16} />
                <span className="text-sm">{stats.pending} sessions pending today</span>
              </div>
            </div>
            <NotificationBell />
          </div>
          
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatCard icon={Users} value={stats.allPatients} label="All Patients" variant="primary" onClick={() => { setShowAllPatients(true); }} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <StatCard icon={Users} value={stats.myPatients} label="My Patients" onClick={() => { setShowAllPatients(false); }} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <StatCard icon={Calendar} value={stats.todayAppointments} label="Today" variant="secondary" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <StatCard icon={CheckCircle} value={stats.completed} label="Completed" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <StatCard icon={Clock} value={stats.pending} label="Pending" />
          </div>
        </div>

        {/* Quick Actions - View Only, No Create */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/scan-patient')}
            className="role-card animate-fade-in hover:scale-[1.02] transition-transform"
            style={{ animationDelay: '0.35s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <QrCode size={20} className="text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Scan Patient</p>
              <p className="text-sm text-muted-foreground">Scan QR or enter ID</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/patients')}
            className="role-card animate-fade-in hover:scale-[1.02] transition-transform"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">View All Patients</p>
              <p className="text-sm text-muted-foreground">{stats.allPatients} active patients</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/scan-patient')}
            className="role-card animate-fade-in hover:scale-[1.02] transition-transform"
            style={{ animationDelay: '0.35s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <QrCode size={20} className="text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Scan Patient</p>
              <p className="text-sm text-muted-foreground">Quick access via QR</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/patients')}
            className="role-card animate-fade-in hover:scale-[1.02] transition-transform"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Patient Directory</p>
              <p className="text-sm text-muted-foreground">{stats.allPatients} active records</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Main Workspace Toggle */}
        <div className="animate-fade-in" style={{ animationDelay: '0.45s' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">Patient Management</h2>
              <p className="text-sm text-muted-foreground">Toggle between daily sessions and therapy tracking</p>
            </div>
            <div className="flex p-1 bg-accent rounded-xl w-fit">
              <button
                onClick={() => setViewMode('treatment')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === 'treatment' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Treatments (Today)
              </button>
              <button
                onClick={() => setViewMode('therapy')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === 'therapy' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Therapy List
              </button>
            </div>
          </div>

          {viewMode === 'treatment' ? (
            <div className="space-y-4">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-12 card-medical border-dashed">
                  <Calendar size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">No treatments scheduled for today</p>
                  <Button variant="link" onClick={() => navigate('/appointments')}>View schedule</Button>
                </div>
              ) : (
                todayAppointments.map((apt, index) => (
                  <div 
                    key={apt.id}
                    className={`card-medical hover:border-primary/30 transition-colors ${apt.status === 'completed' ? 'opacity-60' : ''} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        apt.status === 'completed' ? 'bg-success/20' : 'bg-primary/10'
                      }`}>
                        {apt.status === 'completed' ? (
                          <CheckCircle size={24} className="text-success" />
                        ) : (
                          <Clock size={24} className="text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{apt.patientName}</h3>
                          <span className="px-2 py-0.5 bg-accent rounded text-[10px] font-mono">
                            {apt.patientAge}Y • {apt.patientGender}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-secondary flex items-center gap-1.5">
                          <Stethoscope size={14} />
                          {apt.type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {apt.time} • {apt.duration} mins session
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg h-9"
                            onClick={() => navigate(`/patients/${apt.patientId}`)}
                          >
                            Details
                          </Button>
                          {apt.status === 'upcoming' && (
                            <Button 
                              size="sm" 
                              className="bg-success hover:bg-success/90 rounded-lg h-9"
                              onClick={(e) => handleCompleteTreatment(apt.id, apt.patientId, e)}
                            >
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayPatients.length === 0 ? (
                <div className="col-span-full text-center py-12 card-medical border-dashed">
                  <Users size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">No patients assigned to therapies</p>
                </div>
              ) : (
                displayPatients.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="card-medical group cursor-pointer animate-fade-in hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary"
                    style={{ animationDelay: `${index * 0.03}s` }}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">
                          {patient.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold group-hover:text-primary transition-colors">
                          {patient.fullName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            patient.status === 'admitted' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'
                          }`}>
                            {patient.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-accent rounded-full text-muted-foreground">
                            ID: {patient.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Therapy Assignment Details */}
                        <div className="mt-3 p-2 bg-accent/50 rounded-lg border border-accent">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Assigned Therapy</p>
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {patient.assignedPhysiotherapistName || 'None Assigned'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground mt-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
