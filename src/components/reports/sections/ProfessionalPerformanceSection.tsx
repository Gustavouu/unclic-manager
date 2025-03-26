
import { CalendarRange, Clock, DollarSign, Star } from "lucide-react";

export function ProfessionalPerformanceSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            <CalendarRange className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Total de Atendimentos</p>
          <h3 className="text-2xl font-bold">365</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-amber-100 p-2 rounded-full">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Tempo Médio</p>
          <h3 className="text-2xl font-bold">42 min</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-green-100 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Receita Gerada</p>
          <h3 className="text-2xl font-bold">R$ 31.250</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Avaliação Média</p>
          <h3 className="text-2xl font-bold">4.8</h3>
        </div>
      </div>
    </div>
  );
}
