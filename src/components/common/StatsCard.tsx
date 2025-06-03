
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  borderColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  iconColor = "bg-blue-50 text-blue-500",
  borderColor = "border-l-blue-600"
}) => {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className={`p-3 rounded-full ${iconColor}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
