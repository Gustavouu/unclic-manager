
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { usePayment } from "@/hooks/usePayment";
import { logTestResults } from "@/utils/testUtils";
import { PaymentService } from "@/services/payment";

export default function PaymentApiTest() {
  const [activeTab, setActiveTab] = useState("payment-creation");
  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState("100");
  const [serviceId, setServiceId] = useState("1");
  const [customerId, setCustomerId] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [description, setDescription] = useState("Teste de pagamento");
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { processPayment, getPaymentStatus, openPaymentUrl, paymentUrl } = usePayment();

  // Test de criação de pagamento
  const handleTestCreatePayment = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      const result = await processPayment({
        serviceId,
        amount: Number(amount),
        customerId,
        paymentMethod,
        description
      });
      
      setTestResults(prev => [...prev, 
        `✅ Pagamento criado com sucesso!`,
        `ID: ${result.id}`,
        `Status: ${result.status}`,
        `Método: ${result.paymentMethod}`,
        `Valor: R$ ${result.amount.toFixed(2)}`,
        `URL: ${result.paymentUrl || 'N/A'}`,
      ]);
      
      setPaymentId(result.id);
      toast.success("Pagamento criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      setTestResults(prev => [...prev, `❌ Erro ao criar pagamento: ${error.message}`]);
      toast.error("Erro ao criar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  // Test de consulta de status
  const handleTestCheckStatus = async () => {
    if (!paymentId) {
      toast.error("Informe um ID de pagamento");
      return;
    }
    
    setIsLoading(true);
    setTestResults([]);
    
    try {
      const result = await getPaymentStatus(paymentId);
      
      setTestResults(prev => [...prev, 
        `✅ Status consultado com sucesso!`,
        `ID: ${result.id}`,
        `Status: ${result.status}`,
        `Método: ${result.paymentMethod}`,
        `Valor: R$ ${result.amount.toFixed(2)}`,
        `URL: ${result.paymentUrl || 'N/A'}`,
      ]);
      
      toast.success("Status consultado com sucesso!");
    } catch (error) {
      console.error("Erro ao consultar status:", error);
      setTestResults(prev => [...prev, `❌ Erro ao consultar status: ${error.message}`]);
      toast.error("Erro ao consultar status");
    } finally {
      setIsLoading(false);
    }
  };

  // Test de webhook
  const handleTestWebhook = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Simulação da chamada de um webhook
      const webhookPayload = {
        event: "payment.updated",
        data: {
          payment_id: paymentId || "test-id-123",
          status: "approved",
          updated_at: new Date().toISOString()
        }
      };
      
      // Fingimos que isso seria um serviço de webhook recebendo dados
      setTestResults(prev => [...prev, 
        `✅ Payload de webhook simulado:`,
        JSON.stringify(webhookPayload, null, 2)
      ]);
      
      toast.success("Teste de webhook simulado com sucesso");
    } catch (error) {
      console.error("Erro ao simular webhook:", error);
      setTestResults(prev => [...prev, `❌ Erro ao simular webhook: ${error.message}`]);
      toast.error("Erro ao simular webhook");
    } finally {
      setIsLoading(false);
    }
  };

  // Run automated tests
  const runAutomatedTests = () => {
    setTestResults([]);
    logTestResults();
    
    // Capturamos os logs do console
    const logs: string[] = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalConsoleLog(...args);
    };
    
    // Executamos os testes
    logTestResults();
    
    // Restauramos o console.log original
    console.log = originalConsoleLog;
    
    // Atualizamos os resultados
    setTestResults(logs);
    toast.success("Testes automatizados executados");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Testes de API de Pagamento</h1>
      <div className="grid gap-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="payment-creation">Criar Pagamento</TabsTrigger>
            <TabsTrigger value="payment-status">Consultar Status</TabsTrigger>
            <TabsTrigger value="webhook-tests">Testes de Webhook</TabsTrigger>
            <TabsTrigger value="automated-tests">Testes Automatizados</TabsTrigger>
          </TabsList>
          
          {/* Tab para criação de pagamento */}
          <TabsContent value="payment-creation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teste de Criação de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceId">ID do Serviço</Label>
                    <Input 
                      id="serviceId" 
                      value={serviceId} 
                      onChange={e => setServiceId(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerId">ID do Cliente</Label>
                    <Input 
                      id="customerId" 
                      value={customerId} 
                      onChange={e => setCustomerId(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                    <select 
                      id="paymentMethod"
                      className="w-full p-2 border rounded-md"
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                    >
                      <option value="credit_card">Cartão de Crédito</option>
                      <option value="pix">PIX</option>
                      <option value="cash">Dinheiro</option>
                    </select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input 
                      id="description" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <Button onClick={handleTestCreatePayment} disabled={isLoading}>
                    {isLoading ? "Processando..." : "Testar Criação de Pagamento"}
                  </Button>
                  
                  {paymentUrl && (
                    <Button variant="outline" onClick={openPaymentUrl}>
                      Abrir URL de Pagamento
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab para consulta de status */}
          <TabsContent value="payment-status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teste de Consulta de Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentId">ID do Pagamento</Label>
                  <Input 
                    id="paymentId" 
                    value={paymentId} 
                    onChange={e => setPaymentId(e.target.value)} 
                  />
                </div>
                
                <Button onClick={handleTestCheckStatus} disabled={isLoading}>
                  {isLoading ? "Consultando..." : "Consultar Status"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab para testes de webhook */}
          <TabsContent value="webhook-tests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teste de Webhook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookPaymentId">ID do Pagamento para Webhook</Label>
                  <Input 
                    id="webhookPaymentId" 
                    value={paymentId} 
                    onChange={e => setPaymentId(e.target.value)} 
                    placeholder="Opcional - deixe vazio para usar um ID de teste"
                  />
                </div>
                
                <Button onClick={handleTestWebhook} disabled={isLoading}>
                  {isLoading ? "Simulando..." : "Simular Webhook"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab para testes automatizados */}
          <TabsContent value="automated-tests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Testes Automatizados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Este teste executa uma bateria de testes automatizados nas APIs de pagamento.
                </p>
                
                <Button onClick={runAutomatedTests}>
                  Executar Testes Automatizados
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Resultados dos testes */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-80 text-sm">
                {testResults.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
