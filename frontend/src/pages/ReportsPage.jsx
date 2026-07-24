import { useState } from 'react';
import { reportService } from '../services/reportService';
import { generatePDFReport } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Reports page — generate and export monthly/yearly financial reports.
 */
export default function ReportsPage() {
  const { user } = useAuth();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [reportType, setReportType] = useState('monthly');
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setReport(null);
    try {
      const data = reportType === 'monthly'
        ? await reportService.getMonthlyReport(year, month)
        : await reportService.getYearlyReport(year);
      setReport(data);
      toast.success('Report generated successfully');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!report) return;
    setExporting(true);
    try {
      await generatePDFReport({ report, user });
      toast.success('PDF downloaded successfully 📄');
    } catch {
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BarChart3 size={22} className="text-primary-500" /> Reports
          </h1>
          <p className="page-subtitle">Generate and export your financial reports</p>
        </div>
        {report && (
          <Button
            id="export-pdf-btn"
            variant="primary"
            onClick={handleExportPDF}
            loading={exporting}
          >
            <Download size={16} /> Export PDF
          </Button>
        )}
      </div>

      {/* Report Generator */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-primary-500" /> Generate Report
        </h3>

        <div className="flex flex-wrap gap-4 items-end">
          {/* Report Type */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
              Report Type
            </label>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              {['monthly', 'yearly'].map((t) => (
                <button
                  key={t}
                  onClick={() => setReportType(t)}
                  className={`px-5 py-2 text-sm font-semibold capitalize transition-all ${
                    reportType === t
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Year</label>
            <select
              id="report-year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="input-base w-auto"
            >
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Month (only for monthly) */}
          {reportType === 'monthly' && (
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Month</label>
              <select
                id="report-month"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="input-base w-auto"
              >
                {monthNames.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
          )}

          <Button
            id="generate-report-btn"
            variant="primary"
            onClick={handleGenerate}
            loading={loading}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Results */}
      {report && (
        <div className="space-y-5 animate-slide-up">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <TrendingUp size={16} /> <span className="text-sm">Total Income</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(report.totalIncome)}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <TrendingDown size={16} /> <span className="text-sm">Total Expenses</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(report.totalExpense)}</p>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-violet-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <PiggyBank size={16} /> <span className="text-sm">Net Savings</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(report.netSavings)}</p>
            </div>
          </div>

          {/* Category Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CategoryBreakdown title="Expense Breakdown" data={report.expenseByCategory} total={report.totalExpense} color="red" />
            <CategoryBreakdown title="Income Breakdown" data={report.incomeByCategory} total={report.totalIncome} color="emerald" />
          </div>

          {/* Transaction List */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Transactions — {report.period}
              <span className="ml-2 text-sm font-normal text-slate-500">({report.transactions?.length || 0} records)</span>
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(report.transactions || []).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge type={tx.type}>{tx.type}</Badge>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{tx.category}</p>
                      <p className="text-xs text-slate-500">{formatDate(tx.date)} {tx.description && `— ${tx.description.substring(0, 30)}`}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
              {report.transactions?.length === 0 && (
                <p className="text-center text-slate-400 py-8">No transactions in this period</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryBreakdown({ title, data = {}, total, color }) {
  const entries = Object.entries(data);
  const colorMap = {
    red: 'bg-red-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <div className="card">
      <h4 className="font-semibold text-slate-900 dark:text-white mb-4">{title}</h4>
      {entries.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-4">No data</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([cat, amount]) => {
            const pct = total > 0 ? Math.round((parseFloat(amount) / parseFloat(total)) * 100) : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{cat}</span>
                  <span className="text-slate-500 dark:text-slate-400">{formatCurrency(amount)} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorMap[color]} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
