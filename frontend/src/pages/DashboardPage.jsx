import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart';
import SavingsTrendChart from '../components/charts/SavingsTrendChart';
import Loader from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Dashboard page — main overview of the user's financial health.
 * Displays stats cards, recent transactions, and three charts.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await dashboardService.getDashboard();
        setData(result);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader variant="inline" text="Loading your dashboard..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-black/10 rounded-full translate-y-12" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-2xl font-bold">Good {getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-white/70 mt-1 text-sm">Here's your financial summary</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Balance"
          amount={data?.totalBalance}
          icon={Wallet}
          gradient="stat-balance"
        />
        <StatsCard
          title="Total Income"
          amount={data?.totalIncome}
          icon={TrendingUp}
          gradient="stat-income"
        />
        <StatsCard
          title="Total Expenses"
          amount={data?.totalExpense}
          icon={TrendingDown}
          gradient="stat-expense"
        />
        <StatsCard
          title="Monthly Savings"
          amount={data?.monthlySavings}
          icon={PiggyBank}
          gradient="stat-savings"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <IncomeExpenseBarChart
          incomeData={data?.monthlyIncome || {}}
          expenseData={data?.monthlyExpense || {}}
        />
        <ExpensePieChart data={data?.expenseByCategory || {}} />
      </div>

      {/* Savings Trend + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SavingsTrendChart
          incomeData={data?.monthlyIncome || {}}
          expenseData={data?.monthlyExpense || {}}
        />
        <RecentTransactions transactions={data?.recentTransactions || []} />
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
