import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    mobile: "",
    dob: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <MobileLayout>
      <Header title="New Account" showBack />

      <div className="px-6 pt-2 pb-8 animate-fade-in">
        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="nature-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••"
                className="nature-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date Of Birth
            </label>
            <input
              type="text"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="DD / MM / YYYY"
              className="nature-input"
            />
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            By continuing, you agree to the{" "}
            <Link to="#" className="text-primary hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <button type="submit" className="nature-btn-primary">
            Sign Up
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-muted-foreground text-sm mb-4">
            or sign up with
          </p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors">
              <span className="text-xl font-bold text-foreground">G</span>
            </button>
            <button className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors">
              <span className="text-xl font-bold text-foreground">f</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </MobileLayout>
  );
};

export default SignUp;
