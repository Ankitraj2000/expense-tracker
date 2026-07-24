import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatCurrency, formatRelativeDate } from '../../utils/formatters';
import { ArrowRight } from 'lucide-react';

/**
 * Recent Transactions widget for the dashboard.
 * @param {Array} transactions - Array of transaction objects
 */
export default function RecentTransactions({ transactions = [] }) {
  const navigate = useNavigate();

  const CATEGORY_ICONS = {
    Salary: '💼', Freelancing: '💻', Business: '🏢', Investments: '📈', Other: '💰',
    Food: '🍔', Shopping: '🛍️', Travel: '✈️', Bills: '📄', Medical: '💊',
    Entertainment: '🎬', Education: '📚',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
        <button
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium transition-colors"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-600">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-1">Start by adding income or expenses</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              {/* Category Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
                {CATEGORY_ICONS[tx.category] || '💳'}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {tx.category}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tx.description ? tx.description.substring(0, 30) : formatRelativeDate(tx.date)}
                </p>
              </div>

              {/* Amount + Badge */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-sm font-bold ${tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <Badge type={tx.type}>{tx.type}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
