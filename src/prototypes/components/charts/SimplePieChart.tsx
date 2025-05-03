
import React from 'react';

interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: DataItem[];
  size?: number;
  title?: string;
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({ 
  data, 
  size = 200,
  title
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedPercentage = 0;
  
  return (
    <div>
      {title && <h4 className="text-base font-medium mb-4">{title}</h4>}
      <div className="flex justify-center">
        <div style={{ width: `${size}px`, height: `${size}px` }} className="relative">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              // Calculate sector properties
              const percentage = (item.value / total) * 100;
              const startPercentage = accumulatedPercentage;
              accumulatedPercentage += percentage;
              
              // Calculate coordinates
              const radius = 50;
              const center = { x: 50, y: 50 };
              
              // Get coordinates on the circle
              const getCoordinates = (percentage: number) => {
                const angle = (percentage / 100) * 360 * (Math.PI / 180);
                return {
                  x: center.x + radius * Math.cos(angle),
                  y: center.y + radius * Math.sin(angle)
                };
              };
              
              const start = getCoordinates(startPercentage);
              const end = getCoordinates(accumulatedPercentage);
              
              // Create path
              const largeArcFlag = percentage > 50 ? 1 : 0;
              const pathData = [
                `M ${center.x} ${center.y}`,
                `L ${start.x} ${start.y}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
                'Z'
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm">{item.label} - {Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
