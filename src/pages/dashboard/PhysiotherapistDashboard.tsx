import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, ChevronRight, CheckCircle,
  Clock, Activity, Eye, QrCode, Stethoscope, LogOut
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

export default function PhysiotherapistDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllPatients, setShowAllPatients] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, appointments, updateAppointment, addHealthRecord, dischargePatient } = useData();
  const { addNotification } = useNotifications();

  // Get filtered patients based on therapist's gender (Gender matching logic)
  const therapistGender = user?.gender?.toLowerCase();
  const allPatients = (patients || []).filter(p => {
    if (p.status === 'discharged') return false;
    if (!therapistGender || therapistGender === 'other') return true; // Show all if therapist gender not set
    return p.gender?.toLowerCase() === therapistGender;
  });
  const myPatients = allPatients.filter(p => p.assignedPhysiotherapistId === user?.id);

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

  // Start treatment
  const handleStartTreatment = (appointmentId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateAppointment(appointmentId, { status: 'in-progress', startTime: time });

    toast.success(`Treatment started at ${time}`);
  };

  // End treatment
  const handleEndTreatment = (appointmentId: string, patientId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateAppointment(appointmentId, { status: 'completed', endTime: time });

    addHealthRecord({
      id: `hr-${Date.now()}`,
      patientId,
      physiotherapistId: user?.id,
      physiotherapistName: user?.fullName,
      date: new Date().toISOString().split('T')[0],
      notes: `Therapy session completed successfully. Ended at ${time}`,
      createdAt: new Date().toISOString(),
    });

    const patientName = patients.find(p => p.id === patientId)?.fullName || 'Patient';
    addNotification({
      title: 'Treatment Completed',
      message: `${user?.fullName} completed therapy for ${patientName}.`,
      type: 'success',
      role: 'all',
    });

    toast.success(`Treatment completed at ${time}! Health record added.`);
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

  // Gender Categorization
  const femaleAppointments = todayAppointments.filter(a => a.patientGender?.toLowerCase() === 'female');
  const maleAppointments = todayAppointments.filter(a => a.patientGender?.toLowerCase() === 'male');
  const otherAppointments = todayAppointments.filter(a => !['male', 'female'].includes(a.patientGender?.toLowerCase() || ''));

  const femalePatients = displayPatients.filter(p => p.gender?.toLowerCase() === 'female');
  const malePatients = displayPatients.filter(p => p.gender?.toLowerCase() === 'male');
  const otherPatients = displayPatients.filter(p => !['male', 'female'].includes(p.gender?.toLowerCase() || ''));

  const PatientGroup = ({ title, appointments, type }: {
    title: string;
    appointments?: typeof todayAppointments;
    type: 'treatment' | 'therapy'
  }) => {
    if (type === 'treatment') {
      if (!appointments || appointments.length === 0) return null;
      return (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-6 rounded-full ${title.includes('Female') ? 'bg-pink-500' : 'bg-blue-500'}`} />
            <h3 className="text-lg font-bold">{title} ({appointments.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="card-medical p-3 md:p-4 cursor-pointer hover:border-primary/50 transition-colors relative group animate-fade-in"
                onClick={() => navigate(`/patients/${apt.patientId}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">{apt.patientName?.charAt(0) || 'P'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground line-clamp-1">{apt.patientName}</h4>
                      <p className="text-xs text-muted-foreground">{apt.patientAge || 'N/A'}Y • {apt.patientGender || 'Unspecified'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${apt.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                    {apt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-1">
                  {/* Left Column Info */}
                  <div className="space-y-2 bg-accent/30 rounded-xl p-3 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><Calendar size={12} /> Date</span>
                      <span className="font-semibold text-foreground text-right">{apt.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><Clock size={12} /> Time</span>
                      <span className="font-semibold text-foreground text-right">{apt.time} ({apt.duration}m)</span>
                    </div>

                    {/* Treatment Plan moved to Left Column */}
                    {(() => {
                      const patientObj = (patients || []).find(p => 
                        p.id === apt.patientId || 
                        (p as any)._id === apt.patientId ||
                        String((p as any)._id) === String(apt.patientId) ||
                        p.fullName === apt.patientName
                      );
                      const treatmentPlan = patientObj?.treatmentPlan;
                      
                      return (
                        <div className="mt-1 pt-2 border-t border-border/50">
                          <span className="text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 text-secondary">
                            <Activity size={10} /> Treatment Plan
                          </span>
                          <p className={`font-bold text-xs leading-normal line-clamp-2 overflow-hidden ${treatmentPlan ? 'text-foreground' : 'text-muted-foreground italic'}`} title={treatmentPlan || "No Treatment Plan assigned"}>
                            {treatmentPlan || "Not Assigned"}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Column: Start/End Times and Buttons */}
                  <div className="flex flex-col justify-between bg-accent/10 rounded-xl p-2 border border-border/30">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="flex flex-col items-center justify-center p-1.5 bg-background rounded-lg border border-border/50">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-1"><Clock size={9} /> Start</span>
                        <span className="font-bold text-xs text-primary mt-0.5">{apt.startTime || '--:--'}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 bg-background rounded-lg border border-border/50">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-1"><Clock size={9} /> End</span>
                        <span className="font-bold text-xs text-success mt-0.5">{apt.endTime || '--:--'}</span>
                      </div>
                    </div>
                    
                    {/* Split Buttons */}
                    {(apt.status === 'upcoming' || apt.status === 'in-progress') && (
                      <div className="flex gap-2 w-full mt-auto">
                        <Button
                          size="sm"
                          className={`flex-1 text-[10px] h-7 px-0 font-bold ${apt.status === 'upcoming' ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'}`}
                          disabled={apt.status !== 'upcoming'}
                          onClick={(e) => handleStartTreatment(apt.id, e)}
                        >
                          Start
                        </Button>
                        <Button
                          size="sm"
                          className={`flex-1 text-[10px] h-7 px-0 font-bold ${apt.status === 'in-progress' ? 'bg-success hover:bg-success/90 text-white' : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'}`}
                          disabled={apt.status !== 'in-progress'}
                          onClick={(e) => handleEndTreatment(apt.id, apt.patientId, e)}
                        >
                          End
                        </Button>
                      </div>
                    )}
                    {apt.status === 'completed' && (
                       <div className="mt-auto flex items-center justify-center gap-1 text-success text-[10px] font-bold bg-success/10 py-1 rounded-md">
                         <CheckCircle size={10} /> Completed
                       </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      if (!patients || patients.length === 0) return null;
      return (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-6 rounded-full ${title.includes('Female') ? 'bg-pink-500' : 'bg-blue-500'}`} />
            <h3 className="text-lg font-bold">{title} ({patients.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {patients.map((patient) => (
              <UserCard
                key={patient.id}
                id={patient.id}
                name={patient.fullName}
                subtitle={`${patient.age}y • ${patient.gender}`}
                variant="grid"
                onClick={() => navigate(`/patients/${patient.id}`)}
              />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="dashboard-header animate-fade-in">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div>
              <p className="text-primary-foreground/80 text-[10px] uppercase tracking-wider font-bold">Physiotherapist</p>
              <h1 className="text-xl font-bold">{user?.fullName || 'Therapist'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Activity size={14} />
                <span className="text-[10px]">{stats.pending} sessions pending today</span>
              </div>
            </div>
            <NotificationBell />
          </div>

          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard icon={Users} value={stats.allPatients} label="All Patients" variant="primary" onClick={() => setShowAllPatients(true)} />
          <StatCard icon={Users} value={stats.myPatients} label="My Patients" onClick={() => setShowAllPatients(false)} />
          <StatCard icon={Calendar} value={stats.todayAppointments} label="Today" variant="secondary" />
          <StatCard icon={CheckCircle} value={stats.completed} label="Completed" />
          <StatCard icon={Clock} value={stats.pending} label="Pending" />
        </div>

        {/* Main Workspace Toggle */}
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">Patient Management</h2>
              <p className="text-sm text-muted-foreground">Toggle between daily sessions and therapy tracking</p>
            </div>
            <div className="flex p-1 bg-accent rounded-xl w-fit">
              <button
                onClick={() => setViewMode('treatment')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'treatment' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  }`}
              >
                Treatments (Today)
              </button>
              <button
                onClick={() => setViewMode('therapy')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'therapy' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  }`}
              >
                Therapy List
              </button>
            </div>
          </div>

          {viewMode === 'treatment' ? (
            <div>
              {todayAppointments.length === 0 ? (
                <div className="text-center py-12 card-medical border-dashed">
                  <Calendar size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">No treatments scheduled for today</p>
                </div>
              ) : (
                <>
                  <PatientGroup title="Male Patients" appointments={maleAppointments} type="treatment" />
                  <PatientGroup title="Female Patients" appointments={femaleAppointments} type="treatment" />
                  <PatientGroup title="Other/Unspecified" appointments={otherAppointments} type="treatment" />
                </>
              )}
            </div>
          ) : (
            <div>
              {displayPatients.length === 0 ? (
                <div className="text-center py-12 card-medical border-dashed">
                  <Users size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">No patients assigned to therapies</p>
                </div>
              ) : (
                <>
                  <PatientGroup title="Male Patients" patients={malePatients} type="therapy" />
                  <PatientGroup title="Female Patients" patients={femalePatients} type="therapy" />
                  <PatientGroup title="Other/Unspecified" patients={otherPatients} type="therapy" />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
