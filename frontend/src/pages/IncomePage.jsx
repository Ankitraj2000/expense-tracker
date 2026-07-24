import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Plus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

/**
 * Income management page — add, edit, delete income transactions.
 */
export default function IncomePage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchIncome = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const data = await transactionService.getAll({ type: 'INCOME', page, size: 10, sortBy: 'date', sortDir: 'desc' });
      setTransactions(data.content || []);
      setPagination({ page: data.number, totalPages: data.totalPages, totalElements: data.totalElements });
    } catch {
      toast.error('Failed to load income transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIncome(currentPage); }, [currentPage, fetchIncome]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await transactionService.update(editing.id, formData);
        toast.success('Income updated successfully');
      } else {
        await transactionService.create(formData);
        toast.success('Income added successfully 💰');
      }
      setShowForm(false);
      setEditing(null);
      fetchIncome(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save income');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tx) => {
    setEditing(tx);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income transaction?')) return;
    try {
      await transactionService.delete(id);
      toast.success('Income deleted');
      fetchIncome(currentPage);
    } catch {
      toast.error('Failed to delete income');
    }
  };

  // Total income
  const total = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <TrendingUp size={22} className="text-emerald-500" /> Income
          </h1>
          <p className="page-subtitle">Track all your income sources</p>
        </div>
        <Button id="add-income-btn" variant="success" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={16} /> Add Income
        </Button>
      </div>

      {/* Total Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl px-6 py-4 text-white flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm">Total Income Shown</p>
          <p className="text-2xl font-bold">{formatCurrency(total)}</p>
        </div>
        <div className="text-4xl opacity-80">💰</div>
      </div>

      {/* Table */}
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

      {/* Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? 'Edit Income' : 'Add Income'}
        size="md"
      >
        <TransactionForm
          transactionType="INCOME"
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}
