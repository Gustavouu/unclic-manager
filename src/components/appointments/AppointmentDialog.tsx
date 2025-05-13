
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentForm } from './AppointmentForm';
import { z } from 'zod';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId?: string;
  onAppointmentCreated?: (data: any) => void;
  onAppointmentUpdated?: (data: any) => void;
}

export function AppointmentDialog({ 
  open, 
  onOpenChange,
  appointmentId,
  onAppointmentCreated,
  onAppointmentUpdated
}: AppointmentDialogProps) {
  const [activeTab, setActiveTab] = useState('appointment');
  const isEditMode = !!appointmentId;
  
  const handleAppointmentSubmit = async (data: z.infer<typeof AppointmentForm.schema>) => {
    console.log("Appointment data submitted:", data);
    
    // Here we would normally save to the database
    const appointmentData = {
      ...data,
      id: appointmentId || Math.random().toString().slice(2, 10),
    };
    
    // Call the appropriate callback
    if (isEditMode && onAppointmentUpdated) {
      onAppointmentUpdated(appointmentData);
    } else if (!isEditMode && onAppointmentCreated) {
      onAppointmentCreated(appointmentData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="appointment" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="appointment">Agendamento</TabsTrigger>
            <TabsTrigger value="customer">Cliente</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointment" className="py-4">
            <AppointmentForm 
              appointmentId={appointmentId}
              onSubmit={handleAppointmentSubmit}
              onCancel={() => onOpenChange(false)}
            />
          </TabsContent>
          
          <TabsContent value="customer" className="py-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Aqui você poderá selecionar um cliente existente ou registrar um novo cliente.
                Esta funcionalidade será implementada em breve.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
