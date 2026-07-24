/**
 * Badge component for transaction types and statuses.
 */
export default function Badge({ type, children, className = '' }) {
  const styles = {
    INCOME:  'badge-income',
    EXPENSE: 'badge-expense',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    info:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  };

  const icons = {
    INCOME:  '↑',
    EXPENSE: '↓',
  };

  const style = styles[type] || styles.default;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${style} ${className}`}>
      {icons[type] && <span>{icons[type]}</span>}
      {children}
    </span>
  );
}
