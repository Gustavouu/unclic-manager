
import React, { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  accentColor: string;
}

export const KPICard = ({
  title,
  value,
  description,
  icon,
  accentColor
}: KPICardProps) => {
  return (
    <div className={`relative overflow-hidden rounded-lg border bg-white shadow ${accentColor}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <div className="mt-2">
              <p className="text-3xl font-bold text-gray-800">{value}</p>
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
          </div>
          <div className="rounded-full bg-opacity-10 p-3">
            <div className="h-8 w-8 text-opacity-80">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
