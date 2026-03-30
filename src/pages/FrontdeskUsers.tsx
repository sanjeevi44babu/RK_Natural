import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/common/SearchBar';
import { useData } from '@/contexts/DataContext';

export default function FrontdeskUsers() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { users } = useData();
  const frontdesks = users.filter(u => u.role === 'frontdesk' && u.isApproved);
  const filtered = frontdesks.filter(f => f.fullName.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Frontdesk Staff</h1>
          <button 
            onClick={() => navigate('/users/create-staff?role=frontdesk')}
            className="btn-primary flex items-center gap-2"
          >
            Create Frontdesk
          </button>
        </div>
        <SearchBar placeholder="Search frontdesk staff..." value={search} onChange={setSearch} />
        <div className="space-y-3">
          {filtered.map((staff) => (
            <div 
              key={staff.id || (staff as any)._id} 
              className="card-medical cursor-pointer" 
              onClick={() => navigate(`/users/${staff.id || (staff as any)._id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {staff.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{staff.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{staff.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">Active</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-accent/50 rounded-2xl">
              <p>No frontdesk staff found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
