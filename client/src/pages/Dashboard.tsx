import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Stethoscope, UserCog, Activity, BedDouble, Users, Calendar, ClipboardList } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

const days = [
  { day: 9, name: "MON" },
  { day: 10, name: "TUE" },
  { day: 11, name: "WED", active: true },
  { day: 12, name: "THU" },
  { day: 13, name: "FRI" },
  { day: 14, name: "SAT" },
];

const stats = [
  { label: "Doctor", count: 20, icon: Stethoscope },
  { label: "Patients", count: 20, icon: Users },
  { label: "Beds", count: 20, icon: BedDouble },
];

const navItems = [
  { label: "Doctors", icon: Stethoscope, path: "/doctors" },
  { label: "Supervisor", icon: UserCog, path: "/supervisors" },
  { label: "Physiotherapist", icon: Activity, path: "/physiotherapists" },
  { label: "Patients", icon: Users, path: "/patients" },
  { label: "Appointments", icon: Calendar, path: "/appointments" },
  { label: "Schedule", icon: ClipboardList, path: "/schedule" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(11);

  return (
    <MobileLayout>
      {/* Top section with gradient */}
      <div className="nature-gradient rounded-b-3xl pb-6">
        <div className="px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <User className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-secondary/70">Hi, WelcomeBack</p>
              <p className="font-semibold text-secondary">Admin</p>
            </div>
          </div>
          <Header
            showSearch
            showMenu
            onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
            isMenuOpen={isMenuOpen}
            variant="transparent"
          />
        </div>

        <div className="px-4 mt-4">
          <h1 className="text-2xl font-bold text-secondary tracking-wide">MEDDICAL</h1>
        </div>

        {/* Calendar */}
        <div className="px-4 mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`calendar-day ${
                  selectedDay === d.day ? "calendar-day-active" : "calendar-day-inactive"
                }`}
              >
                <span className="text-lg font-semibold">{d.day}</span>
                <span className="text-[10px] uppercase">{d.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 animate-fade-in">
          <div className="nature-gradient h-12" />
          <div className="flex flex-col items-center pt-16 gap-6">
            {[
              { label: "Home", path: "/dashboard" },
              { label: "About us", path: "#" },
              { label: "Services", path: "#" },
              { label: "Doctors", path: "/doctors" },
              { label: "Contact", path: "#" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (item.path !== "#") navigate(item.path);
                }}
                className={`text-lg ${
                  item.label === "Home" ? "font-bold text-secondary" : "text-foreground"
                } hover:text-primary transition-colors`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-6 animate-slide-up">
        {/* Appointment Info */}
        <div 
          className="bg-accent rounded-2xl p-4 mb-6 border border-border cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate("/schedule")}
        >
          <p className="text-xs text-muted-foreground mb-1">{selectedDay} Wednesday - Today</p>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <p className="text-sm text-muted-foreground">10:00 AM</p>
              <p className="text-sm text-muted-foreground">11:AM</p>
            </div>
            <div className="flex-1 bg-nature-mint rounded-xl p-3 ml-2">
              <p className="font-semibold text-foreground text-sm">Dr. Olivia Turner,</p>
              <p className="text-xs text-muted-foreground">
                Assessment and prevention of chronic wound debridement.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="stat-card flex-1 cursor-pointer hover:shadow-md transition-all"
              onClick={() => {
                if (stat.label === "Doctor") navigate("/doctors");
                else if (stat.label === "Patients") navigate("/patients");
              }}
            >
              <stat.icon className="w-6 h-6 text-primary mb-2" />
              <span className="text-xl font-bold text-foreground">{stat.count}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="space-y-3">
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
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
