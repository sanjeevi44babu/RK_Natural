import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login({ email, password });
      if (success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Try: admin@naturecure.com');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = [
    { role: 'Admin', email: 'admin@naturecure.com' },
    { role: 'Doctor', email: 'doctor@naturecure.com' },
    { role: 'Supervisor', email: 'supervisor@naturecure.com' },
    { role: 'Therapist', email: 'physio@naturecure.com' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-center">
          <Logo size="lg" variant="white" />
          <p className="mt-8 text-white/80 max-w-md mx-auto">
            Streamline your healthcare practice with our comprehensive management system.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Logo size="md" />
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-primary">Log In</h2>
            <p className="text-muted-foreground mt-2">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@example.com"
                  className="input-medical pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-medical pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-input text-primary focus:ring-primary" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {['G', 'f', 'in'].map((social) => (
                <button
                  key={social}
                  type="button"
                  className="w-12 h-12 rounded-full border-2 border-input flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <span className="font-bold text-muted-foreground">{social}</span>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              New patient?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Register as Patient
              </Link>
            </p>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Staff members (Doctors, Supervisors, Therapists) — Contact your Admin for login credentials.
            </p>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-accent rounded-xl">
            <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword('password');
                  }}
                  className="text-xs text-left p-2 rounded-lg bg-background hover:bg-primary/10 transition-colors"
                >
                  <span className="font-medium">{cred.role}</span>
                  <br />
                  <span className="text-muted-foreground">{cred.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
