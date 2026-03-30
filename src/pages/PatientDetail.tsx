import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Edit, Heart, Stethoscope, LogOut, Plus, QrCode, Copy, Check, Printer, Droplets, Thermometer, Weight, Ruler, Activity, XCircle, FileText, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'sonner';
import treatmentsData from '@/data/treatments.json';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, healthRecords, appointments, updateAppointment } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const patient = (patients || []).find(p => p.id === id || (p as any)._id === id);
  const patientRecords = healthRecords.filter(r => r.patientId === id);
  const patientAppointments = appointments.filter(a => a.patientId === id);

  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'appointments'>('profile');
  const [copied, setCopied] = useState(false);
  const [isEditingTherapy, setIsEditingTherapy] = useState(false);
  const [tempTherapy, setTempTherapy] = useState(patient?.assignedPhysiotherapistName || '');
  const [therapyType, setTherapyType] = useState<'Therapy' | 'Treatment'>('Therapy');
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<{ id: string, name: string } | null>(null);
  const { updatePatient: updatePatientData, users, addAppointment } = useData();

  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleTherapistId, setScheduleTherapistId] = useState('');

  // Sync tempTherapy when patient loads
  useEffect(() => {
    if (patient?.assignedPhysiotherapistName) {
      setTempTherapy(patient.assignedPhysiotherapistName);
    }
  }, [patient]);

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Patient not found</div>
      </DashboardLayout>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const isSupervisor = user?.role === 'supervisor';
  const isTherapist = user?.role === 'physiotherapist';

  const canEdit = isDoctor; // Supervisor no longer gets the direct Edit button here
  const canHealthCheck = isDoctor || isTherapist;
  const canDischarge = isDoctor || isSupervisor;
  const therapists = (users || []).filter(u => u.role === 'physiotherapist' && u.isApproved);
  const canSchedule = isSupervisor;

  const copyPatientId = () => {
    const pId = patient.id || (patient as any)._id || 'N/A';
    navigator.clipboard.writeText(pId.toUpperCase());
    setCopied(true);
    toast.success('Patient ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const qrData = JSON.stringify({
    patientId: patient.id,
    name: patient.fullName,
    age: patient.age,
    gender: patient.gender,
    bloodType: patient.bloodType,
    phone: patient.phone,
  });

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Patient ID Card with QR */}
        <div className="card-medical bg-primary/5 border-primary/20 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <QRCodeSVG value={qrData} size={64} level="M" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Patient ID</p>
              <p className="text-xl font-bold font-mono text-primary">{(patient.id || (patient as any)._id || 'N/A').toUpperCase()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyPatientId}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate(`/patients/${id}/qr-tag`)}>
                <Printer size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Patient Header */}
        <div className="card-medical mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar name={patient.fullName} size="xl" />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{patient.fullName}</h1>
              <p className="text-muted-foreground">{patient.age} years • {patient.gender}</p>
              {patient.diagnosis && (
                <span className="badge-primary inline-block mt-2">{patient.diagnosis}</span>
              )}
              {patient.roomNumber && (
                <p className="text-sm text-secondary mt-1">
                  Room {patient.roomNumber}, {patient.blockName} - Bed {patient.bedNumber}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${patient.status === 'admitted' ? 'bg-success/10 text-success border border-success/20' :
              patient.status === 'discharged' ? 'bg-muted text-muted-foreground' :
                'b  g-secondary/10 text-secondary border border-secondary/20'
              }`}>
              {(patient.status || 'outpatient').charAt(0).toUpperCase() + (patient.status || 'outpatient').slice(1)}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        {!isAdmin && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {canEdit && (
              <button className="role-card flex-col items-center justify-center p-4 border-primary/20 hover:border-primary hover:bg-primary/5" onClick={() => navigate(`/patients/${id}/edit`)}>
                <Edit size={24} className="mb-2 text-primary" />
                <span className="text-sm font-medium">Edit Patient</span>
              </button>
            )}
            {canSchedule && (
              <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
                <DialogTrigger asChild>
                  <button className="role-card flex-col items-center justify-center p-4 border-secondary/20 hover:border-secondary hover:bg-secondary/5">
                    <Calendar size={24} className="mb-2 text-secondary" />
                    <span className="text-sm font-medium text-secondary">Schedule</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Appointment</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold">Patient Details</Label>
                      <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/20">
                        <p className="font-bold">{patient.fullName}</p>
                        <p className="text-sm text-muted-foreground">ID: {patient.id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Current Therapist:</span> {patient.assignedPhysiotherapistName || 'None'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Therapist</Label>
                      <div className="border rounded-md max-h-[150px] overflow-y-auto">
                        {therapists.length > 0 ? (
                          therapists.map(t => (
                            <div 
                              key={t.id || (t as any)._id}
                              className={`p-2 px-3 text-sm cursor-pointer flex items-center justify-between hover:bg-accent hover:text-accent-foreground ${scheduleTherapistId === (t.id || (t as any)._id) ? 'bg-primary/10 text-primary font-medium' : ''}`}
                              onClick={() => setScheduleTherapistId(t.id || (t as any)._id)}
                            >
                              <span>{t.fullName}</span>
                              {scheduleTherapistId === (t.id || (t as any)._id) && <Check size={16} />}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-muted-foreground text-center">No therapists found.</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t gap-2">
                    <Button variant="outline" onClick={() => setIsScheduling(false)}>Cancel</Button>
                    <Button 
                      disabled={!scheduleTherapistId || !scheduleDate || !scheduleTime}
                      onClick={() => {
                        const selectedT = therapists.find(t => (t.id || (t as any)._id) === scheduleTherapistId);
                        if (!selectedT) return;
                        
                        const tId = selectedT.id || (selectedT as any)._id;
                        const tName = selectedT.fullName;
                        
                        // Parse time for AM/PM format
                        const [hours, minutes] = scheduleTime.split(':');
                        const h = parseInt(hours);
                        const ampm = h >= 12 ? 'PM' : 'AM';
                        const formattedTime = `${h % 12 || 12}:${minutes} ${ampm}`;

                        const newAppointment = {
                          id: `apt-${Date.now()}`,
                          patientId: id!,
                          patientName: patient.fullName,
                          physiotherapistId: tId,
                          physiotherapistName: tName,
                          date: scheduleDate,
                          time: formattedTime,
                          duration: 45,
                          status: 'upcoming' as const,
                          type: 'therapy' as const,
                          notes: `Scheduled by Supervisor ${user?.fullName}`,
                          createdAt: new Date().toISOString(),
                        };
                        
                        addAppointment(newAppointment);
                        
                        if (!patient.assignedPhysiotherapistId) {
                          updatePatientData(id!, {
                            assignedPhysiotherapistId: tId,
                            assignedPhysiotherapistName: tName,
                          });
                        }
                        
                        toast.success(`Scheduled ${patient.fullName} with ${tName} on ${scheduleDate}`);
                        setIsScheduling(false);
                      }}
                    >
                      Confirm Schedule
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <button className="role-card flex-col items-center justify-center p-4 border-secondary/20 hover:border-secondary hover:bg-secondary/5" onClick={() => navigate(`/patients/${id}/qr-tag`)}>
              <QrCode size={24} className="mb-2 text-secondary" />
              <span className="text-sm font-medium text-secondary">QR Tag</span>
            </button>
            {canDischarge && patient.status === 'admitted' && (
              <button className="role-card flex-col items-center justify-center p-4 border-destructive/20 hover:border-destructive hover:bg-destructive/5 text-destructive" onClick={() => navigate(`/patients/${id}/discharge`)}>
                <LogOut size={24} className="mb-2" />
                <span className="text-sm font-medium">Discharge</span>
              </button>
            )}
          </div>
        )}

        {isAdmin && (
          <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              👁️ Admin View Only - You can view patient details but cannot modify them
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {(['profile', 'history', 'appointments'] as const)
            .filter(tab => !(isTherapist && tab === 'appointments'))
            .map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-fade-in">
            {/* Vitals */}
            <div className="card-medical">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart size={18} className="text-destructive" />
                Current Vitals & Measurements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Droplets size={20} className="mx-auto mb-1 text-destructive" />
                  <p className="text-lg font-bold text-primary">{patient.bloodPressure || '—'}</p>
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Thermometer size={20} className="mx-auto mb-1 text-warning" />
                  <p className="text-lg font-bold text-warning">{patient.temperature ? `${patient.temperature}°F` : '—'}</p>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Weight size={20} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold text-secondary">{patient.weight ? `${patient.weight} kg` : '—'}</p>
                  <p className="text-xs text-muted-foreground">Weight</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Ruler size={20} className="mx-auto mb-1 text-foreground" />
                  <p className="text-lg font-bold text-foreground">{patient.height ? `${patient.height} cm` : '—'}</p>
                  <p className="text-xs text-muted-foreground">Height</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-xl">
                  <Activity size={20} className="mx-auto mb-1 text-success" />
                  <p className="text-lg font-bold text-success">{patient.weight && patient.height ? (patient.weight / ((patient.height / 100) ** 2)).toFixed(1) : '—'}</p>
                  <p className="text-xs text-muted-foreground">BMI</p>
                </div>
                <div className="text-center p-3 bg-destructive/5 rounded-xl border border-destructive/20">
                  <Droplets size={20} className="mx-auto mb-1 text-destructive" />
                  <p className="text-lg font-bold text-destructive">{patient.bloodType || '—'}</p>
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="card-medical">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                </div>
                {patient.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{patient.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Info */}
            <div className="card-medical">
              <h3 className="font-semibold mb-4 text-primary">Medical Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Blood Group</p>
                  <p className="font-medium text-lg text-destructive">{patient.bloodType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Admission Date</p>
                  <p className="font-medium">{patient.admissionDate || 'N/A'}</p>
                </div>
                <div className="col-span-2 p-3 bg-secondary/5 rounded-xl border border-secondary/20 relative group">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold uppercase text-secondary">
                      Assigned {therapyType}
                    </p>
                    {isTherapist && !isEditingTherapy && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 transition-opacity"
                        onClick={() => {
                          setTempTherapy(patient.assignedPhysiotherapistName || '');
                          setIsEditingTherapy(true);
                        }}
                      >
                        <Edit size={14} className="text-secondary" />
                      </Button>
                    )}
                  </div>
                  
                  {isEditingTherapy ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3 py-1">
                        <Label htmlFor="therapy-type-toggle" className="text-[10px] font-bold uppercase text-muted-foreground">Treatment</Label>
                        <Switch 
                          id="therapy-type-toggle"
                          checked={therapyType === 'Therapy'}
                          onCheckedChange={(checked) => setTherapyType(checked ? 'Therapy' : 'Treatment')}
                        />
                        <Label htmlFor="therapy-type-toggle" className="text-[10px] font-bold uppercase text-secondary">Therapy</Label>
                      </div>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between bg-white border-secondary/20 text-foreground"
                          >
                            <span className="truncate">
                              {tempTherapy || "Select " + therapyType + "..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[calc(100vw-3rem)] sm:w-80 p-0 border-secondary/20" align="start">
                          <Command>
                            <CommandInput placeholder={"Search " + therapyType + "..."} className="border-none focus:ring-0" />
                            <CommandEmpty className="py-6 text-center text-sm">No {therapyType.toLowerCase()} found.</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-auto">
                              {treatmentsData.map((item) => (
                                <CommandItem
                                  key={item}
                                  value={item}
                                  onSelect={(currentValue) => {
                                    setTempTherapy(currentValue);
                                  }}
                                  className="cursor-pointer hover:bg-secondary/5"
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 text-secondary ${
                                      tempTherapy === item ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  {item}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-bold h-9"
                          disabled={isSaving}
                          onClick={async () => {
                            setIsSaving(true);
                            try {
                              await updatePatientData(id!, {
                                assignedPhysiotherapistName: tempTherapy,
                                assignedPhysiotherapistId: tempTherapy,
                              });
                              setIsEditingTherapy(false);
                              toast.success(`${therapyType} updated successfully`);
                            } catch (error) {
                              toast.error('Failed to update therapy');
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-9 px-3 text-muted-foreground hover:bg-accent rounded-xl"
                          disabled={isSaving}
                          onClick={() => setIsEditingTherapy(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="font-bold text-lg">{patient.assignedPhysiotherapistName || 'Not Assigned'}</p>
                  )}
                </div>
                {patient.dischargeDate && (
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Discharge Date</p>
                    <p className="font-medium">{patient.dischargeDate}</p>
                  </div>
                )}
              </div>
              {patient.diagnosis && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Primary Diagnosis</p>
                  <p className="font-bold text-primary">{patient.diagnosis}</p>
                </div>
              )}
              {patient.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Observation Notes</p>
                  <p className="text-sm italic text-muted-foreground">{patient.notes}</p>
                </div>
              )}
              {patient.prescription && (
                <div className="mt-4 pt-4 border-t border-border bg-primary/5 -mx-4 px-4 py-4 mb-2">
                  <p className="text-xs font-bold uppercase text-primary mb-1">Prescription</p>
                  <p className="font-medium text-sm text-primary">{patient.prescription}</p>
                </div>
              )}
              {patient.treatmentPlan && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Treatment Plan</p>
                  <p className="text-sm">{patient.treatmentPlan}</p>
                </div>
              )}
              {patient.followUpDate && (
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Next Follow-up</p>
                  <span className="badge-primary px-3 py-1">{patient.followUpDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 animate-fade-in">
            {patientRecords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><p>No health records found</p></div>
            ) : (
              patientRecords.map((record) => (
                <div key={record.id} className="card-medical">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="badge-secondary">{record.date}</span>
                      <p className="text-sm text-muted-foreground mt-1">{record.doctorName || record.physiotherapistName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {record.bloodPressure && (<div className="text-center p-2 bg-accent rounded-lg"><p className="text-sm font-medium">{record.bloodPressure}</p><p className="text-xs text-muted-foreground">BP</p></div>)}
                    {record.temperature && (<div className="text-center p-2 bg-accent rounded-lg"><p className="text-sm font-medium">{record.temperature}°F</p><p className="text-xs text-muted-foreground">Temp</p></div>)}
                    {record.heartRate && (<div className="text-center p-2 bg-accent rounded-lg"><p className="text-sm font-medium">{record.heartRate}</p><p className="text-xs text-muted-foreground">Heart Rate</p></div>)}
                    {record.weight && (<div className="text-center p-2 bg-accent rounded-lg"><p className="text-sm font-medium">{record.weight} kg</p><p className="text-xs text-muted-foreground">Weight</p></div>)}
                  </div>
                  {record.notes && <p className="text-sm text-muted-foreground">{record.notes}</p>}
                  {record.prescription && (
                    <div className="mt-2 p-2 bg-primary/5 rounded-lg">
                      <p className="text-xs text-primary font-medium">Prescription: {record.prescription}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-3 animate-fade-in">
            {patientAppointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><p>No appointments found</p></div>
            ) : (
              patientAppointments.map((apt) => (
                <div key={apt.id} className="card-medical">
                  <div className="flex items-center justify-between">
                    <div className="cursor-pointer flex-1" onClick={() => navigate(`/appointments/${apt.id}`)}>
                      <p className="font-medium">{apt.date} at {apt.time}</p>
                      <p className="text-sm text-muted-foreground capitalize">{apt.type}</p>
                      {apt.doctorName && <p className="text-xs text-primary">Doctor: {apt.doctorName}</p>}
                      {apt.physiotherapistName && <p className="text-xs text-secondary">Therapist: {apt.physiotherapistName}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${apt.status === 'upcoming' ? 'bg-primary/10 text-primary' :
                        apt.status === 'completed' ? 'bg-success/10 text-success' :
                          'b  g-destructive/10 text-destructive'
                        }`}>{apt.status}</span>
                      {apt.status === 'upcoming' && (isDoctor || isSupervisor) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            updateAppointment(apt.id, { status: 'cancelled' });
                            addNotification({
                              title: 'Appointment Cancelled',
                              message: `Appointment for ${patient.fullName} on ${apt.date} at ${apt.time} was cancelled`,
                              type: 'warning',
                              role: 'all',
                            });
                            toast.success('Appointment cancelled');
                          }}
                        >
                          <XCircle size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
