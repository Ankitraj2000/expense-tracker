import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, Wallet, Eye, EyeOff } from 'lucide-react';

/**
 * Registration page with name, email, password, and confirm-password fields.
 */
export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await register({ name: form.name, email: form.email, password: form.password });
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Branding */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-violet-700 via-primary-700 to-primary-600 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-12" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">ExpenseTracker</span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start your<br />financial journey
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            Join thousands of users who have taken control of their personal finances.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { emoji: '📊', label: 'Charts & Analytics' },
              { emoji: '💰', label: 'Income Tracking' },
              { emoji: '📉', label: 'Expense Control' },
              { emoji: '📄', label: 'PDF Reports' },
            ].map(({ emoji, label }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-white/80 text-xs font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">© {new Date().getFullYear()} Expense Tracker</p>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Wallet size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">ExpenseTracker</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Start managing your finances today — it's free</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              id="register-name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              error={errors.name}
              icon={User}
              autoComplete="name"
            />

            <Input
              label="Email"
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
              icon={Mail}
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  autoComplete="new-password"
                  className={`input-base pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <Input
              label="Confirm Password"
              id="register-confirm-password"
              type="password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={(e) => set('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              icon={Lock}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              id="register-submit-btn"
              className="mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
