import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-6 pb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};