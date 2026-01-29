import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Phone, MapPin, User } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
}

const staffData: Record<string, StaffMember[]> = {
  doctors: [
    { id: "1", name: "Alexander Bennett, M.D.", specialty: "Heart Surgeon", rating: 4.5, experience: "5+ years", location: "New York" },
    { id: "2", name: "Dr. Michael Davidson", specialty: "Cardiologist", rating: 4.8, experience: "8+ years", location: "Los Angeles" },
    { id: "3", name: "Dr. Olivia Turner, M.D.", specialty: "General Surgeon", rating: 4.7, experience: "6+ years", location: "Chicago" },
  ],
  supervisors: [
    { id: "1", name: "Sarah Johnson", specialty: "Head Nurse", rating: 4.6, experience: "10+ years", location: "New York" },
    { id: "2", name: "Michael Chen", specialty: "Ward Supervisor", rating: 4.4, experience: "7+ years", location: "Boston" },
  ],
  physiotherapists: [
    { id: "1", name: "Alexander Bennett, Bio.", specialty: "Sports Therapy", rating: 4.5, experience: "5+ years", location: "Miami" },
    { id: "2", name: "Michael Davidson, Bio.", specialty: "Rehabilitation", rating: 4.3, experience: "4+ years", location: "Seattle" },
    { id: "3", name: "Olivia Turner, Bio.", specialty: "Orthopedic", rating: 4.6, experience: "6+ years", location: "Denver" },
  ],
};

const titles: Record<string, string> = {
  doctors: "Doctors",
  supervisors: "Supervisor",
  physiotherapists: "Physiotherapist",
};

const StaffList = () => {
  const { type = "doctors" } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("A-Z");

  const staff = staffData[type] || [];
  const title = titles[type] || "Staff";

  return (
    <MobileLayout>
      {/* Header with gradient */}
      <div className="nature-gradient rounded-b-3xl pb-4">
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="text-2xl font-bold text-secondary tracking-wide">MEDDICAL</h1>
          <Header showSearch showMenu variant="transparent" />
        </div>
        <div className="px-4 mt-2">
          <Header title={title} showBack variant="transparent" />
        </div>
      </div>

      {/* Sort */}
      <div className="px-4 py-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Sort by</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm font-medium text-foreground bg-transparent focus:outline-none cursor-pointer"
        >
          <option value="A-Z">A-Z</option>
          <option value="Rating">Rating</option>
          <option value="Experience">Experience</option>
        </select>
      </div>

      {/* Staff List */}
      <div className="px-4 space-y-4 pb-8 animate-slide-up">
        {staff.map((member) => (
          <div
            key={member.id}
            onClick={() => navigate(`/${type}/${member.id}`)}
            className="staff-card cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-nature-mint flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-foreground">{member.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{member.experience}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{member.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default StaffList;
