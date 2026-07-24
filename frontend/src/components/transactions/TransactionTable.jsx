import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_ICONS = {
  Salary: '💼', Freelancing: '💻', Business: '🏢', Investments: '📈',
  Food: '🍔', Shopping: '🛍️', Travel: '✈️', Bills: '📄', Medical: '💊',
  Entertainment: '🎬', Education: '📚', Other: '💰',
};

/**
 * Transactions data table with pagination and action buttons.
 *
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} pagination - { page, totalPages, totalElements }
 * @param {Function} onPageChange - Called with new page number (0-indexed)
 * @param {Function} onEdit - Called with transaction to edit
 * @param {Function} onDelete - Called with transaction id to delete
 * @param {boolean} loading
 */
export default function TransactionTable({
  transactions = [],
  pagination = {},
  onPageChange,
  onEdit,
  onDelete,
  loading = false,
}) {
  const { page = 0, totalPages = 0, totalElements = 0 } = pagination;

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
        <span className="text-5xl mb-3">📭</span>
        <p className="text-base font-medium text-slate-500 dark:text-slate-400">No transactions found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4">Description</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4 text-right">Amount</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{CATEGORY_ICONS[tx.category] || '💳'}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{tx.category}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                  {tx.description || '—'}
                </td>
                <td className="py-3.5 pr-4">
                  <Badge type={tx.type}>{tx.type}</Badge>
                </td>
                <td className={`py-3.5 pr-4 text-right font-bold ${
                  tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-400 hover:text-primary-600 transition-colors"
                      aria-label={`Edit transaction ${tx.id}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                      aria-label={`Delete transaction ${tx.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{CATEGORY_ICONS[tx.category] || '💳'}</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{tx.category}</p>
                  <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                </div>
              </div>
              <span className={`font-bold text-sm ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </div>
            {tx.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{tx.description}</p>
            )}
            <div className="flex items-center justify-between">
              <Badge type={tx.type}>{tx.type}</Badge>
              <div className="flex gap-2">
                <button onClick={() => onEdit(tx)} className="p-1.5 text-slate-400 hover:text-primary-600">
                  <Pencil size={13} />
                </button>
                <button onClick={() => onDelete(tx.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {transactions.length} of {totalElements} transactions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium px-2">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
