import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const savings = payload[0]?.value || 0;
    const isPositive = savings >= 0;
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-3">
        <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
        <p className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{formatCurrency(savings)}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Monthly Savings Trend Line/Area Chart.
 * Savings = Income - Expense for each month.
 */
export default function SavingsTrendChart({ incomeData = {}, expenseData = {} }) {
  const months = Object.keys(incomeData);
  const chartData = months.map((month) => ({
    month,
    Savings: parseFloat(incomeData[month] || 0) - parseFloat(expenseData[month] || 0),
  }));

  const hasPositive = chartData.some((d) => d.Savings > 0);
  const hasNegative = chartData.some((d) => d.Savings < 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Savings Trend</h3>
        <span className="text-xs text-slate-400 dark:text-slate-500">Income − Expense per month</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="4 4" />
          <Area
            type="monotone"
            dataKey="Savings"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#savingsGradient)"
            dot={{ fill: '#6366f1', r: 3 }}
            activeDot={{ r: 5, fill: '#6366f1' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
