import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Thermometer, Weight, Activity, Save } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function HealthCheck() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, addHealthRecord, updatePatient } = useData();
  const { user } = useAuth();
  
  const patient = patients.find(p => p.id === id);
  
  const [formData, setFormData] = useState({
    bloodPressure: patient?.bloodPressure || '',
    temperature: patient?.temperature?.toString() || '',
    weight: patient?.weight?.toString() || '',
    heartRate: '',
    notes: '',
    diagnosis: patient?.diagnosis || '',
    prescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Patient not found</div>
      </DashboardLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const record = {
      id: `hr-${Date.now()}`,
      patientId: patient.id,
      doctorId: user?.role === 'doctor' ? user.id : undefined,
      doctorName: user?.role === 'doctor' ? user.fullName : undefined,
      physiotherapistId: user?.role === 'physiotherapist' ? user.id : undefined,
      physiotherapistName: user?.role === 'physiotherapist' ? user.fullName : undefined,
      date: new Date().toISOString().split('T')[0],
      bloodPressure: formData.bloodPressure || undefined,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
      notes: formData.notes || undefined,
      diagnosis: formData.diagnosis || undefined,
      prescription: formData.prescription || undefined,
      createdAt: new Date().toISOString(),
    };

    addHealthRecord(record);

    // Update patient vitals
    updatePatient(patient.id, {
      bloodPressure: formData.bloodPressure || patient.bloodPressure,
      temperature: formData.temperature ? parseFloat(formData.temperature) : patient.temperature,
      weight: formData.weight ? parseFloat(formData.weight) : patient.weight,
      diagnosis: formData.diagnosis || patient.diagnosis,
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Health check recorded successfully!');
    navigate(`/patients/${patient.id}`);
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

        {/* Patient Info */}
        <div className="card-medical mb-6">
          <div className="flex items-center gap-4">
            <Avatar name={patient.fullName} size="lg" />
            <div>
              <h1 className="text-xl font-bold">{patient.fullName}</h1>
              <p className="text-muted-foreground">{patient.age} years • {patient.gender}</p>
              {patient.roomNumber && (
                <p className="text-sm text-primary">Room {patient.roomNumber}, Bed {patient.bedNumber}</p>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Health Check</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vitals */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Vital Signs</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Heart size={16} className="text-destructive" />
                  Blood Pressure
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80"
                  className="input-medical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Thermometer size={16} className="text-warning" />
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="98.6"
                  className="input-medical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Weight size={16} className="text-primary" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="70"
                  className="input-medical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Activity size={16} className="text-secondary" />
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="72"
                  className="input-medical"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis & Notes */}
          <div className="card-medical space-y-4">
            <h3 className="font-semibold">Medical Assessment</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows={2}
                placeholder="Enter diagnosis..."
                className="input-medical resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional observations..."
                className="input-medical resize-none"
              />
            </div>

            {user?.role === 'doctor' && (
              <div>
                <label className="block text-sm font-medium mb-2">Prescription</label>
                <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Prescribed medications and instructions..."
                  className="input-medical resize-none"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
            <Save size={18} className="mr-2" />
            {isLoading ? 'Saving...' : 'Save Health Check'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
