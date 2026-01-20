import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, ChevronDown, Mail, Phone, Calendar, MapPin, Home, Users, Activity, FileText, LogOut, Menu, X } from 'lucide-react';

const mockUsers = [
  { email: 'patient@rknature.com', password: 'patient123', role: 'patient', name: 'John Doe' },
  { email: 'doctor@rknature.com', password: 'doctor123', role: 'doctor', name: 'Dr. Sarah Smith' },
  { email: 'supervisor@rknature.com', password: 'supervisor123', role: 'supervisor', name: 'Mike Johnson' },
  { email: 'therapist@rknature.com', password: 'therapist123', role: 'therapist', name: 'Emily Brown' },
];

export default function HMSApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', phone: '', dateOfBirth: '', address: '', password: '', confirmPassword: '',
  });

  const roles = [
    { value: 'patient', label: 'Patient' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'therapist', label: 'Therapist' },
  ];

  const handleLogin = () => {
    setMessage({ type: '', text: '' });

    if (!loginData.email || !loginData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    const user = mockUsers.find(
      u => u.email === loginData.email && u.password === loginData.password
    );

    if (user) {
      setCurrentUser(user);
      setMessage({ type: 'success', text: `Welcome back, ${user.name}!` });
    } else {
      setMessage({ type: 'error', text: 'Invalid email or password' });
    }
  };

  const handleSignup = async () => {
    setMessage({ type: '', text: '' });
    if (!userRole || !signupData.name || !signupData.email || !signupData.phone || !signupData.password || !signupData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (signupData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...signupData, role: userRole }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Registration successful! Please login.' });
        setTimeout(() => {
          setIsLogin(true);
          setSignupData({ name: '', email: '', phone: '', dateOfBirth: '', address: '', password: '', confirmPassword: '' });
          setUserRole('');
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Signup failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginData({ email: '', password: '' });
    setUserRole('');
    setSidebarOpen(false);
  };

  // Dashboard Component
  const Dashboard = ({ user }) => {
    const dashboardContent = {
      patient: {
        title: 'Patient Dashboard',
        stats: [
          { label: 'Upcoming Appointments', value: '3', icon: Calendar },
          { label: 'Active Treatments', value: '2', icon: Activity },
          { label: 'Medical Records', value: '12', icon: FileText },
        ],
        recentActivity: [
          'Consultation with Dr. Sarah Smith - Jan 18, 2026',
          'Therapy Session completed - Jan 15, 2026',
          'New prescription added - Jan 12, 2026',
        ]
      },
      doctor: {
        title: 'Doctor Dashboard',
        stats: [
          { label: 'Today\'s Patients', value: '8', icon: Users },
          { label: 'Pending Consultations', value: '5', icon: Activity },
          { label: 'Total Patients', value: '124', icon: User },
        ],
        recentActivity: [
          'Consultation completed - Patient ID: P-1024',
          'Treatment plan updated - Patient ID: P-1019',
          'New patient registered - Patient ID: P-1028',
        ]
      },
      supervisor: {
        title: 'Supervisor Dashboard',
        stats: [
          { label: 'Active Patients', value: '45', icon: Users },
          { label: 'Available Rooms', value: '12', icon: Home },
          { label: 'Staff on Duty', value: '28', icon: Activity },
        ],
        recentActivity: [
          'Room T-204 allocated to Patient P-1024',
          'Therapist assigned to Patient P-1019',
          'Treatment session completed - Room T-208',
        ]
      },
      therapist: {
        title: 'Therapist Dashboard',
        stats: [
          { label: 'Today\'s Sessions', value: '6', icon: Activity },
          { label: 'Completed Sessions', value: '4', icon: FileText },
          { label: 'Pending Sessions', value: '2', icon: Calendar },
        ],
        recentActivity: [
          'Therapy session completed - Patient P-1024',
          'Progress notes updated - Patient P-1019',
          'New therapy assignment - Patient P-1028',
        ]
      },
    };

    const content = dashboardContent[user.role];

    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-700 to-green-800 text-white transition-transform duration-300`}>
          <div className="p-6">
            <div className="bg-white rounded-lg p-3 inline-block">
              <img src="https://www.rknature.com/wp-content/themes/rknature/assets/images/logo.png" alt="RK Nature" className="h-8" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">HMS Portal</h2>
          </div>

          <nav className="mt-6">
            <button className="flex items-center px-6 py-3 bg-green-600 border-l-4 border-white">
              <Home className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </button>
            <button className="flex items-center px-6 py-3 hover:bg-green-600 transition-colors">
              <Users className="w-5 h-5 mr-3" />
              <span>Patients</span>
            </button>
            <button className="flex items-center px-6 py-3 hover:bg-green-600 transition-colors">
              <Activity className="w-5 h-5 mr-3" />
              <span>Activities</span>
            </button>
            <button className="flex items-center px-6 py-3 hover:bg-green-600 transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              <span>Reports</span>
            </button>
          </nav>

          <div className="absolute bottom-0 w-full p-6">
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-4">
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <h1 className="text-2xl font-bold text-gray-800">{content.title}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {content.stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {content.recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-gray-700">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If user is logged in, show dashboard
  if (currentUser) {
    return <Dashboard user={currentUser} />;
  }

  // Auth Page (Login/Signup)
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="bg-white rounded-lg p-4 inline-block shadow-lg">
            <img src="https://www.rknature.com/wp-content/themes/rknature/assets/images/logo.png" alt="RK Nature Logo" className="h-12" />
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Hospital Management System</h1>
          <p className="text-green-100 text-lg leading-relaxed mb-8">
            Streamline hospital operations from patient entry to treatment completion. A centralized digital solution for efficient healthcare management.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold">Digital Patient Records</h3>
                <p className="text-green-100 text-sm">Quick registration and centralized record management</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold">Treatment Tracking</h3>
                <p className="text-green-100 text-sm">Monitor patient progress and therapy sessions</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold">Role-Based Access</h3>
                <p className="text-green-100 text-sm">Secure system access for all staff members</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-green-100 text-sm">© 2026 RK Nature Cure Home. All rights reserved.</div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="bg-white rounded-lg p-4 inline-block shadow-md">
              <img src="https://www.rknature.com/wp-content/themes/rknature/assets/images/logo.png" alt="RK Nature Logo" className="h-10" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-gray-600">{isLogin ? 'Please sign in to continue' : 'Register to get started'}</p>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              {/* User Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Role *</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all flex items-center justify-between bg-white hover:bg-gray-50"
                  >
                    <span className={userRole ? 'text-gray-800' : 'text-gray-400'}>
                      {userRole ? roles.find(r => r.value === userRole)?.label : 'Select your role'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showRoleDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {roles.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => {
                            setUserRole(role.value);
                            setShowRoleDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="text-gray-800">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Signup Fields */}
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={signupData.dateOfBirth}
                        onChange={(e) => setSignupData({...signupData, dateOfBirth: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        value={signupData.address}
                        onChange={(e) => setSignupData({...signupData, address: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                        rows="2"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={isLogin ? loginData.email : signupData.email}
                    onChange={(e) => isLogin ? setLoginData({...loginData, email: e.target.value}) : setSignupData({...signupData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={isLogin ? loginData.password : signupData.password}
                    onChange={(e) => isLogin ? setLoginData({...loginData, password: e.target.value}) : setSignupData({...signupData, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password (Login only) */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={isLogin ? handleLogin : handleSignup}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage({ type: '', text: '' });
                }} className="text-green-600 hover:text-green-700 font-medium">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Need help? Contact support</p>
            <p className="mt-1 text-green-600 font-medium">+91 88700-22211</p>
          </div>
        </div>
      </div>
    </div>
  );
}