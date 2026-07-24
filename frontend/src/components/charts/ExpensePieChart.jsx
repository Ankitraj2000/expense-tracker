import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
        <p className="text-xs font-semibold text-slate-900 dark:text-white">{name}</p>
        <p className="text-sm font-bold text-primary-600 dark:text-primary-400">{formatCurrency(value)}</p>
      </div>
    );
  }
  return null;
};

/**
 * Expense category Pie Chart using Recharts.
 * @param {{ [category: string]: number }} data - Expense by category
 */
export default function ExpensePieChart({ data = {} }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value: parseFloat(value) }));

  if (chartData.length === 0) {
    return (
      <div className="card h-full">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Expense by Category</h3>
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
          <span className="text-4xl mb-2">🥧</span>
          <p className="text-sm">No expense data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Expense by Category</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
