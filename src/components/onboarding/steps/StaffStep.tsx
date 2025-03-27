
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Button } from "@/components/ui/button";
import { StaffCard } from "../cards/StaffCard";
import { StaffDialog } from "../dialogs/StaffDialog";
import { PlusCircle, Users } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const StaffStep: React.FC = () => {
  const { hasStaff, setHasStaff, staffMembers, addStaffMember, removeStaffMember, updateStaffMember } = useOnboarding();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(hasStaff ? "with-staff" : "no-staff");
  
  const handleAddStaff = (data: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
    specialties?: string[];
  }) => {
    if (editingStaff) {
      // Atualizando funcionário existente
      updateStaffMember(editingStaff, data);
      toast.success("Profissional atualizado com sucesso!");
    } else {
      // Adicionando novo funcionário
      const newStaff = {
        id: uuidv4(),
        ...data
      };
      addStaffMember(newStaff);
      toast.success("Profissional adicionado com sucesso!");
    }
    
    setIsDialogOpen(false);
    setEditingStaff(null);
  };
  
  const handleEdit = (id: string) => {
    setEditingStaff(id);
    setIsDialogOpen(true);
  };
  
  const handleRemove = (id: string) => {
    removeStaffMember(id);
    toast.success("Profissional removido com sucesso!");
  };
  
  const handleOpenDialog = () => {
    setEditingStaff(null);
    setIsDialogOpen(true);
  };
  
  const getStaffToEdit = () => {
    if (!editingStaff) return null;
    return staffMembers.find(staff => staff.id === editingStaff) || null;
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setHasStaff(value === "with-staff");
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="no-staff">Sou Autônomo</TabsTrigger>
          <TabsTrigger value="with-staff">Tenho Funcionários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="no-staff">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Configuração para Autônomos</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Como profissional autônomo, você pode pular esta etapa. Os agendamentos serão 
                  direcionados diretamente para você, sem necessidade de selecionar profissionais.
                </p>
                <p className="text-sm text-muted-foreground">
                  Você poderá adicionar funcionários posteriormente, caso seu negócio cresça.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="with-staff">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Profissionais</h3>
              <Button onClick={handleOpenDialog} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Profissional
              </Button>
            </div>
            
            {staffMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">
                  Ainda não há profissionais cadastrados.
                </p>
                <Button onClick={handleOpenDialog} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Profissional
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffMembers.map(staff => (
                  <StaffCard
                    key={staff.id}
                    staff={staff}
                    onEdit={() => handleEdit(staff.id)}
                    onRemove={() => handleRemove(staff.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <StaffDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddStaff}
        staff={getStaffToEdit()}
      />
    </div>
  );
};
