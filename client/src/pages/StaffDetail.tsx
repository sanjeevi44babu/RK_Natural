import { useParams, useNavigate } from "react-router-dom";
import { Star, Phone, MapPin, User, Clock, Award, Users, Plus, Calendar } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

const StaffDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on id
  const staff = {
    name: "Alexander Bennett, M.D.",
    specialty: "Heart Surgeon",
    rating: 4.5,
    reviews: 120,
    experience: "5+ years",
    location: "New York Medical Center",
    about:
      "Dr. Alexander Bennett is a renowned heart surgeon with over 5 years of experience in cardiovascular surgery. He specializes in minimally invasive cardiac procedures and has performed over 500 successful surgeries.",
    highlights: [
      "Board Certified Cardiovascular Surgeon",
      "Fellowship at Johns Hopkins",
      "Published researcher with 20+ papers",
    ],
  };

  const title = type === "doctors" ? "Doctor" : type === "supervisors" ? "Supervisor" : "Physiotherapist";

  // Navigation items based on staff type
  const getNavItems = () => {
    if (type === "doctors") {
      return [
        { label: "New Patient", icon: Plus, path: `/${type}/${id}/new-patient` },
        { label: "Patients", icon: Users, path: `/${type}/${id}/patients` },
      ];
    } else if (type === "supervisors") {
      return [
        { label: "Patients", icon: Users, path: `/${type}/${id}/patients` },
        { label: "Physiotherapist", icon: User, path: "/physiotherapists" },
      ];
    } else {
      return [
        { label: "Appointments", icon: Calendar, path: `/${type}/${id}/appointments` },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <MobileLayout>
      {/* Header with gradient */}
      <div className="nature-gradient rounded-b-3xl pb-6">
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="text-2xl font-bold text-secondary tracking-wide">MEDDICAL</h1>
          <Header showSearch showMenu variant="transparent" />
        </div>
        <div className="px-4 mt-2">
          <Header title={title} showBack variant="transparent" />
        </div>

        {/* Profile Card */}
        <div className="mx-4 mt-4 bg-background rounded-2xl p-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-nature-mint flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{staff.name}</h2>
              <p className="text-sm text-muted-foreground">{staff.specialty}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{staff.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({staff.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="px-4 py-4 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="nav-card w-full"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-6 space-y-6 animate-slide-up">
        {/* Quick Info */}
        <div className="flex gap-4">
          <div className="flex-1 bg-accent rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">{staff.experience}</p>
            <p className="text-xs text-muted-foreground">Experience</p>
          </div>
          <div className="flex-1 bg-accent rounded-xl p-4 text-center">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">NYC</p>
            <p className="text-xs text-muted-foreground">Location</p>
          </div>
          <div className="flex-1 bg-accent rounded-xl p-4 text-center">
            <Award className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">Top</p>
            <p className="text-xs text-muted-foreground">Rated</p>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{staff.about}</p>
        </div>

        {/* Highlights */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Highlights</h3>
          <div className="space-y-2">
            {staff.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-accent rounded-xl p-3"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 nature-btn-outline flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            Call
          </button>
          <button className="flex-1 nature-btn-primary">Book Appointment</button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default StaffDetail;
