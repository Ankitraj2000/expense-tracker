import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Stats card for the dashboard — displays a financial metric.
 * @param {string} title - Card title
 * @param {number|string} amount - Monetary value
 * @param {React.ReactNode} icon - Lucide icon component
 * @param {string} gradient - Tailwind gradient class
 * @param {string} trend - Optional trend text (e.g. "+12% this month")
 * @param {boolean} positive - If true, trend is positive (green), else red
 */
export default function StatsCard({ title, amount, icon: Icon, gradient, trend, positive }) {
  return (
    <div className={`${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-110 transition-transform duration-300" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full translate-y-6 -translate-x-4" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon size={18} className="text-white" />
          </div>
        </div>

        <p className="text-2xl font-bold tracking-tight">{formatCurrency(amount || 0)}</p>

        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {positive
              ? <TrendingUp size={13} className="text-white/70" />
              : <TrendingDown size={13} className="text-white/70" />
            }
            <span className="text-white/70 text-xs">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
