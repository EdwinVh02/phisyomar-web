import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  icon: Icon, 
  headerColor = 'blue' 
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {(title || subtitle || Icon) && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 ${colorClasses[headerColor]} rounded-full flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}