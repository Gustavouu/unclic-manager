
import React, { useState } from 'react';
import { useFinancialMetrics } from '@/hooks/payment/useFinancialMetrics';
import { usePlans } from '@/hooks/payment/usePlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const dateRangeOptions = [
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: '180', label: 'Last 180 Days' },
  { value: '365', label: 'Last Year' },
];

export const FinancialDashboard = () => {
  const [dateRange, setDateRange] = useState('180');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate date range
  const calculateDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - parseInt(dateRange));
    return { start, end };
  };
  
  const { 
    metrics, 
    revenueChartData, 
    isLoading, 
    error, 
    refreshMetrics 
  } = useFinancialMetrics(calculateDateRange());
  
  const { plans } = usePlans();

  const handleRefresh = () => {
    refreshMetrics();
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Export data');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Track your business performance and key financial metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button size="icon" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Monthly Recurring Revenue"
          value={metrics?.mrr ?? 0}
          description="Current MRR"
          loading={isLoading}
          format="currency"
        />
        <MetricCard 
          title="Annual Recurring Revenue"
          value={metrics?.arr ?? 0}
          description="Current ARR"
          loading={isLoading}
          format="currency"
        />
        <MetricCard 
          title="Active Subscriptions"
          value={metrics?.activeSubscriptions ?? 0}
          description="Total active subscribers"
          loading={isLoading}
          format="number"
        />
        <MetricCard 
          title="Customer Lifetime Value"
          value={metrics?.customerLifetimeValue ?? 0}
          description="Avg. CLV"
          loading={isLoading}
          format="currency"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-[300px]" />
                ) : (
                  <BarChart 
                    data={revenueChartData}
                    categories={['revenue']}
                    index="month"
                    valueFormatter={(value) => formatCurrency(value)}
                    className="w-full h-[300px]"
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Growth</CardTitle>
                <CardDescription>Total subscriptions over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-[300px]" />
                ) : (
                  <LineChart 
                    data={revenueChartData}
                    categories={['subscriptions']}
                    index="month"
                    valueFormatter={(value) => value.toString()}
                    className="w-full h-[300px]"
                  />
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Business health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Conversion Rate</Label>
                    <p className="text-2xl font-bold">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : `${metrics?.conversionRate.toFixed(1)}%`}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Churn Rate</Label>
                    <p className="text-2xl font-bold">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : `${metrics?.churnRate.toFixed(1)}%`}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Avg. Revenue Per User</Label>
                    <p className="text-2xl font-bold">
                      {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        formatCurrency(metrics?.avgRevenuePerCustomer ?? 0)
                      )}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Total Revenue</Label>
                    <p className="text-2xl font-bold">
                      {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        formatCurrency(metrics?.totalRevenue ?? 0)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Analytics</CardTitle>
              <CardDescription>Detailed subscription metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Subscription analytics content would go here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>Manage your subscription offerings</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </CardHeader>
            <CardContent>
              {plans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No subscription plans found</p>
                  <Button>Create your first plan</Button>
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {plan.interval_count > 1 ? `${plan.interval_count} ${plan.interval}s` : plan.interval}
                          </span>
                          <span className={`text-sm px-2 py-0.5 rounded ${
                            plan.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(plan.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  loading: boolean;
  format: 'currency' | 'number' | 'percent';
}

const MetricCard = ({ title, value, description, loading, format }: MetricCardProps) => {
  const formattedValue = () => {
    if (loading) return <Skeleton className="h-8 w-20" />;
    
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue()}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FinancialDashboard;
