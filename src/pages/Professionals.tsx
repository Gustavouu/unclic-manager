
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewProfessionalDialog } from "@/components/professionals/NewProfessionalDialog";
import { Professional } from "@/hooks/professionals/types";
import { EditProfessionalDialog } from "@/components/professionals/EditProfessionalDialog";
import { DeleteProfessionalDialog } from "@/components/professionals/DeleteProfessionalDialog";
import { ProfessionalDetailsDialog } from "@/components/professionals/ProfessionalDetailsDialog";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/common/StatsCard";
import { Users, Award, Briefcase, Calendar } from "lucide-react";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";

const Professionals = () => {
  const [showNewProfessionalDialog, setShowNewProfessionalDialog] = useState(false);
  const { professionals, isLoading } = useProfessionals();
  
  // States for managing dialogs
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const [professionalToEdit, setProfessionalToEdit] = useState<Professional | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  
  const [professionalToDelete, setProfessionalToDelete] = useState<Professional | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const filteredProfessionals = filterStatus === 'all' 
    ? professionals
    : professionals.filter(p => p.status === filterStatus);

  const handleViewDetails = (id: string) => {
    setSelectedProfessionalId(id);
    setDetailsOpen(true);
  };
  
  const handleEditProfessional = (professional: Professional) => {
    setProfessionalToEdit(professional);
    setEditOpen(true);
  };
  
  const handleDeleteProfessional = (professional: Professional) => {
    setProfessionalToDelete(professional);
    setDeleteOpen(true);
  };

  // Calculate total specialties (unique)
  const uniqueSpecialties = Array.from(
    new Set(professionals.flatMap(p => p.specialties || []))
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Profissionais</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie colaboradores e visualize suas informações
          </p>
        </div>
        
        <Button 
          onClick={() => setShowNewProfessionalDialog(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus size={16} />
          Novo Profissional
        </Button>
      </div>

      <ResponsiveGrid columns={{ default: 1, sm: 4 }} gap="md" equalHeight>
        <StatsCard
          title="Total"
          value={professionals.length.toString()}
          icon={<Users size={18} />}
          iconColor="text-blue-600 bg-blue-50"
          borderColor="border-l-blue-600"
          description="Profissionais"
        />
        
        <StatsCard
          title="Ativos"
          value={professionals.filter(p => p.status === 'active').length.toString()}
          icon={<Users size={18} />}
          iconColor="text-green-600 bg-green-50"
          borderColor="border-l-green-600"
          description="Profissionais"
        />
        
        <StatsCard
          title="Especialidades"
          value={uniqueSpecialties.toString()}
          icon={<Award size={18} />}
          iconColor="text-amber-600 bg-amber-50"
          borderColor="border-l-amber-600"
          description="Únicas"
        />
        
        <StatsCard
          title="Agendamentos"
          value="--"
          icon={<Calendar size={18} />}
          iconColor="text-purple-600 bg-purple-50"
          borderColor="border-l-purple-600"
          description="Este mês"
        />
      </ResponsiveGrid>

      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-lg">Lista de Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilterStatus(value as any)}>
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Ativos
                </TabsTrigger>
                <TabsTrigger value="inactive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Inativos
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">Carregando profissionais...</div>
              ) : (
                <ProfessionalsTable 
                  professionals={filteredProfessionals}
                  onProfessionalClick={handleViewDetails}
                  onEditClick={(professional, e) => {
                    e.preventDefault();
                    handleEditProfessional(professional);
                  }}
                  onDeleteClick={(professional, e) => {
                    e.preventDefault();
                    handleDeleteProfessional(professional);
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">Carregando profissionais...</div>
              ) : (
                <ProfessionalsTable 
                  professionals={filteredProfessionals}
                  onProfessionalClick={handleViewDetails}
                  onEditClick={(professional, e) => {
                    e.preventDefault();
                    handleEditProfessional(professional);
                  }}
                  onDeleteClick={(professional, e) => {
                    e.preventDefault();
                    handleDeleteProfessional(professional);
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">Carregando profissionais...</div>
              ) : (
                <ProfessionalsTable 
                  professionals={filteredProfessionals}
                  onProfessionalClick={handleViewDetails}
                  onEditClick={(professional, e) => {
                    e.preventDefault();
                    handleEditProfessional(professional);
                  }}
                  onDeleteClick={(professional, e) => {
                    e.preventDefault();
                    handleDeleteProfessional(professional);
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NewProfessionalDialog 
        open={showNewProfessionalDialog}
        onOpenChange={(open) => setShowNewProfessionalDialog(open)}
      />
      
      {selectedProfessionalId && (
        <ProfessionalDetailsDialog
          professionalId={selectedProfessionalId}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
      
      {professionalToEdit && (
        <EditProfessionalDialog
          professional={professionalToEdit}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
      
      {professionalToDelete && (
        <DeleteProfessionalDialog
          professional={professionalToDelete}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </div>
  );
};

export default Professionals;
