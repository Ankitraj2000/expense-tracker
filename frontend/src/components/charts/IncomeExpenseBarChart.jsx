import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-3">
        <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
            <span className="text-slate-600 dark:text-slate-300">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.fill }}>
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Monthly Income vs Expense Bar Chart.
 * @param {{ [month: string]: number }} incomeData - Monthly income totals
 * @param {{ [month: string]: number }} expenseData - Monthly expense totals
 */
export default function IncomeExpenseBarChart({ incomeData = {}, expenseData = {} }) {
  const months = Object.keys(incomeData);
  const chartData = months.map((month) => ({
    month,
    Income: parseFloat(incomeData[month] || 0),
    Expense: parseFloat(expenseData[month] || 0),
  }));

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
        Monthly Income vs Expense
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} barGap={2} barCategoryGap="30%">
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
            width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>
            )}
          />
          <Bar dataKey="Income"  fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
