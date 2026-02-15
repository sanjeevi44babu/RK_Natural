import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addPatient } = useData();
  const { addNotification } = useNotifications();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signup({ ...formData });
      if (success) {
        // Create patient record linked to this user
        const signupData = localStorage.getItem('new_patient_signup');
        if (signupData) {
          const parsed = JSON.parse(signupData);
          const age = parsed.dateOfBirth 
            ? Math.floor((Date.now() - new Date(parsed.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
            : 0;
          
          addPatient({
            id: parsed.id,
            fullName: parsed.fullName,
            email: parsed.email,
            phone: parsed.phone,
            age,
            gender: 'other',
            status: 'outpatient',
            createdAt: new Date().toISOString(),
            isActive: true,
          });
          localStorage.removeItem('new_patient_signup');
          
          // Notify all roles about new patient registration
          addNotification({
            title: 'New Patient Registered',
            message: `${parsed.fullName} has registered as a new patient (ID: ${parsed.id})`,
            type: 'info',
            role: 'all',
          });
        }
        toast.success('Patient account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-center">
          <Logo size="lg" variant="white" />
          <p className="mt-8 text-white/80 max-w-md mx-auto">
            Register as a patient to access your health records, appointments, and more.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-8 text-center">
            <Logo size="md" />
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-primary">Patient Registration</h2>
            <p className="text-muted-foreground mt-2">Create your patient account to get started.</p>
            <div className="mt-3 p-3 bg-accent rounded-xl">
              <p className="text-xs text-muted-foreground">
                🏥 <strong>Staff members</strong> (Doctors, Supervisors, Therapists) — Your account will be created by the Admin. Please contact your administrator.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className="input-medical pl-11" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@example.com" className="input-medical pl-11" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mobile Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your mobile number" className="input-medical pl-11" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date Of Birth</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-medical pl-11" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" className="input-medical pl-11 pr-11" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register as Patient'}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
            </p>
          </form>

          {/* Demo Login Info */}
          <div className="mt-6 p-4 bg-accent rounded-xl">
            <p className="text-xs font-semibold text-foreground mb-2">🔑 Demo Patient Logins:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>alex.bennett@email.com / patient123</p>
              <p>michael.d@email.com / patient123</p>
              <p>olivia.m@email.com / patient123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}