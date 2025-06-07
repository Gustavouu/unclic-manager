
import React, { useState } from 'react';
import { useMultiTenant } from '@/contexts/MultiTenantContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Building2, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface BusinessSelectorProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const BusinessSelector: React.FC<BusinessSelectorProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const { 
    currentBusiness, 
    availableBusinesses, 
    isLoading, 
    switchBusiness, 
    hasMultipleBusinesses 
  } = useMultiTenant();
  
  const [isSwitching, setIsSwitching] = useState(false);

  const handleBusinessSwitch = async (businessId: string) => {
    if (businessId === currentBusiness?.id) return;
    
    setIsSwitching(true);
    await switchBusiness(businessId);
    setIsSwitching(false);
  };

  // Don't show selector if there's only one business
  if (!hasMultipleBusinesses) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (!currentBusiness) {
    return null;
  }

  const getBusinessInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'manager':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      owner: 'Proprietário',
      admin: 'Administrador',
      manager: 'Gerente',
      staff: 'Funcionário',
    };
    return roleLabels[role] || role;
  };

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`h-8 ${className}`} disabled={isSwitching}>
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={currentBusiness.logo_url} alt={currentBusiness.name} />
              <AvatarFallback className="text-xs">
                {getBusinessInitials(currentBusiness.name)}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[120px] truncate text-sm">
              {currentBusiness.name}
            </span>
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Selecionar Negócio</p>
              <p className="text-xs text-muted-foreground">
                {availableBusinesses.length} negócio(s) disponível(is)
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableBusinesses.map((business) => (
            <DropdownMenuItem
              key={business.id}
              onClick={() => handleBusinessSwitch(business.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={business.logo_url} alt={business.name} />
                  <AvatarFallback className="text-xs">
                    {getBusinessInitials(business.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{business.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`text-xs ${getRoleColor(business.role)}`}>
                      {getRoleLabel(business.role)}
                    </Badge>
                  </div>
                </div>
                {currentBusiness?.id === business.id && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full justify-between ${className}`}
          disabled={isSwitching}
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentBusiness.logo_url} alt={currentBusiness.name} />
              <AvatarFallback>
                {getBusinessInitials(currentBusiness.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium">{currentBusiness.name}</p>
              <p className="text-xs text-muted-foreground">
                {getRoleLabel(currentBusiness.role)}
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Trocar Negócio</p>
            <p className="text-xs leading-none text-muted-foreground">
              Você tem acesso a {availableBusinesses.length} negócio(s)
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableBusinesses.map((business) => (
          <DropdownMenuItem
            key={business.id}
            onClick={() => handleBusinessSwitch(business.id)}
            className="cursor-pointer p-3"
          >
            <div className="flex items-center space-x-3 w-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={business.logo_url} alt={business.name} />
                <AvatarFallback>
                  {getBusinessInitials(business.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{business.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className={`text-xs ${getRoleColor(business.role)}`}>
                    {getRoleLabel(business.role)}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3 mr-1" />
                    {business.status}
                  </div>
                </div>
              </div>
              {currentBusiness?.id === business.id && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
