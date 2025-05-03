
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon,
  trend,
  color = 'blue'
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'green': return 'bg-green-50 border-green-200 text-green-600';
      case 'amber': return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'red': return 'bg-red-50 border-red-200 text-red-600';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-600';
      case 'indigo': return 'bg-indigo-50 border-indigo-200 text-indigo-600';
      default: return 'bg-blue-50 border-blue-200 text-blue-600';
    }
  };
  
  const getTrendColorClass = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'neutral': return 'text-gray-500';
      default: return '';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up': return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case 'down': return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 7L7 17M7 17H16M7 17V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      default: return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
  };

  return (
    <div className={`rounded-lg border shadow-sm ${getColorClass()}`}>
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <p className="text-3xl font-bold">{value}</p>
        </div>
        
        {trend && (
          <div className={`text-sm flex items-center mt-2 ${getTrendColorClass()}`}>
            {getTrendIcon()}
            <span className="ml-1">
              {trend.value}% {trend.label || (trend.direction === 'up' ? 'aumento' : trend.direction === 'down' ? 'queda' : '')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
