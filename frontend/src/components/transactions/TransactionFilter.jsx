import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import Button from '../ui/Button';

const ALL_CATEGORIES = [
  'Salary', 'Freelancing', 'Business', 'Investments',
  'Food', 'Shopping', 'Travel', 'Bills', 'Medical', 'Entertainment', 'Education', 'Other',
];

/**
 * Filter bar for the Transactions page.
 * @param {Object} filters - Current filter state
 * @param {Function} onChange - Updates a single filter field
 * @param {Function} onReset - Resets all filters
 */
export default function TransactionFilter({ filters, onChange, onReset }) {
  const hasActiveFilters = filters.keyword || filters.type || filters.category || filters.startDate || filters.endDate;

  return (
    <div className="card mb-5">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[180px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="filter-keyword"
            type="text"
            placeholder="Search description..."
            value={filters.keyword}
            onChange={(e) => onChange('keyword', e.target.value)}
            className="input-base pl-9"
          />
        </div>

        {/* Type */}
        <select
          id="filter-type"
          value={filters.type}
          onChange={(e) => onChange('type', e.target.value)}
          className="input-base w-auto"
        >
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        {/* Category */}
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onChange('category', e.target.value)}
          className="input-base w-auto"
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <input
            id="filter-start-date"
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            className="input-base w-auto"
            aria-label="Start date"
          />
          <span className="text-slate-400 text-sm">to</span>
          <input
            id="filter-end-date"
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
            className="input-base w-auto"
            aria-label="End date"
          />
        </div>

        {/* Sort */}
        <select
          id="filter-sort"
          value={`${filters.sortBy}-${filters.sortDir}`}
          onChange={(e) => {
            const [by, dir] = e.target.value.split('-');
            onChange('sortBy', by);
            onChange('sortDir', dir);
          }}
          className="input-base w-auto"
        >
          <option value="date-desc">Date ↓ (Newest)</option>
          <option value="date-asc">Date ↑ (Oldest)</option>
          <option value="amount-desc">Amount ↓ (Highest)</option>
          <option value="amount-asc">Amount ↑ (Lowest)</option>
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X size={14} /> Reset
          </Button>
        )}
      </div>
    </div>
  );
}
