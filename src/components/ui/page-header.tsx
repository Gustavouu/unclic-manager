
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  children,
  className
}: PageHeaderProps) {
  return (
    <header className={cn('mb-6 space-y-2', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {typeof title === 'string' ? (
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          ) : (
            title
          )}
          {description && (
            typeof description === 'string' ? (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            ) : (
              description
            )
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
      
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}
