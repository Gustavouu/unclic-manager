
import React from 'react';

type ColumnConfig = {
  default: 1 | 2 | 3 | 4 | 5 | 6;
  sm?: 1 | 2 | 3 | 4 | 5 | 6;
  md?: 1 | 2 | 3 | 4 | 5 | 6;
  lg?: 1 | 2 | 3 | 4 | 5 | 6;
  xl?: 1 | 2 | 3 | 4 | 5 | 6;
};

type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns: ColumnConfig;
  gap?: GapSize;
  className?: string;
  equalHeight?: boolean;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns,
  gap = 'md',
  className = '',
  equalHeight = false
}) => {
  // Map column config to Tailwind classes
  const getColumnClasses = () => {
    const classes = [];
    
    // Default (xs) breakpoint
    classes.push(`grid-cols-${columns.default}`);
    
    // SM breakpoint
    if (columns.sm) {
      classes.push(`sm:grid-cols-${columns.sm}`);
    }
    
    // MD breakpoint
    if (columns.md) {
      classes.push(`md:grid-cols-${columns.md}`);
    }
    
    // LG breakpoint
    if (columns.lg) {
      classes.push(`lg:grid-cols-${columns.lg}`);
    }
    
    // XL breakpoint
    if (columns.xl) {
      classes.push(`xl:grid-cols-${columns.xl}`);
    }
    
    return classes.join(' ');
  };
  
  // Map gap size to Tailwind classes
  const getGapClass = () => {
    switch (gap) {
      case 'none': return 'gap-0';
      case 'xs': return 'gap-1';
      case 'sm': return 'gap-2';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      case 'xl': return 'gap-8';
      default: return 'gap-4';
    }
  };
  
  return (
    <div 
      className={`grid ${getColumnClasses()} ${getGapClass()} ${equalHeight ? 'h-full' : ''} ${className}`}
    >
      {React.Children.map(children, child => 
        equalHeight && React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement, { 
              className: `h-full ${(child as React.ReactElement).props.className || ''}` 
            })
          : child
      )}
    </div>
  );
};
