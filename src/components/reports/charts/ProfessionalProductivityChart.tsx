
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface ProfessionalProductivityChartProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function ProfessionalProductivityChart({ dateRange, stats }: ProfessionalProductivityChartProps) {
  const data = stats.professionalProductivity;
  
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
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
