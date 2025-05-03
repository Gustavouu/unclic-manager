
import React from 'react';

interface DataItem {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: DataItem[];
  height?: number;
  title?: string;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  height = 200,
  title
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div>
      {title && <h4 className="text-base font-medium mb-4">{title}</h4>}
      <div style={{ height: `${height}px` }} className="relative">
        <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-2">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue / 2)}</span>
          <span>0</span>
        </div>
        
        <div className="absolute left-8 top-0 right-0 bottom-0 flex flex-col justify-between">
          {/* Horizontal grid lines */}
          <div className="border-b border-dashed border-gray-200 h-0"></div>
          <div className="border-b border-dashed border-gray-200 h-0"></div>
          <div className="border-b border-gray-200 h-0"></div>
        </div>
        
        <div className="absolute left-8 top-0 right-0 bottom-8 flex items-end">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            const barColor = item.color || 'bg-blue-500';
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-end flex-1 px-1"
              >
                <div 
                  className={`w-full ${barColor}`} 
                  style={{ height: `${barHeight}%` }}
                  title={`${item.label}: ${item.value}`}
                ></div>
                <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
