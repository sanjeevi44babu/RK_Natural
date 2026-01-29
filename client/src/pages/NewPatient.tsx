import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

const NewPatient = () => {
  const navigate = useNavigate();
  const { staffType, staffId } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    mobile: "",
    address: "",
    condition: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate back to patients list
    const patientsPath = staffType && staffId ? `/${staffType}/${staffId}/patients` : "/patients";
    navigate(patientsPath);
  };

  return (
    <MobileLayout>
      {/* Header with gradient */}
      <div className="nature-gradient rounded-b-3xl pb-4">
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="text-2xl font-bold text-secondary tracking-wide">MEDDICAL</h1>
          <Header showSearch showMenu variant="transparent" />
        </div>
        <div className="px-4 mt-2">
          <Header title="New Patient" showBack variant="transparent" />
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="nature-input"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="45"
                className="nature-input"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="nature-input"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              className="nature-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="nature-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street, City"
              className="nature-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Medical Condition
            </label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              placeholder="Heart Checkup, Physical Therapy, etc."
              className="nature-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              rows={3}
              className="nature-input resize-none"
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="nature-btn-primary">
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default NewPatient;
