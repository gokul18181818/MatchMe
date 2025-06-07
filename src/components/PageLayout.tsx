import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import Navigation from './Navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  showBackButton, 
  backTo, 
  backLabel,
  className 
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300",
        theme === "dark" 
          ? "bg-zinc-950 text-white" 
          : "bg-white text-zinc-900"
      )}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className={cn(
            "absolute top-[-40rem] right-[-30rem] z-0 blur-[8rem]",
            theme === "dark" ? "opacity-20" : "opacity-10"
          )}
          style={{
            backgroundImage: theme === "dark" 
              ? "radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.1) 40%, transparent 70%)",
            width: "100rem",
            height: "100rem",
          }}
        />
        <div 
          className={cn(
            "absolute bottom-[-40rem] left-[-30rem] z-0 blur-[8rem]",
            theme === "dark" ? "opacity-20" : "opacity-10"
          )}
          style={{
            backgroundImage: theme === "dark" 
              ? "radial-gradient(circle at center, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)",
            width: "100rem",
            height: "100rem",
          }}
        />
      </div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: theme === "dark"
            ? `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content */}
      <div className={cn("container mx-auto px-6 py-6 relative z-10", className)}>
        <Navigation 
          showBackButton={showBackButton}
          backTo={backTo}
          backLabel={backLabel}
        />
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 