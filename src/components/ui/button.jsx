import React from 'react';

export const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100 text-gray-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};