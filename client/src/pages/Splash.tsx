import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeafIcon from "@/components/icons/LeafIcon";
import MobileLayout from "@/components/layout/MobileLayout";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <MobileLayout showBackground className="flex items-center justify-center">
      <div className="flex flex-col items-center animate-scale-in">
        <LeafIcon className="w-24 h-24 mb-6" />
        <h1 className="text-2xl font-bold text-secondary mb-2">NatureCure HMS</h1>
        <p className="text-muted-foreground text-sm">Healthcare Management System</p>
      </div>
    </MobileLayout>
  );
};

export default Splash;
