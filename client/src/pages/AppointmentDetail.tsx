import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, MapPin, FileText, Phone, CheckCircle, XCircle } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

const AppointmentDetail = () => {
  const { appointmentId, staffType, staffId } = useParams();
  const navigate = useNavigate();

  // Mock appointment data
  const appointment = {
    id: appointmentId,
    patientName: "Alexander Bennett",
    patientAge: 45,
    patientGender: "Male",
    patientPhone: "+1 234 567 890",
    date: "January 28, 2026",
    time: "10:00 AM",
    duration: "30 minutes",
    type: "Follow-up Consultation",
    status: "upcoming",
    doctor: "Dr. Olivia Turner",
    specialty: "Cardiologist",
    location: "Room 201, Building A",
    notes: "Post-surgery follow-up. Patient should bring recent test results and medication list.",
    previousVisit: "January 15, 2026",
    reason: "Cardiac surgery recovery assessment and medication review.",
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
          <Header title="Appointment" showBack variant="transparent" />
        </div>

        {/* Appointment Summary Card */}
        <div className="mx-4 mt-4 bg-background rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full font-medium">
              {appointment.type}
            </span>
            <span className="text-sm text-primary font-semibold">
              {appointment.status === "upcoming" ? "Upcoming" : "Completed"}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">{appointment.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{appointment.location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 animate-slide-up">
        {/* Patient Info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Patient Information</h3>
          <div className="bg-accent rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-nature-mint flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{appointment.patientName}</h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.patientAge} yrs • {appointment.patientGender}
                </p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{appointment.patientPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Doctor</h3>
          <div className="bg-accent rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-nature-mint flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{appointment.doctor}</h4>
                <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground">{appointment.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Previous Visit</p>
                <p className="text-sm font-medium text-foreground">{appointment.previousVisit}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-accent rounded-xl p-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Reason for Visit</p>
                <p className="text-sm font-medium text-foreground">{appointment.reason}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-accent rounded-xl p-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-sm font-medium text-foreground">{appointment.notes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button className="nature-btn-primary flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Mark as Completed
          </button>
          <button className="nature-btn-outline flex items-center justify-center gap-2 text-destructive border-destructive hover:bg-destructive/10">
            <XCircle className="w-5 h-5" />
            Cancel Appointment
          </button>
          <button 
            className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate(-1)}
          >
            Reschedule
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AppointmentDetail;
