import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarStrip } from '@/components/common/CalendarStrip';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM',
];

export default function CreateAppointment() {
  const navigate = useNavigate();
  const { patients, users, addAppointment, rooms } = useData();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: user?.role === 'doctor' ? user.id : '',
    physiotherapistId: user?.role === 'physiotherapist' ? user.id : '',
    type: 'therapy' as const,
    duration: '45',
    roomNumber: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const doctors = users.filter(u => u.role === 'doctor' && u.isApproved);
  const therapists = users.filter(u => u.role === 'physiotherapist' && u.isApproved);
  const admittedPatients = patients.filter(p => p.status === 'admitted' || p.status === 'outpatient');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    const patient = patients.find(p => p.id === formData.patientId);
    const doctor = doctors.find(d => d.id === formData.doctorId);
    const therapist = therapists.find(t => t.id === formData.physiotherapistId);

    const appointment = {
      id: `apt-${Date.now()}`,
      patientId: formData.patientId,
      patientName: patient?.fullName || '',
      patientAge: patient?.age,
      patientGender: patient?.gender,
      doctorId: formData.doctorId || undefined,
      doctorName: doctor?.fullName,
      physiotherapistId: formData.physiotherapistId || undefined,
      physiotherapistName: therapist?.fullName,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      duration: parseInt(formData.duration),
      status: 'upcoming' as const,
      type: formData.type,
      roomNumber: formData.roomNumber || undefined,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    addAppointment(appointment);

    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Appointment scheduled successfully!');
    navigate('/appointments');
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Schedule Appointment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />

          {/* Time Selection */}
          <div className="card-medical">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Select Time
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={selectedTime === time ? 'time-slot-active' : 'time-slot'}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Selection */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User size={18} className="text-primary" />
              Appointment Details
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">Patient *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="input-medical"
                required
              >
                <option value="">Select Patient</option>
                {admittedPatients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.fullName} - {patient.age} years, {patient.gender}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.role !== 'doctor' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Doctor</label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="input-medical"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.fullName}</option>
                    ))}
                  </select>
                </div>
              )}

              {user?.role !== 'physiotherapist' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Physiotherapist</label>
                  <select
                    name="physiotherapistId"
                    value={formData.physiotherapistId}
                    onChange={handleChange}
                    className="input-medical"
                  >
                    <option value="">Select Physiotherapist</option>
                    {therapists.map(t => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="consultation">Consultation</option>
                  <option value="therapy">Therapy</option>
                  <option value="checkup">Checkup</option>
                  <option value="follow-up">Follow-up</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (mins)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Room</label>
                <select
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.roomNumber}>
                      {room.blockName} - Room {room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes for the appointment..."
                className="input-medical resize-none"
              />
            </div>
          </div>

          <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
            <Calendar size={18} className="mr-2" />
            {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
