import { useParams, useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, Calendar, FileText, Clock, Activity } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

const PatientDetail = () => {
  const { patientId, staffType, staffId } = useParams();
  const navigate = useNavigate();

  // Mock patient data
  const patient = {
    id: patientId,
    name: "Alexander Bennett",
    age: 45,
    gender: "Male",
    email: "alexander.b@email.com",
    phone: "+1 234 567 890",
    address: "123 Main Street, New York, NY 10001",
    condition: "Post-Cardiac Surgery Recovery",
    bloodType: "O+",
    allergies: "Penicillin",
    emergencyContact: "+1 234 567 999",
    admissionDate: "2026-01-15",
    doctor: "Dr. Olivia Turner",
    notes: "Patient is recovering well. Regular monitoring required. Follow-up scheduled for next week.",
    vitals: {
      bp: "120/80",
      pulse: "72 bpm",
      temp: "98.6°F",
      weight: "175 lbs",
    },
    appointments: [
      { date: "2026-01-28", time: "10:00 AM", type: "Follow-up" },
      { date: "2026-02-04", time: "2:00 PM", type: "Physical Therapy" },
    ],
  };

  return (
    <MobileLayout>
      {/* Header with gradient */}
      <div className="nature-gradient rounded-b-3xl pb-6">
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="text-2xl font-bold text-secondary tracking-wide">MEDDICAL</h1>
          <Header showSearch showMenu variant="transparent" />
        </div>
        <div className="px-4 mt-2">
          <Header title="Patient" showBack variant="transparent" />
        </div>

        {/* Patient Card */}
        <div className="mx-4 mt-4 bg-background rounded-2xl p-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-nature-mint flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">{patient.age} yrs • {patient.gender}</p>
              <p className="text-sm text-primary mt-1">{patient.condition}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-accent px-2 py-1 rounded-full text-accent-foreground">
                  Blood: {patient.bloodType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 animate-slide-up">
        {/* Vitals */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Current Vitals
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-accent rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Blood Pressure</p>
              <p className="text-lg font-semibold text-foreground">{patient.vitals.bp}</p>
            </div>
            <div className="bg-accent rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Pulse Rate</p>
              <p className="text-lg font-semibold text-foreground">{patient.vitals.pulse}</p>
            </div>
            <div className="bg-accent rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="text-lg font-semibold text-foreground">{patient.vitals.temp}</p>
            </div>
            <div className="bg-accent rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="text-lg font-semibold text-foreground">{patient.vitals.weight}</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{patient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">{patient.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Medical Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Admission Date</p>
                <p className="text-sm font-medium text-foreground">{patient.admissionDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Assigned Doctor</p>
                <p className="text-sm font-medium text-foreground">{patient.doctor}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-accent rounded-xl p-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-sm font-medium text-foreground">{patient.notes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {patient.appointments.map((apt, index) => (
              <div 
                key={index} 
                className="bg-nature-mint rounded-xl p-4 border-2 border-primary/30 cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(staffType && staffId ? `/${staffType}/${staffId}/appointments` : "/appointments")}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{apt.type}</p>
                    <p className="text-sm text-muted-foreground">{apt.date}</p>
                  </div>
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    {apt.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 nature-btn-outline">Edit Patient</button>
          <button 
            className="flex-1 nature-btn-primary"
            onClick={() => navigate(staffType && staffId ? `/${staffType}/${staffId}/appointments` : "/appointments")}
          >
            View Appointments
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PatientDetail;
