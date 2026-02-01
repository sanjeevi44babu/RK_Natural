import { useNavigate } from 'react-router-dom';
import { Edit, Phone, Mail, Calendar, MapPin, Briefcase } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const profileDetails = [
    { icon: Mail, label: 'Email', value: user?.email || 'Not set' },
    { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
    { icon: Calendar, label: 'Date of Birth', value: user?.dateOfBirth || 'Not set' },
    { icon: Briefcase, label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Not set' },
    { icon: MapPin, label: 'Address', value: 'Not set' },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Profile Header */}
        <div className="card-medical">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar name={user?.fullName || 'User'} size="xl" />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{user?.fullName}</h1>
              <p className="text-muted-foreground capitalize">{user?.role}</p>
              <span className="badge-primary inline-block mt-2">Active</span>
            </div>
            <Button className="btn-secondary">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="card-medical">
          <h3 className="font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            {profileDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{detail.label}</p>
                    <p className="font-medium">{detail.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="card-medical">
          <h3 className="font-semibold mb-4">Activity</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-sm text-muted-foreground">Patients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">156</p>
              <p className="text-sm text-muted-foreground">Appointments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">4.8</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
          <Button className="flex-1 btn-primary">
            Change Password
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
