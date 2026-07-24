import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { IndianRupee, Calendar, Tag, FileText, AlertCircle } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelancing', 'Business', 'Investments', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Travel', 'Bills', 'Medical', 'Entertainment', 'Education', 'Other'];

const DEFAULT_FORM = {
  type: 'EXPENSE',
  category: '',
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
};

/**
 * Form for creating/editing an income or expense transaction.
 *
 * @param {string} transactionType - Force 'INCOME' or 'EXPENSE' (optional, for Income/Expense pages)
 * @param {Object} initialData - Data to pre-fill when editing
 * @param {Function} onSubmit - Async submit handler
 * @param {Function} onCancel - Cancel handler
 * @param {boolean} loading - External loading state
 */
export default function TransactionForm({
  transactionType,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        type: initialData.type || transactionType || 'EXPENSE',
        category: initialData.category || '',
        amount: initialData.amount?.toString() || '',
        description: initialData.description || '',
        date: initialData.date || DEFAULT_FORM.date,
      };
    }
    return { ...DEFAULT_FORM, type: transactionType || 'EXPENSE' };
  });

  const [errors, setErrors] = useState({});

  // Update type when prop changes
  useEffect(() => {
    if (transactionType) {
      setForm((prev) => ({ ...prev, type: transactionType, category: '' }));
    }
  }, [transactionType]);

  const categories = form.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const set = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Clear category when type changes
      if (field === 'type') updated.category = '';
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.category) errs.category = 'Please select a category';
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Enter a valid amount greater than zero';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description.trim(),
      date: form.date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Type Toggle (only show if not forced) */}
      {!transactionType && (
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
            Type
          </label>
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {['INCOME', 'EXPENSE'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className={`flex-1 py-2 text-sm font-semibold transition-all duration-200 ${
                  form.type === t
                    ? t === 'INCOME'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
          Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => set('category', cat)}
              className={`px-2 py-2 text-xs rounded-xl border font-medium transition-all duration-150 ${
                form.category === cat
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={11} /> {errors.category}
          </p>
        )}
      </div>

      {/* Amount */}
      <Input
        label="Amount (₹)"
        id="transaction-amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={form.amount}
        onChange={(e) => set('amount', e.target.value)}
        error={errors.amount}
        icon={IndianRupee}
      />

      {/* Date */}
      <Input
        label="Date"
        id="transaction-date"
        type="date"
        value={form.date}
        onChange={(e) => set('date', e.target.value)}
        error={errors.date}
        icon={Calendar}
        max={new Date().toISOString().split('T')[0]}
      />

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Description (optional)
        </label>
        <textarea
          id="transaction-description"
          placeholder="Add a note..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          maxLength={500}
          rows={2}
          className="input-base resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          variant={form.type === 'INCOME' ? 'success' : 'danger'}
          loading={loading}
          className="flex-1"
        >
          {initialData ? 'Update' : `Add ${form.type === 'INCOME' ? 'Income' : 'Expense'}`}
        </Button>
      </div>
    </form>
  );
}
