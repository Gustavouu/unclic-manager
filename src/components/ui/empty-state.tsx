
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Package, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Package,
  title,
  description,
  action,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'h-8 w-8',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'h-12 w-12',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'h-16 w-16',
      title: 'text-2xl',
      description: 'text-lg'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center space-y-4',
      classes.container,
      className
    )}>
      <div className="rounded-full bg-muted p-4">
        <Icon className={cn('text-muted-foreground', classes.icon)} />
      </div>
      
      <div className="space-y-2">
        <h3 className={cn('font-semibold text-foreground', classes.title)}>
          {title}
        </h3>
        {description && (
          <p className={cn('text-muted-foreground max-w-sm', classes.description)}>
            {description}
          </p>
        )}
      </div>

      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

export const EmptyStateCard: React.FC<EmptyStateProps> = (props) => {
  return (
    <div className="bg-card rounded-lg border p-6">
      <EmptyState {...props} />
    </div>
  );
};
