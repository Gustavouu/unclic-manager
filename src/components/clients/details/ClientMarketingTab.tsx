import { useState } from "react";
import { Client } from "@/hooks/clients";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tag, Plus, X, Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";

interface ClientMarketingTabProps {
  client: Client;
  availableTags: string[];
  onUpdateMarketingPreferences: (preferences: Partial<Client['marketingPreferences']>) => Promise<void>;
  onAddTag: (tag: string) => Promise<void>;
  onRemoveTag: (tag: string) => Promise<void>;
}

export const ClientMarketingTab = ({ 
  client, 
  availableTags,
  onUpdateMarketingPreferences,
  onAddTag,
  onRemoveTag
}: ClientMarketingTabProps) => {
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const marketingPreferences = client.marketingPreferences || {
    email: false,
    whatsapp: false,
    sms: false
  };
  
  const clientTags = client.tags || [];
  
  // Lista de tags sugeridas (exclui as que o cliente já tem)
  const suggestedTags = availableTags.filter(tag => !clientTags.includes(tag));
  
  const handleTogglePreference = async (key: keyof Client['marketingPreferences'], value: boolean) => {
    try {
      setIsSubmitting(true);
      await onUpdateMarketingPreferences({ [key]: value });
    } catch (error) {
      console.error("Erro ao atualizar preferência:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onAddTag(newTag.trim());
      setNewTag("");
    } catch (error) {
      console.error("Erro ao adicionar tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSendTestNotification = (channel: string) => {
    toast.success(`Notificação de teste enviada via ${channel}`);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferências de Marketing</CardTitle>
          <CardDescription>
            Gerencie os canais pelos quais o cliente deseja receber comunicações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <Label htmlFor="email-marketing">Email Marketing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="email-marketing" 
                  checked={marketingPreferences.email}
                  onCheckedChange={(value) => handleTogglePreference('email', value)}
                  disabled={isSubmitting}
                />
                {marketingPreferences.email && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSendTestNotification('email')}
                  >
                    <Send size={14} className="mr-1" />
                    Teste
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone size={18} />
                <Label htmlFor="whatsapp-marketing">WhatsApp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="whatsapp-marketing" 
                  checked={marketingPreferences.whatsapp}
                  onCheckedChange={(value) => handleTogglePreference('whatsapp', value)}
                  disabled={isSubmitting}
                />
                {marketingPreferences.whatsapp && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSendTestNotification('WhatsApp')}
                  >
                    <Send size={14} className="mr-1" />
                    Teste
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone size={18} />
                <Label htmlFor="sms-marketing">SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="sms-marketing" 
                  checked={marketingPreferences.sms}
                  onCheckedChange={(value) => handleTogglePreference('sms', value)}
                  disabled={isSubmitting}
                />
                {marketingPreferences.sms && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSendTestNotification('SMS')}
                  >
                    <Send size={14} className="mr-1" />
                    Teste
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Segmentação de Cliente</CardTitle>
          <CardDescription>
            Adicione tags para segmentar este cliente para campanhas específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {clientTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <Tag size={12} />
                {tag}
                <button 
                  onClick={() => onRemoveTag(tag)}
                  className="ml-1 text-gray-400 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
            
            {clientTags.length === 0 && (
              <p className="text-sm text-gray-500">Nenhuma tag adicionada ainda.</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Adicionar nova tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1"
            />
            <Button 
              size="sm" 
              onClick={handleAddTag}
              disabled={!newTag.trim() || isSubmitting}
            >
              <Plus size={14} className="mr-1" />
              Adicionar
            </Button>
          </div>
          
          {suggestedTags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Tags sugeridas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.slice(0, 10).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => onAddTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 