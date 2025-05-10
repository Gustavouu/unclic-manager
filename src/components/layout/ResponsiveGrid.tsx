
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ColumnConfig = {
  default: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
};

type GridGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ResponsiveGridProps {
  children: ReactNode;
  columns: ColumnConfig;
  gap?: GridGap;
  className?: string;
  equalHeight?: boolean;
}

export function ResponsiveGrid({
  children,
  columns,
  gap = 'md',
  className,
  equalHeight = false,
}: ResponsiveGridProps) {
  // Mapping for column classes
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  // Mapping for responsive breakpoints
  const bpClasses = {
    xs: {
      1: 'xs:grid-cols-1',
      2: 'xs:grid-cols-2',
      3: 'xs:grid-cols-3',
      4: 'xs:grid-cols-4',
      5: 'xs:grid-cols-5',
      6: 'xs:grid-cols-6',
    },
    sm: {
      1: 'sm:grid-cols-1',
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-3',
      4: 'sm:grid-cols-4',
      5: 'sm:grid-cols-5',
      6: 'sm:grid-cols-6',
    },
    md: {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6',
    },
    lg: {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
    },
    xl: {
      1: 'xl:grid-cols-1',
      2: 'xl:grid-cols-2',
      3: 'xl:grid-cols-3',
      4: 'xl:grid-cols-4',
      5: 'xl:grid-cols-5',
      6: 'xl:grid-cols-6',
    },
    '2xl': {
      1: '2xl:grid-cols-1',
      2: '2xl:grid-cols-2',
      3: '2xl:grid-cols-3',
      4: '2xl:grid-cols-4',
      5: '2xl:grid-cols-5',
      6: '2xl:grid-cols-6',
    },
  };

  // Mapping for gap classes
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-10',
  };

  // Construct the column classes
  const columnClass = colClasses[columns.default as keyof typeof colClasses] || 'grid-cols-1';
  
  // Construct the responsive classes
  const responsiveClasses = Object.entries(columns)
    .filter(([key]) => key !== 'default')
    .map(([breakpoint, cols]) => {
      const bp = breakpoint as keyof typeof bpClasses;
      const col = cols as keyof typeof bpClasses[keyof typeof bpClasses];
      return bpClasses[bp]?.[col] || '';
    })
    .join(' ');

  return (
    <div
      className={cn(
        'grid',
        columnClass,
        responsiveClasses,
        gapClasses[gap],
        equalHeight && 'h-full',
        className
      )}
    >
      {children}
    </div>
  );
}
