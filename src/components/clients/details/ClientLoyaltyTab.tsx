import { useState } from "react";
import { Client } from "@/hooks/clients";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Gift, Award, Crown, BadgePlus, BadgeMinus, Percent, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientLoyaltyTabProps {
  client: Client;
  onAddPoints: (points: number) => Promise<void>;
}

export const ClientLoyaltyTab = ({ client, onAddPoints }: ClientLoyaltyTabProps) => {
  const [showAddPointsDialog, setShowAddPointsDialog] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  
  // Determinar nível atual e próximo
  const currentPoints = client.loyaltyPoints || 0;
  
  const loyaltyLevels = [
    { name: 'Bronze', minPoints: 0, maxPoints: 199, icon: <Award className="text-amber-700" size={20} /> },
    { name: 'Prata', minPoints: 200, maxPoints: 499, icon: <Award className="text-gray-400" size={20} /> },
    { name: 'Ouro', minPoints: 500, maxPoints: 999, icon: <Award className="text-yellow-500" size={20} /> },
    { name: 'VIP', minPoints: 1000, maxPoints: Infinity, icon: <Crown className="text-purple-600" size={20} /> },
  ];
  
  const currentLevel = loyaltyLevels.find(level => 
    currentPoints >= level.minPoints && currentPoints <= level.maxPoints
  ) || loyaltyLevels[0];
  
  const nextLevel = loyaltyLevels.find(level => level.minPoints > currentPoints);
  
  // Progresso para o próximo nível
  const progressToNextLevel = nextLevel 
    ? Math.floor(((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100)
    : 100;
  
  // Benefícios por nível
  const levelBenefits = {
    'Bronze': ['Boas-vindas personalizada', 'Notificações de promoções'],
    'Prata': ['Desconto de 5% em produtos', 'Prioridade no agendamento', 'Presente de aniversário'],
    'Ouro': ['Desconto de 10% em produtos', 'Agendamento prioritário', 'Tratamento exclusivo', 'Presente de aniversário premium'],
    'VIP': ['Desconto de 15% em todos os serviços', 'Agendamento prioritário', 'Tratamentos exclusivos', 'Presente de aniversário VIP', 'Eventos exclusivos']
  };
  
  // Opções de resgate
  const redeemOptions = [
    { points: 100, benefit: 'Desconto de 10% no próximo serviço', icon: <Percent size={18} /> },
    { points: 200, benefit: 'Produto gratuito (até R$ 50)', icon: <Gift size={18} /> },
    { points: 500, benefit: 'Serviço adicional gratuito', icon: <Calendar size={18} /> },
    { points: 1000, benefit: 'Sessão de tratamento premium', icon: <Crown size={18} /> },
  ];
  
  const handleAddPoints = async () => {
    if (pointsToAdd > 0) {
      await onAddPoints(pointsToAdd);
      setPointsToAdd(0);
      setShowAddPointsDialog(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Programa de Fidelidade</CardTitle>
              <CardDescription>Gerenciamento de pontos e benefícios</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowAddPointsDialog(true)}
              >
                <BadgePlus size={16} className="mr-2" />
                Adicionar Pontos
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowRedeemDialog(true)}
                disabled={currentPoints < 100}
              >
                <Gift size={16} className="mr-2" />
                Resgatar Benefício
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-3">
                  {currentLevel.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium">Nível {currentLevel.name}</h3>
                  <p className="text-sm text-gray-500">
                    {client.memberSince ? `Membro desde ${format(new Date(client.memberSince), "MMMM yyyy", { locale: ptBR })}` : 'Novo membro'}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>{currentPoints} pontos</span>
                  {nextLevel && <span>{nextLevel.minPoints} pontos para {nextLevel.name}</span>}
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Benefícios do seu nível</h4>
                <ul className="space-y-1">
                  {levelBenefits[currentLevel.name as keyof typeof levelBenefits].map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Histórico de Pontos</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {/* Exemplo de entradas de histórico */}
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium">Agendamento concluído</p>
                    <p className="text-xs text-gray-500">15/04/2023</p>
                  </div>
                  <span className="text-sm font-medium text-green-600 flex items-center">
                    <BadgePlus size={14} className="mr-1" /> 50 pts
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium">Indicação de cliente</p>
                    <p className="text-xs text-gray-500">01/03/2023</p>
                  </div>
                  <span className="text-sm font-medium text-green-600 flex items-center">
                    <BadgePlus size={14} className="mr-1" /> 100 pts
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium">Resgate de desconto</p>
                    <p className="text-xs text-gray-500">20/02/2023</p>
                  </div>
                  <span className="text-sm font-medium text-red-600 flex items-center">
                    <BadgeMinus size={14} className="mr-1" /> 200 pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog para adicionar pontos */}
      <Dialog open={showAddPointsDialog} onOpenChange={setShowAddPointsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Pontos de Fidelidade</DialogTitle>
            <DialogDescription>
              Adicione pontos para {client.name} pela conclusão de serviços ou outras ações.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="points">Quantidade de pontos</Label>
              <Input
                id="points"
                type="number"
                min={1}
                value={pointsToAdd || ''}
                onChange={(e) => setPointsToAdd(Number(e.target.value))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAddPoints} disabled={pointsToAdd <= 0}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para resgatar benefícios */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resgatar Benefício</DialogTitle>
            <DialogDescription>
              Cliente tem {currentPoints} pontos disponíveis para resgate.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              {redeemOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto py-3 px-4 justify-start ${currentPoints < option.points ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentPoints < option.points}
                >
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mr-3">
                      {option.icon}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-left">{option.benefit}</p>
                    </div>
                    <div className="text-sm font-medium">{option.points} pts</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 