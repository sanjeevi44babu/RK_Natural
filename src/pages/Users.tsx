import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/common/SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Users() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, approveUser } = useData();

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleApprove = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    approveUser(userId);
    toast.success('User approved!');
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <SearchBar placeholder="Search users..." value={search} onChange={setSearch} />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'doctor', 'supervisor', 'physiotherapist'].map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${roleFilter === role ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
              {role}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div key={u.id} className="user-card" onClick={() => navigate(`/users/${u.id}`)}>
              <div className="avatar-wrapper"><span className="text-primary font-semibold">{u.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</span></div>
              <div className="flex-1"><h3 className="font-semibold">{u.fullName}</h3><p className="text-sm text-muted-foreground capitalize">{u.role}</p></div>
              {!u.isApproved && user?.role === 'admin' && <Button size="sm" className="bg-success" onClick={(e) => handleApprove(u.id, e)}><Check size={14} /></Button>}
              <span className={`text-xs px-2 py-1 rounded-full ${u.isApproved ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{u.isApproved ? 'Active' : 'Pending'}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}