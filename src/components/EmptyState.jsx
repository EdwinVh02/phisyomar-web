import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action = null,
  className = "" 
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      {Icon && <Icon className="w-12 h-12 text-slate-300 mx-auto mb-3" />}
      <h3 className="text-sm font-medium text-slate-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;