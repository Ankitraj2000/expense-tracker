import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard':    { title: 'Dashboard',    subtitle: 'Overview of your finances' },
  '/income':       { title: 'Income',       subtitle: 'Manage your income sources' },
  '/expenses':     { title: 'Expenses',     subtitle: 'Track your spending' },
  '/transactions': { title: 'Transactions', subtitle: 'All your financial records' },
  '/reports':      { title: 'Reports',      subtitle: 'Insights and analytics' },
  '/profile':      { title: 'Profile',      subtitle: 'Manage your account' },
  '/admin':        { title: 'Admin Panel',  subtitle: 'System administration & user control' },
};

/**
 * Top navigation bar with menu toggle, page title, theme switch, and logout button.
 * @param {Function} onMenuClick - Toggles mobile sidebar
 */
export default function Navbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const page = PAGE_TITLES[location.pathname] || { title: 'Expense Tracker', subtitle: '' };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-4">
        <button
          id="mobile-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{page.title}</h1>
          {page.subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{page.subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-200"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark
            ? <Sun size={18} className="text-amber-400" />
            : <Moon size={18} />
          }
        </button>

        {/* Logout Button */}
        <button
          id="navbar-logout-btn"
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-all duration-200"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
