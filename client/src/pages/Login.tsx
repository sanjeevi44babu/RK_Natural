import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <MobileLayout>
      <Header title="Log In" showBack />
      
      <div className="px-6 pt-4 pb-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground mb-8">Welcome</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email or Mobile Number
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button type="submit" className="nature-btn-primary mt-8">
            Log In
          </button>
        </form>

        <div className="mt-8">
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
            <button className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors">
              <span className="text-xl font-bold text-foreground">in</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </MobileLayout>
  );
};

export default Login;
