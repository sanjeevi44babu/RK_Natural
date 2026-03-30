import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, Mail, MapPin, QrCode, Copy,
  Check, Heart, Thermometer, Weight, Ruler,
  ChevronsUpDown, Search, Printer
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'sonner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import treatmentsData from '@/data/treatments.json';

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
  const { addNotification } = useNotifications();

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
    weight: '',
    height: '',
    bloodPressure: '',
    temperature: '',
    allergies: '',
    emergencyContact: '',
    emergencyPhone: '',
    occupation: '',
    maritalStatus: '',
    insuranceId: '',
    assignedPhysiotherapistId: '',
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      bloodPressure: formData.bloodPressure || undefined,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
      assignedPhysiotherapistId: formData.assignedPhysiotherapistId || undefined,
      assignedPhysiotherapistName: formData.assignedPhysiotherapistId
        ? users.find(u => u.id === formData.assignedPhysiotherapistId || (u as any)._id === formData.assignedPhysiotherapistId)?.fullName
        : undefined,
      status: 'outpatient' as const,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    addPatient(newPatient);

    addNotification({
      title: 'New Patient Added',
      message: `${formData.fullName} added by ${user?.role === 'doctor' ? 'Dr. ' : ''}${user?.fullName} (ID: ${patientId})`,
      type: 'info',
      role: 'all',
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success(`Patient added! ID: ${patientId}`);
    navigate(`/patients/${newPatient.id}/qr-tag`);
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
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
              <Button type="button" variant="outline" size="sm" onClick={copyPatientId} className="flex items-center gap-2">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer size={16} />
                Print ID
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">QR tag will be generated after registration</p>
          </div>

          {/* Patient Details */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Patient Details</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter patient name" className="input-medical pl-11" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="input-medical" min="0" max="150" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-medical">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-medical">
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Occupation</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Occupation" className="input-medical" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" className="input-medical pl-11" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="patient@email.com" className="input-medical pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full address" className="input-medical pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Insurance ID</label>
              <input type="text" name="insuranceId" value={formData.insuranceId} onChange={handleChange} placeholder="Insurance number" className="input-medical" />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Emergency Contact</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Name</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency contact name" className="input-medical" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="Emergency contact phone" className="input-medical" />
            </div>
          </div>

          {/* Vitals & Body Measurements */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Heart size={18} className="text-destructive" />
              Vitals & Body Measurements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Heart size={14} className="text-destructive" /> Blood Pressure
                </label>
                <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="120/80" className="input-medical" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Thermometer size={14} className="text-warning" /> Temperature (°F)
                </label>
                <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="98.6" className="input-medical" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Weight size={14} className="text-primary" /> Weight (kg)
                </label>
                <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} placeholder="70" className="input-medical" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Ruler size={14} className="text-secondary" /> Height (cm)
                </label>
                <input type="number" step="0.1" name="height" value={formData.height} onChange={handleChange} placeholder="170" className="input-medical" />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Medical Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Blood Group</label>
                <select name="bloodType" value={formData.bloodType} onChange={handleChange} className="input-medical">
                  <option value="">Select Blood Group</option>
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
              <label className="block text-sm font-medium mb-2">Allergies</label>
              <textarea name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Known allergies (food, medicine, etc.)" rows={2} className="input-medical resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Diagnosis / Reason for Visit</label>
              <textarea name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="Primary diagnosis or reason for visit..." rows={2} className="input-medical resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Medical History</label>
              <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} placeholder="Previous conditions, surgeries, medications..." rows={3} className="input-medical resize-none" />
            </div>
          </div>

          {/* Assign Staff */}
          <div className="card-medical space-y-4">
            {/* <h3 className="font-semibold">Assign Staff</h3> */}

            <div className="space-y-2">
              <label className="block text-sm font-medium">Assigned Physiotherapist</label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between input-medical h-11"
                  >
                    {formData.assignedPhysiotherapistId
                      ? users.find((u) => (u.id || (u as any)._id) === formData.assignedPhysiotherapistId)?.fullName
                      : "Select Physiotherapist..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] md:w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search physiotherapist name..." />
                    <CommandList>
                      <CommandEmpty>No physiotherapist found.</CommandEmpty>
                      <CommandGroup>
                        {users.filter(u => u.role === 'physiotherapist' && u.isApproved).map((therapist) => {
                          const therapistId = therapist.id || (therapist as any)._id;
                          return (
                            <CommandItem
                              key={therapistId}
                              value={therapist.fullName}
                              onSelect={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  assignedPhysiotherapistId: therapistId === formData.assignedPhysiotherapistId ? "" : therapistId
                                }));
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.assignedPhysiotherapistId === therapistId ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {therapist.fullName}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
            {isLoading ? 'Adding Patient...' : 'Add Patient & Generate QR Tag'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
