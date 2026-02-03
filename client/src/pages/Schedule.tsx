import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, User, MapPin } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  type: string;
  location: string;
  duration: string;
}

const scheduleData: Record<number, ScheduleItem[]> = {
  9: [
    { id: "1", time: "09:00 AM", patientName: "Alexander Bennett", type: "Follow-up", location: "Room 201", duration: "30 min" },
    { id: "2", time: "10:30 AM", patientName: "Emily Johnson", type: "Physical Therapy", location: "Therapy A", duration: "45 min" },
  ],
  10: [
    { id: "3", time: "09:30 AM", patientName: "Michael Davidson", type: "Post Surgery", location: "Room 305", duration: "30 min" },
    { id: "4", time: "11:00 AM", patientName: "Sarah Wilson", type: "Consultation", location: "Room 102", duration: "30 min" },
    { id: "5", time: "02:00 PM", patientName: "James Brown", type: "Rehabilitation", location: "Rehab Center", duration: "60 min" },
  ],
  11: [
    { id: "6", time: "10:00 AM", patientName: "Olivia Turner", type: "Chronic Care", location: "Room 201", duration: "30 min" },
    { id: "7", time: "11:30 AM", patientName: "David Lee", type: "Follow-up", location: "Room 102", duration: "30 min" },
    { id: "8", time: "02:30 PM", patientName: "Emma Davis", type: "Physical Therapy", location: "Therapy B", duration: "45 min" },
    { id: "9", time: "04:00 PM", patientName: "Chris Martin", type: "Consultation", location: "Room 305", duration: "30 min" },
  ],
  12: [
    { id: "10", time: "09:00 AM", patientName: "Lisa Anderson", type: "Post Surgery", location: "Room 201", duration: "30 min" },
  ],
  13: [
    { id: "11", time: "10:00 AM", patientName: "Robert Taylor", type: "Rehabilitation", location: "Rehab Center", duration: "60 min" },
    { id: "12", time: "03:00 PM", patientName: "Jennifer White", type: "Follow-up", location: "Room 102", duration: "30 min" },
  ],
  14: [],
};

const days = [
  { day: 9, name: "MON" },
  { day: 10, name: "TUE" },
  { day: 11, name: "WED" },
  { day: 12, name: "THU" },
  { day: 13, name: "FRI" },
  { day: 14, name: "SAT" },
];

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(11);
  const [currentWeek, setCurrentWeek] = useState("January 2026");

  const daySchedule = scheduleData[selectedDay] || [];

  return (
    <MobileLayout>
      {/* Header with gradient */}
      <div className="nature-gradient rounded-b-3xl pb-6">
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="text-2xl font-bold text-secondary tracking-wide">MEDDICAL</h1>
          <Header showSearch showMenu variant="transparent" />
        </div>
        <div className="px-4 mt-2">
          <Header title="Schedule" showBack variant="transparent" />
        </div>

        {/* Month Navigation */}
        <div className="px-4 mt-4 flex items-center justify-between">
          <button className="p-2 rounded-full hover:bg-background/20 transition-colors">
            <ChevronLeft className="w-5 h-5 text-secondary" />
          </button>
          <span className="font-semibold text-secondary">{currentWeek}</span>
          <button className="p-2 rounded-full hover:bg-background/20 transition-colors">
            <ChevronRight className="w-5 h-5 text-secondary" />
          </button>
        </div>

        {/* Calendar Week */}
        <div className="px-4 mt-4">
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

      {/* Schedule List */}
      <div className="px-4 py-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {days.find(d => d.day === selectedDay)?.name}, January {selectedDay}
          </h3>
          <span className="text-sm text-muted-foreground">
            {daySchedule.length} appointment{daySchedule.length !== 1 ? 's' : ''}
          </span>
        </div>

        {daySchedule.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No appointments scheduled</p>
            <button 
              onClick={() => navigate("/appointments")}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              View all appointments
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {daySchedule.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                {/* Time Column */}
                <div className="w-20 flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">{item.time}</p>
                  <p className="text-xs text-muted-foreground">{item.duration}</p>
                </div>

                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  {index < daySchedule.length - 1 && (
                    <div className="w-0.5 flex-1 bg-primary/30 my-1" />
                  )}
                </div>

                {/* Appointment Card */}
                <div 
                  className="flex-1 bg-nature-mint rounded-xl p-4 border-2 border-primary/30 cursor-pointer hover:border-primary transition-colors mb-2"
                  onClick={() => navigate(`/appointments/${item.id}`)}
                >
                  <h4 className="font-semibold text-foreground">{item.patientName}</h4>
                  <p className="text-sm text-primary">{item.type}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Schedule;
