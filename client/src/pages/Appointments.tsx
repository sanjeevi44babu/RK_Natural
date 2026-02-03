import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, Clock, User, MapPin, ChevronRight } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: "upcoming" | "completed" | "cancelled";
  doctor: string;
  location: string;
}

const appointmentsData: Appointment[] = [
  { id: "1", patientName: "Alexander Bennett", date: "2026-01-28", time: "10:00 AM", type: "Follow-up", status: "upcoming", doctor: "Dr. Olivia Turner", location: "Room 201" },
  { id: "2", patientName: "Emily Johnson", date: "2026-01-28", time: "11:30 AM", type: "Physical Therapy", status: "upcoming", doctor: "Dr. Michael Davidson", location: "Therapy Room A" },
  { id: "3", patientName: "Michael Davidson", date: "2026-01-28", time: "2:00 PM", type: "Post Surgery", status: "upcoming", doctor: "Dr. Alexander Bennett", location: "Room 305" },
  { id: "4", patientName: "Olivia Turner", date: "2026-01-27", time: "9:00 AM", type: "Rehabilitation", status: "completed", doctor: "Dr. Sarah Johnson", location: "Rehab Center" },
  { id: "5", patientName: "James Wilson", date: "2026-01-27", time: "3:30 PM", type: "Chronic Care", status: "completed", doctor: "Dr. Olivia Turner", location: "Room 102" },
];

const Appointments = () => {
  const navigate = useNavigate();
  const { staffType, staffId } = useParams();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const filteredAppointments = appointmentsData.filter((apt) => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "bg-muted text-muted-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MobileLayout>
      {/* Header with gradient */}
      <div className="nature-gradient rounded-b-3xl pb-4">
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="text-2xl font-bold text-secondary tracking-wide">MEDDICAL</h1>
          <Header showSearch showMenu variant="transparent" />
        </div>
        <div className="px-4 mt-2">
          <Header title="Appointments" showBack variant="transparent" />
        </div>

        {/* Filter Tabs */}
        <div className="px-4 mt-4 flex gap-2">
          {["all", "upcoming", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-background/50 text-foreground hover:bg-background"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="px-4 py-4">
        <div className="bg-accent rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Today - January 28, 2026</span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-muted-foreground">2</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="px-4 space-y-3 pb-8 animate-slide-up">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            onClick={() => navigate(staffType && staffId ? `/${staffType}/${staffId}/appointments/${apt.id}` : `/appointments/${apt.id}`)}
            className="bg-card rounded-2xl p-4 border border-border cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-nature-mint flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{apt.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{apt.type}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{apt.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{apt.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{apt.doctor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{apt.location}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default Appointments;
