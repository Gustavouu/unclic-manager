
import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
  title?: string;
  color?: string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
  data, 
  height = 200,
  title,
  color = '#3b82f6'
}) => {
  // Find min/max values for scaling
  const values = data.map(point => point.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;
  
  // Calculate points for the polyline
  const chartWidth = 100 - 4; // Leaving some space on each side
  const pointSpacing = chartWidth / (data.length - 1);
  
  const points = data.map((point, index) => {
    const x = 2 + (index * pointSpacing);
    // Calculate y value, inverted since SVG y goes down
    const normalizedValue = range !== 0 
      ? (point.value - minValue) / range 
      : 0.5;
    const y = 95 - (normalizedValue * 90);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div>
      {title && <h4 className="text-base font-medium mb-4">{title}</h4>}
      <div style={{ height: `${height}px` }} className="relative">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Draw horizontal grid lines */}
          <line x1="2" y1="5" x2="98" y2="5" stroke="#f3f4f6" strokeWidth="0.5" />
          <line x1="2" y1="25" x2="98" y2="25" stroke="#f3f4f6" strokeWidth="0.5" />
          <line x1="2" y1="50" x2="98" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
          <line x1="2" y1="75" x2="98" y2="75" stroke="#f3f4f6" strokeWidth="0.5" />
          <line x1="2" y1="95" x2="98" y2="95" stroke="#f3f4f6" strokeWidth="0.5" />
          
          {/* Draw the line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
          
          {/* Draw points */}
          {data.map((point, index) => {
            const x = 2 + (index * pointSpacing);
            const normalizedValue = range !== 0 
              ? (point.value - minValue) / range 
              : 0.5;
            const y = 95 - (normalizedValue * 90);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill="white"
                stroke={color}
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 px-2">
        {data.length > 10 
          ? data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((point, i) => (
              <div key={i} className="text-xs text-gray-500">{point.label}</div>
            ))
          : data.map((point, i) => (
              <div key={i} className="text-xs text-gray-500">{point.label}</div>
            ))
        }
      </div>
    </div>
  );
};
