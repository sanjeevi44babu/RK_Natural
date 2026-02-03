import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, QrCode, Copy, Check } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Generate unique patient ID
const generatePatientId = () => {
  const prefix = 'PAT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export default function NewPatient() {
  const navigate = useNavigate();
  const { addPatient, users } = useData();
  const { user } = useAuth();

  const [patientId] = useState(generatePatientId());
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    email: '',
    address: '',
    bloodType: '',
    diagnosis: '',
    medicalHistory: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get available therapists (no supervisor selection per request)
  const therapists = users.filter(u => u.role === 'physiotherapist' && u.isApproved);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const copyPatientId = () => {
    navigator.clipboard.writeText(patientId);
    setCopied(true);
    toast.success('Patient ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.age) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsLoading(true);

    const newPatient = {
      id: patientId.toLowerCase().replace(/-/g, ''),
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || undefined,
      age: parseInt(formData.age),
      gender: formData.gender,
      address: formData.address || undefined,
      bloodType: formData.bloodType || undefined,
      diagnosis: formData.diagnosis || undefined,
      medicalHistory: formData.medicalHistory || undefined,
      assignedDoctorId: user?.role === 'doctor' ? user.id : undefined,
      assignedDoctorName: user?.role === 'doctor' ? user.fullName : undefined,
      status: 'outpatient' as const,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    addPatient(newPatient);

    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success(`Patient added successfully! ID: ${patientId}`);
    navigate('/patients');
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto-Generated Patient ID */}
          <div className="card-medical bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <QrCode size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Auto-Generated Patient ID</p>
                <p className="text-xl font-bold font-mono text-primary">{patientId}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyPatientId}
                className="flex items-center gap-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              This ID can be used to scan and retrieve patient information
            </p>
          </div>

          {/* Patient Details */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Patient Details</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  className="input-medical pl-11"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="input-medical"
                  min="0"
                  max="150"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className="input-medical pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="patient@email.com"
                  className="input-medical pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="input-medical pl-11"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Medical Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="input-medical"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Diagnosis / Reason for Visit</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Primary diagnosis or reason for visit..."
                rows={2}
                className="input-medical resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Previous conditions, allergies, medications..."
                rows={3}
                className="input-medical resize-none"
              />
            </div>
          </div>

          {/* Assigned Doctor Info */}
          {user?.role === 'doctor' && (
            <div className="card-medical bg-secondary/5 border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <User size={18} className="text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                  <p className="font-semibold">{user.fullName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Patient...' : 'Add Patient'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
