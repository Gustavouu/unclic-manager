
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Clock, XCircle, Info } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'soft';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    colors: {
      solid: 'bg-green-600 text-white border-green-600',
      outline: 'bg-transparent text-green-600 border-green-600',
      soft: 'bg-green-50 text-green-700 border-green-200'
    }
  },
  warning: {
    icon: AlertCircle,
    colors: {
      solid: 'bg-yellow-600 text-white border-yellow-600',
      outline: 'bg-transparent text-yellow-600 border-yellow-600',
      soft: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  },
  error: {
    icon: XCircle,
    colors: {
      solid: 'bg-red-600 text-white border-red-600',
      outline: 'bg-transparent text-red-600 border-red-600',
      soft: 'bg-red-50 text-red-700 border-red-200'
    }
  },
  info: {
    icon: Info,
    colors: {
      solid: 'bg-blue-600 text-white border-blue-600',
      outline: 'bg-transparent text-blue-600 border-blue-600',
      soft: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  },
  pending: {
    icon: Clock,
    colors: {
      solid: 'bg-gray-600 text-white border-gray-600',
      outline: 'bg-transparent text-gray-600 border-gray-600',
      soft: 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  variant = 'soft',
  showIcon = true,
  className
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full border',
      sizeClasses[size],
      config.colors[variant],
      className
    )}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {label}
    </span>
  );
};

// Componente helper para status de agendamentos
export const AppointmentStatus: React.FC<{
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, size = 'md' }) => {
  const statusMap = {
    confirmed: { type: 'success' as StatusType, label: 'Confirmado' },
    pending: { type: 'pending' as StatusType, label: 'Pendente' },
    cancelled: { type: 'error' as StatusType, label: 'Cancelado' },
    completed: { type: 'info' as StatusType, label: 'Concluído' }
  };

  const { type, label } = statusMap[status];

  return (
    <StatusBadge
      status={type}
      label={label}
      size={size}
    />
  );
};

// Componente helper para status de pagamentos
export const PaymentStatus: React.FC<{
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, size = 'md' }) => {
  const statusMap = {
    paid: { type: 'success' as StatusType, label: 'Pago' },
    pending: { type: 'warning' as StatusType, label: 'Pendente' },
    overdue: { type: 'error' as StatusType, label: 'Atrasado' },
    cancelled: { type: 'error' as StatusType, label: 'Cancelado' }
  };

  const { type, label } = statusMap[status];

  return (
    <StatusBadge
      status={type}
      label={label}
      size={size}
    />
  );
};
