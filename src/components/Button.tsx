import React from 'react';
import { cn } from '../lib/utils';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className, 
  variant = 'primary',
  disabled = false
}) => {
  const baseStyles = "font-semibold py-2 px-4 rounded-lg transition-all duration-300 inline-block";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles, 
        variants[variant], 
        disabled && "opacity-50 cursor-not-allowed hover:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button; 