import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Mail, Lock, Wallet, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Login page with email/password form, forgot password modal, and link to registration.
 */
export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotForm, setForgotForm] = useState({ email: '', newPassword: '' });
  const [forgotErrors, setForgotErrors] = useState({});
  const [forgotLoading, setForgotLoading] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await login(form);
    if (res) {
      if (res.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!forgotForm.email) errs.email = 'Email is required';
    if (!forgotForm.newPassword || forgotForm.newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters';
    }
    setForgotErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setForgotLoading(true);
    try {
      await authService.forgotPassword(forgotForm);
      toast.success('Password reset successfully! You can now log in.');
      setShowForgotModal(false);
      setForm((prev) => ({ ...prev, email: forgotForm.email }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
        <div className="absolute top-1/2 right-12 w-24 h-24 bg-white/10 rounded-full" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">ExpenseTracker</span>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Take control of<br />your finances
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Track income, manage expenses, and gain insights into your spending habits with beautiful charts and reports.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {[
              '📊 Beautiful analytics dashboard',
              '📥 Track income & expenses',
              '📄 Export PDF reports',
              '🌙 Dark & light mode',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">
          © {new Date().getFullYear()} Expense Tracker. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Wallet size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">ExpenseTracker</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email"
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
              icon={Mail}
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotForm({ email: form.email || '', newPassword: '' });
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  autoComplete="current-password"
                  className={`input-base pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              id="login-submit-btn"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        size="sm"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your account email and your new password to reset it.
          </p>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={forgotForm.email}
            onChange={(e) => setForgotForm((prev) => ({ ...prev, email: e.target.value }))}
            error={forgotErrors.email}
            icon={Mail}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={forgotForm.newPassword}
            onChange={(e) => setForgotForm((prev) => ({ ...prev, newPassword: e.target.value }))}
            error={forgotErrors.newPassword}
            icon={KeyRound}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForgotModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={forgotLoading}
              className="flex-1"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
