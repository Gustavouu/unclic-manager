
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { StickyNote } from "lucide-react";

interface ClientNotesTabProps {
  clientId: string;
  clientNotes?: string | null;
}

export function ClientNotesTab({ clientId, clientNotes }: ClientNotesTabProps) {
  const [notes, setNotes] = useState(clientNotes || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      // In a real application, save notes to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      // You would typically call an API here to update the client's notes
      console.log("Saving notes for client", clientId, notes);
    } catch (error) {
      console.error("Error saving client notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Notas</h3>
        {!isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <Textarea 
            placeholder="Adicione notas sobre o cliente..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setNotes(clientNotes || "");
                setIsEditing(false);
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveNotes} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      ) : (
        notes ? (
          <Card>
            <CardContent className="p-4 whitespace-pre-wrap">
              {notes}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 flex flex-col items-center justify-center">
              <StickyNote className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Nenhuma nota adicionada.</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsEditing(true)}>
                Adicionar nota
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
