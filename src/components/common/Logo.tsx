import { Leaf } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'white';
}

export function Logo({ size = 'md', showText = true, variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 40,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  const bgClass = variant === 'white' 
    ? 'bg-white/20 border-white/30' 
    : 'bg-primary/10 border-primary/30';
  
  const iconClass = variant === 'white' 
    ? 'text-white' 
    : 'text-primary';
  
  const textClass = variant === 'white' 
    ? 'text-white' 
    : 'text-foreground';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-2xl ${bgClass} border-2 flex items-center justify-center`}>
        <Leaf className={iconClass} size={iconSizes[size]} />
      </div>
      {showText && (
        <div className="text-center">
          <h1 className={`${textSizes[size]} font-bold ${textClass}`}>
            NatureCure HMS
          </h1>
          <p className={`text-xs ${variant === 'white' ? 'text-white/80' : 'text-muted-foreground'}`}>
            Healthcare Management System
          </p>
        </div>
      )}
    </div>
  );
}
