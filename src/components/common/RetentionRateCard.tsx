
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface RetentionRateCardProps {
  retentionRate: number;
  suggestions?: string[];
}

export function RetentionRateCard({ retentionRate, suggestions = [] }: RetentionRateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Retenção</CardTitle>
        <CardDescription>Porcentagem de clientes que retornam</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{retentionRate}%</div>
        {suggestions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Sugestões:</h4>
            <ul className="text-sm text-muted-foreground">
              {suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
