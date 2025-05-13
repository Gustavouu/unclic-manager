
import React, { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  breadcrumb?: BreadcrumbItem[];
}

export function PageHeader({
  title,
  description,
  actions,
  className = "",
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col space-y-2 mb-6 ${className}`}>
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-muted-foreground/40">/</span>}
              {item.path ? (
                <a
                  href={item.path}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="mt-4 sm:mt-0 flex items-center gap-2 sm:gap-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
