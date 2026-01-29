import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showBackground?: boolean;
}

const MobileLayout = ({ children, className = "", showBackground = false }: MobileLayoutProps) => {
  return (
    <div className={`min-h-screen w-full ${showBackground ? 'nature-gradient' : 'bg-background'} ${className}`}>
      <div className="mx-auto max-w-md min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
