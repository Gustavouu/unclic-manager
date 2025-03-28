
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface ProfessionalRevenueChartProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function ProfessionalRevenueChart({ dateRange, stats }: ProfessionalRevenueChartProps) {
  const data = stats.professionalRevenue;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
        <Bar dataKey="revenue" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
}
