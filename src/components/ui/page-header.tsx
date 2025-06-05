
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  backButton?: {
    label?: string;
    onClick: () => void;
  };
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  backButton,
  className
}) => {
  return (
    <div className={cn('space-y-4 pb-6 border-b', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {item.href || item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          {backButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={backButton.onClick}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {backButton.label || 'Voltar'}
            </Button>
          )}

          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export const PageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6', className)}>
      {children}
    </div>
  );
};
