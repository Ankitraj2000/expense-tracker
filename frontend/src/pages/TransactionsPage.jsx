import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilter from '../components/transactions/TransactionFilter';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Plus, ArrowLeftRight } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS = {
  keyword: '', type: '', category: '',
  startDate: '', endDate: '',
  sortBy: 'date', sortDir: 'desc',
};

/**
 * All Transactions page with advanced filtering, sorting, and pagination.
 */
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchTransactions = useCallback(async (page = 0, activeFilters = filters) => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        sortBy: activeFilters.sortBy,
        sortDir: activeFilters.sortDir,
        ...(activeFilters.type && { type: activeFilters.type }),
        ...(activeFilters.category && { category: activeFilters.category }),
        ...(activeFilters.startDate && { startDate: activeFilters.startDate }),
        ...(activeFilters.endDate && { endDate: activeFilters.endDate }),
        ...(activeFilters.keyword && { keyword: activeFilters.keyword }),
      };
      const data = await transactionService.getAll(params);
      setTransactions(data.content || []);
      setPagination({ page: data.number, totalPages: data.totalPages, totalElements: data.totalElements });
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handleFilterChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    setCurrentPage(0);
    fetchTransactions(0, updated);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(0);
    fetchTransactions(0, DEFAULT_FILTERS);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await transactionService.update(editing.id, formData);
        toast.success('Transaction updated');
      } else {
        await transactionService.create(formData);
        toast.success('Transaction added');
      }
      setShowForm(false);
      setEditing(null);
      fetchTransactions(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tx) => { setEditing(tx); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction? This cannot be undone.')) return;
    try {
      await transactionService.delete(id);
      toast.success('Transaction deleted');
      fetchTransactions(currentPage);
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ArrowLeftRight size={22} className="text-primary-500" /> Transactions
          </h1>
          <p className="page-subtitle">
            {pagination.totalElements > 0 ? `${pagination.totalElements} total transactions` : 'All your financial records'}
          </p>
        </div>
        <Button id="add-transaction-btn" variant="primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={16} /> Add Transaction
        </Button>
      </div>

      <TransactionFilter
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      <div className="card">
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          onPageChange={(p) => { setCurrentPage(p); fetchTransactions(p); }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? 'Edit Transaction' : 'New Transaction'}
        size="md"
      >
        <TransactionForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}
