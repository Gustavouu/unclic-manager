
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bell, AlertTriangle, X } from 'lucide-react';
import { useErrorHandling } from '@/contexts/ErrorHandlingContext';
import { toast } from 'sonner';

export function ErrorNotificationCenter() {
  const { alertService, errorHandler } = useErrorHandling();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load initial data
    const loadData = () => {
      const recentAlerts = alertService.getAlerts({ 
        acknowledged: false, 
        limit: 10 
      });
      const recentErrors = errorHandler.getErrorHistory(10);
      
      setAlerts(recentAlerts);
      setErrors(recentErrors.filter(error => !error.resolved));
      setUnreadCount(recentAlerts.length + recentErrors.filter(error => !error.resolved).length);
    };

    loadData();

    // Subscribe to new alerts
    const unsubscribe = alertService.subscribe((alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for critical alerts
      if (alert.severity === 'critical' || alert.severity === 'high') {
        toast.error(alert.title, {
          description: alert.message,
          duration: 6000,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [alertService, errorHandler]);

  const handleAcknowledgeAlert = (alertId: string) => {
    alertService.acknowledgeAlert(alertId);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleResolveError = (errorId: string) => {
    errorHandler.markErrorAsResolved(errorId);
    setErrors(prev => prev.filter(error => error.id !== errorId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const totalNotifications = alerts.length + errors.length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Central de Notificações</SheetTitle>
          <SheetDescription>
            Alertas e erros que requerem sua atenção
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {totalNotifications === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma notificação no momento
              </p>
            </div>
          ) : (
            <>
              {/* Alerts Section */}
              {alerts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Alertas ({alerts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <span className="font-medium text-sm">
                              {alert.title}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Errors Section */}
              {errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Erros Não Resolvidos ({errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {errors.map((error) => (
                      <div
                        key={error.id}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(error.severity)}>
                              {error.severity}
                            </Badge>
                            <span className="font-medium text-sm">
                              {error.message}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {error.context?.component} - {error.context?.action}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(error.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResolveError(error.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
