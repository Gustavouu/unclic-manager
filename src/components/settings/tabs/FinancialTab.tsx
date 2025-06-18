
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Receipt, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const FinancialTab = () => {
  const [settings, setSettings] = useState({
    currency: "BRL",
    taxPercentage: 0,
    enableTax: false,
    enableCommissions: true,
    defaultCommission: 40,
    enableAdvancePayments: false,
    advancePaymentPercentage: 50,
    paymentMethods: {
      cash: { enabled: true, fee: 0 },
      credit: { enabled: true, fee: 3.99 },
      debit: { enabled: true, fee: 2.49 },
      pix: { enabled: true, fee: 0 },
      transfer: { enabled: false, fee: 0 }
    },
    automaticInvoicing: false,
    invoiceTemplate: "standard",
    enableReceipts: true,
    enableFinancialReports: true,
    bankingIntegration: false,
    expenseCategories: [
      { id: "1", name: "Aluguel", color: "#ef4444" },
      { id: "2", name: "Produtos", color: "#3b82f6" },
      { id: "3", name: "Marketing", color: "#10b981" },
      { id: "4", name: "Equipamentos", color: "#f59e0b" }
    ],
    enableBudgetTracking: false,
    monthlyBudget: 0
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updatePaymentMethod = (method: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: {
          ...prev.paymentMethods[method as keyof typeof prev.paymentMethods],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    toast.success("Configurações financeiras salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Configure as opções básicas do sistema financeiro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Moeda</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultCommission">Comissão padrão (%)</Label>
              <Input
                id="defaultCommission"
                type="number"
                value={settings.defaultCommission}
                onChange={(e) => updateSetting("defaultCommission", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar impostos</Label>
              <p className="text-sm text-gray-600">Aplicar impostos automaticamente</p>
            </div>
            <Switch
              checked={settings.enableTax}
              onCheckedChange={(checked) => updateSetting("enableTax", checked)}
            />
          </div>

          {settings.enableTax && (
            <div>
              <Label htmlFor="taxPercentage">Percentual de imposto (%)</Label>
              <Input
                id="taxPercentage"
                type="number"
                step="0.01"
                value={settings.taxPercentage}
                onChange={(e) => updateSetting("taxPercentage", parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Sistema de comissões</Label>
              <p className="text-sm text-gray-600">Calcular comissões automaticamente</p>
            </div>
            <Switch
              checked={settings.enableCommissions}
              onCheckedChange={(checked) => updateSetting("enableCommissions", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pagamento
          </CardTitle>
          <CardDescription>
            Configure os métodos de pagamento aceitos e suas taxas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.paymentMethods).map(([method, config]) => {
            const methodNames = {
              cash: "Dinheiro",
              credit: "Cartão de Crédito",
              debit: "Cartão de Débito",
              pix: "PIX",
              transfer: "Transferência"
            };

            return (
              <div key={method} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{methodNames[method as keyof typeof methodNames]}</h3>
                    {!config.enabled && <Badge variant="secondary">Desabilitado</Badge>}
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(checked) => updatePaymentMethod(method, "enabled", checked)}
                  />
                </div>

                {config.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Taxa (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.fee}
                        onChange={(e) => updatePaymentMethod(method, "fee", parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Antecipados</CardTitle>
          <CardDescription>
            Configure pagamentos antecipados para agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exigir pagamento antecipado</Label>
              <p className="text-sm text-gray-600">Clientes devem pagar ao agendar</p>
            </div>
            <Switch
              checked={settings.enableAdvancePayments}
              onCheckedChange={(checked) => updateSetting("enableAdvancePayments", checked)}
            />
          </div>

          {settings.enableAdvancePayments && (
            <div>
              <Label htmlFor="advancePaymentPercentage">Percentual antecipado (%)</Label>
              <Input
                id="advancePaymentPercentage"
                type="number"
                value={settings.advancePaymentPercentage}
                onChange={(e) => updateSetting("advancePaymentPercentage", parseInt(e.target.value))}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Faturas e Recibos
          </CardTitle>
          <CardDescription>
            Configure a emissão automática de documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Faturamento automático</Label>
              <p className="text-sm text-gray-600">Gerar faturas automaticamente</p>
            </div>
            <Switch
              checked={settings.automaticInvoicing}
              onCheckedChange={(checked) => updateSetting("automaticInvoicing", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Emitir recibos</Label>
              <p className="text-sm text-gray-600">Gerar recibos para pagamentos</p>
            </div>
            <Switch
              checked={settings.enableReceipts}
              onCheckedChange={(checked) => updateSetting("enableReceipts", checked)}
            />
          </div>

          <div>
            <Label>Modelo de fatura</Label>
            <Select value={settings.invoiceTemplate} onValueChange={(value) => updateSetting("invoiceTemplate", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Padrão</SelectItem>
                <SelectItem value="modern">Moderno</SelectItem>
                <SelectItem value="classic">Clássico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Relatórios e Análises
          </CardTitle>
          <CardDescription>
            Configure relatórios financeiros e controle de orçamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Relatórios financeiros</Label>
              <p className="text-sm text-gray-600">Gerar relatórios automáticos</p>
            </div>
            <Switch
              checked={settings.enableFinancialReports}
              onCheckedChange={(checked) => updateSetting("enableFinancialReports", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Controle de orçamento</Label>
              <p className="text-sm text-gray-600">Monitorar orçamento mensal</p>
            </div>
            <Switch
              checked={settings.enableBudgetTracking}
              onCheckedChange={(checked) => updateSetting("enableBudgetTracking", checked)}
            />
          </div>

          {settings.enableBudgetTracking && (
            <div>
              <Label htmlFor="monthlyBudget">Orçamento mensal (R$)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                value={settings.monthlyBudget}
                onChange={(e) => updateSetting("monthlyBudget", parseFloat(e.target.value))}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>Integração bancária</Label>
              <p className="text-sm text-gray-600">Sincronizar com conta bancária</p>
            </div>
            <Switch
              checked={settings.bankingIntegration}
              onCheckedChange={(checked) => updateSetting("bankingIntegration", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias de Despesas</CardTitle>
          <CardDescription>
            Gerencie as categorias para organizar suas despesas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {settings.expenseCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Nova Categoria
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Configurações Financeiras
        </Button>
      </div>
    </div>
  );
};
