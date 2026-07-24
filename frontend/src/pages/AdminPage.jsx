import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { ShieldCheck, Users, ArrowLeftRight, Trash2, Shield, RefreshCw, Eye, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // User details modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sData, uData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
      ]);
      setStats(sData || { totalUsers: 0, totalTransactions: 0 });
      setUsers(Array.isArray(uData) ? uData : uData?.content || []);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setUserDetails(null);
    setDetailsLoading(true);
    try {
      const data = await adminService.getUserDetails(user.id);
      setUserDetails(data);
    } catch {
      toast.error('Failed to load user financial details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleToggleRole = async (user) => {
    try {
      const updated = await adminService.toggleRole(user.id);
      toast.success(`Updated role for ${updated.email} to ${updated.role}`);
      fetchData();
      if (selectedUser?.id === user.id) {
        setSelectedUser((prev) => ({ ...prev, role: updated.role }));
      }
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user ${user.email}? This will remove all their financial records.`)) return;
    try {
      await adminService.deleteUser(user.id);
      toast.success('User deleted successfully');
      if (selectedUser?.id === user.id) setSelectedUser(null);
      fetchData();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShieldCheck size={24} className="text-amber-500" /> Admin Control Panel
          </h1>
          <p className="page-subtitle">Manage registered users, inspect full user financial details, and control roles</p>
        </div>
        <Button variant="outline" onClick={fetchData} loading={loading}>
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg shadow-indigo-500/10">
          <div>
            <p className="text-white/80 text-sm font-medium">Total Registered Users</p>
            <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg shadow-amber-500/10">
          <div>
            <p className="text-white/80 text-sm font-medium">Total System Transactions</p>
            <p className="text-3xl font-bold mt-1">{stats.totalTransactions}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <ArrowLeftRight size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users size={18} className="text-primary-500" /> User Directory & Controls ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-400">#{u.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'ROLE_ADMIN'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                      <Shield size={12} /> {u.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {u.createdAt ? u.createdAt.substring(0, 10) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleViewDetails(u)}
                    >
                      <Eye size={14} /> Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleRole(u)}
                    >
                      Toggle Role
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteUser(u)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No registered users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`User Details — ${selectedUser?.name || 'User'}`}
        size="lg"
      >
        {detailsLoading ? (
          <div className="py-12 text-center text-slate-400">Loading user financial records...</div>
        ) : userDetails ? (
          <div className="space-y-5">
            {/* User Overview */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="font-bold text-lg text-slate-900 dark:text-white">{userDetails.name}</p>
                <p className="text-sm text-slate-500">{userDetails.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  userDetails.role === 'ROLE_ADMIN'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
                  {userDetails.role}
                </span>
                <span className="text-xs text-slate-400">Joined: {userDetails.createdAt?.substring(0, 10)}</span>
              </div>
            </div>

            {/* User Financial Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp size={14} /> Total Income
                </p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  {formatCurrency(userDetails.totalIncome)}
                </p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                  <TrendingDown size={14} /> Total Expenses
                </p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300 mt-1">
                  {formatCurrency(userDetails.totalExpense)}
                </p>
              </div>
              <div className="bg-primary-500/10 border border-primary-500/20 p-3 rounded-xl">
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1">
                  <PiggyBank size={14} /> Net Balance
                </p>
                <p className="text-xl font-bold text-primary-700 dark:text-primary-300 mt-1">
                  {formatCurrency(userDetails.netBalance)}
                </p>
              </div>
            </div>

            {/* Recent Transactions List */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                Recent Transactions ({userDetails.transactions?.length || 0})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(userDetails.transactions || []).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge type={tx.type}>{tx.type}</Badge>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{tx.category}</p>
                        <p className="text-xs text-slate-400">{formatDate(tx.date)} {tx.description && `— ${tx.description}`}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}

                {userDetails.transactions?.length === 0 && (
                  <p className="text-center text-slate-400 py-6 text-sm">No transactions recorded by this user yet.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400">Failed to load details</div>
        )}
      </Modal>
    </div>
  );
}
