
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: { label: string; path?: string }[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  children,
  className
}: PageHeaderProps) {
  return (
    <header className={cn('mb-6 space-y-2', className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            {breadcrumb.map((item, index) => {
              if (index === breadcrumb.length - 1) {
                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }
              
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={item.path || '#'}>{item.label}</BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      
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
