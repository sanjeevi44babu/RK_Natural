import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/common/SearchBar';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Appointments() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { appointments } = useData();
  const { user } = useAuth();

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || apt.status === activeFilter;
    if (user?.role === 'doctor') return matchesSearch && matchesFilter && apt.doctorId === user.id;
    if (user?.role === 'physiotherapist') return matchesSearch && matchesFilter && apt.physiotherapistId === user.id;
    return matchesSearch && matchesFilter;
  });

  const canCreate = user?.role === 'doctor' || user?.role === 'supervisor' || user?.role === 'physiotherapist';

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Appointments</h1>
          {canCreate && <button onClick={() => navigate('/appointments/new')} className="btn-primary flex items-center gap-2"><Plus size={18} /> New</button>}
        </div>
        <SearchBar placeholder="Search..." value={search} onChange={setSearch} />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>{f}</button>
          ))}
        </div>
        <div className="space-y-3">
          {filteredAppointments.length === 0 ? <p className="text-center py-12 text-muted-foreground">No appointments</p> : filteredAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} onClick={() => navigate(`/appointments/${apt.id}`)} />)}
        </div>
      </div>
      {canCreate && <button className="fab lg:hidden" onClick={() => navigate('/appointments/new')}><Plus size={24} /></button>}
    </DashboardLayout>
  );
}