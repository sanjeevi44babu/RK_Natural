import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import StaffList from "./pages/StaffList";
import StaffDetail from "./pages/StaffDetail";
import Patients from "./pages/Patients";
import NewPatient from "./pages/NewPatient";
import PatientDetail from "./pages/PatientDetail";
import Appointments from "./pages/Appointments";
import AppointmentDetail from "./pages/AppointmentDetail";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Staff Routes */}
          <Route path="/doctors" element={<StaffList />} />
          <Route path="/supervisors" element={<StaffList />} />
          <Route path="/physiotherapists" element={<StaffList />} />
          <Route path="/doctors/:id" element={<StaffDetail />} />
          <Route path="/supervisors/:id" element={<StaffDetail />} />
          <Route path="/physiotherapists/:id" element={<StaffDetail />} />
          
          {/* Patients Routes - Global */}
          <Route path="/patients" element={<Patients />} />
          <Route path="/new-patient" element={<NewPatient />} />
          <Route path="/patients/:patientId" element={<PatientDetail />} />
          
          {/* Patients Routes - Staff Specific */}
          <Route path="/:staffType/:staffId/patients" element={<Patients />} />
          <Route path="/:staffType/:staffId/new-patient" element={<NewPatient />} />
          <Route path="/:staffType/:staffId/patients/:patientId" element={<PatientDetail />} />
          
          {/* Appointments Routes - Global */}
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/:appointmentId" element={<AppointmentDetail />} />
          
          {/* Appointments Routes - Staff Specific */}
          <Route path="/:staffType/:staffId/appointments" element={<Appointments />} />
          <Route path="/:staffType/:staffId/appointments/:appointmentId" element={<AppointmentDetail />} />
          
          {/* Schedule */}
          <Route path="/schedule" element={<Schedule />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
