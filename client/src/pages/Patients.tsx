import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Phone, Calendar, Search, Plus } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  condition: string;
}

const patientsData: Patient[] = [
  { id: "1", name: "Alexander Bennett", age: 45, gender: "Male", phone: "+1 234 567 890", lastVisit: "2026-01-25", condition: "Heart Checkup" },
  { id: "2", name: "Emily Johnson", age: 32, gender: "Female", phone: "+1 234 567 891", lastVisit: "2026-01-24", condition: "Physical Therapy" },
  { id: "3", name: "Michael Davidson", age: 58, gender: "Male", phone: "+1 234 567 892", lastVisit: "2026-01-23", condition: "Post Surgery" },
  { id: "4", name: "Olivia Turner", age: 28, gender: "Female", phone: "+1 234 567 893", lastVisit: "2026-01-22", condition: "Rehabilitation" },
  { id: "5", name: "James Wilson", age: 65, gender: "Male", phone: "+1 234 567 894", lastVisit: "2026-01-21", condition: "Chronic Care" },
];

const Patients = () => {
  const navigate = useNavigate();
  const { staffType, staffId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patientsData.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const backPath = staffType && staffId ? `/${staffType}/${staffId}` : "/dashboard";

  return (
    <MobileLayout>
      {/* Header with gradient */}
      <div className="nature-gradient rounded-b-3xl pb-4">
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="text-2xl font-bold text-secondary tracking-wide">MEDDICAL</h1>
          <Header showSearch showMenu variant="transparent" />
        </div>
        <div className="px-4 mt-2">
          <Header title="Patients" showBack variant="transparent" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nature-input pl-12"
          />
        </div>
      </div>

      {/* Add New Patient Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate(staffType && staffId ? `/${staffType}/${staffId}/new-patient` : "/new-patient")}
          className="nav-card w-full"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Add New Patient</span>
        </button>
      </div>

      {/* Patients List */}
      <div className="px-4 space-y-3 pb-8 animate-slide-up">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => navigate(staffType && staffId ? `/${staffType}/${staffId}/patients/${patient.id}` : `/patients/${patient.id}`)}
            className="staff-card cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-nature-mint flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">{patient.age} yrs • {patient.gender}</p>
                <p className="text-xs text-primary mt-1">{patient.condition}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{patient.lastVisit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default Patients;
