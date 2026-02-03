import { useNavigate } from "react-router-dom";
import LeafIcon from "@/components/icons/LeafIcon";
import MobileLayout from "@/components/layout/MobileLayout";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout className="flex flex-col items-center justify-center px-8">
      <div className="flex flex-col items-center animate-fade-in">
        <LeafIcon className="w-28 h-28 mb-8" />
        <h1 className="text-2xl font-bold text-secondary mb-2">NatureCure HMS</h1>
        <p className="text-muted-foreground text-sm mb-16">
          Healthcare Management System
        </p>

        <div className="w-full space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="nature-btn-outline"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="nature-btn-outline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Welcome;
