
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Grid2X2, List, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfessionalsLayout } from "@/components/professionals/ProfessionalsLayout";
import { NewProfessionalDialog } from "@/components/professionals/NewProfessionalDialog";

const Professionals = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showNewProfessionalDialog, setShowNewProfessionalDialog] = useState(false);

  const handleOpenNewDialog = () => {
    setShowNewProfessionalDialog(true);
  };

  const handleCloseNewDialog = (open: boolean) => {
    setShowNewProfessionalDialog(open);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-display font-medium mb-4">Gerenciamento de Colaboradores</h1>

      <Card className="border shadow-sm overflow-hidden">
        <Tabs 
          defaultValue="grid" 
          className="w-full"
          onValueChange={(value) => setView(value as "grid" | "list")}
        >
          <div className="flex justify-between items-center p-3 border-b bg-gray-50">
            <TabsList className="bg-gray-200">
              <TabsTrigger value="grid" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Grid2X2 size={16} />
                <span>Cartões</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <List size={16} />
                <span>Lista</span>
              </TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={handleOpenNewDialog}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus size={16} />
              Novo Colaborador
            </Button>
          </div>
          
          <TabsContent value="grid" className="mt-0 p-4">
            <ProfessionalsLayout view="grid" />
          </TabsContent>
          
          <TabsContent value="list" className="mt-0 p-4">
            <ProfessionalsLayout view="list" />
          </TabsContent>
        </Tabs>
      </Card>

      <NewProfessionalDialog 
        open={showNewProfessionalDialog}
        onOpenChange={handleCloseNewDialog}
      />
    </div>
  );
};

export default Professionals;
