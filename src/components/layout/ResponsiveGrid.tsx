
import React from 'react';
import { cn } from '@/lib/utils';

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 'auto-fill' | 'auto-fit';
type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    default: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
  };
  gap?: GridGap;
  className?: string;
  minChildWidth?: string;
  equalHeight?: boolean;
}

export function ResponsiveGrid({
  children,
  columns = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  className,
  minChildWidth,
  equalHeight = false,
}: ResponsiveGridProps) {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const getGridColsClass = () => {
    // Se minChildWidth for fornecido, usamos grid-template-columns com minmax
    if (minChildWidth) {
      return `grid-cols-[repeat(auto-fill,minmax(${minChildWidth},1fr))]`;
    }
    
    // Caso contrário, usamos grid-cols-* responsivos baseados no objeto columns
    const colsDefault = typeof columns.default === 'number' 
      ? `grid-cols-${columns.default}` 
      : columns.default === 'auto-fill' 
        ? 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]' 
        : 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]';
        
    const colsSm = columns.sm && typeof columns.sm === 'number' 
      ? `sm:grid-cols-${columns.sm}` 
      : columns.sm === 'auto-fill' 
        ? 'sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]' 
        : columns.sm === 'auto-fit'
          ? 'sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'
          : '';
          
    const colsMd = columns.md && typeof columns.md === 'number' 
      ? `md:grid-cols-${columns.md}` 
      : columns.md === 'auto-fill' 
        ? 'md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]' 
        : columns.md === 'auto-fit'
          ? 'md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'
          : '';
          
    const colsLg = columns.lg && typeof columns.lg === 'number' 
      ? `lg:grid-cols-${columns.lg}` 
      : columns.lg === 'auto-fill' 
        ? 'lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]' 
        : columns.lg === 'auto-fit'
          ? 'lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'
          : '';
          
    const colsXl = columns.xl && typeof columns.xl === 'number' 
      ? `xl:grid-cols-${columns.xl}` 
      : columns.xl === 'auto-fill' 
        ? 'xl:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]' 
        : columns.xl === 'auto-fit'
          ? 'xl:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'
          : '';

    return cn(
      colsDefault,
      colsSm,
      colsMd,
      colsLg,
      colsXl
    );
  };

  return (
    <div
      className={cn(
        'grid w-full',
        getGridColsClass(),
        gapClasses[gap],
        equalHeight && '[&>*]:h-full',
        className
      )}
    >
      {children}
    </div>
  );
}
