import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Plus, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

/**
 * Expenses management page — add, edit, delete expense transactions.
 */
export default function ExpensePage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchExpenses = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const data = await transactionService.getAll({ type: 'EXPENSE', page, size: 10, sortBy: 'date', sortDir: 'desc' });
      setTransactions(data.content || []);
      setPagination({ page: data.number, totalPages: data.totalPages, totalElements: data.totalElements });
    } catch {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(currentPage); }, [currentPage, fetchExpenses]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await transactionService.update(editing.id, formData);
        toast.success('Expense updated successfully');
      } else {
        await transactionService.create(formData);
        toast.success('Expense added');
      }
      setShowForm(false);
      setEditing(null);
      fetchExpenses(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tx) => { setEditing(tx); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await transactionService.delete(id);
      toast.success('Expense deleted');
      fetchExpenses(currentPage);
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  const total = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <TrendingDown size={22} className="text-red-500" /> Expenses
          </h1>
          <p className="page-subtitle">Track and manage your spending</p>
        </div>
        <Button id="add-expense-btn" variant="danger" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl px-6 py-4 text-white flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm">Total Expenses Shown</p>
          <p className="text-2xl font-bold">{formatCurrency(total)}</p>
        </div>
        <div className="text-4xl opacity-80">💸</div>
      </div>

      <div className="card">
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? 'Edit Expense' : 'Add Expense'}
        size="md"
      >
        <TransactionForm
          transactionType="EXPENSE"
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}
