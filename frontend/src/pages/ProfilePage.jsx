import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Shield, Eye, EyeOff, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { getInitials, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

/**
 * Profile page — view profile, update name/email, and change password.
 */
export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: '', email: '', createdAt: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passErrors, setPassErrors] = useState({});
  const [passLoading, setPassLoading] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const [profileErrors, setProfileErrors] = useState({});

  // Clear all data state
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearInput, setClearInput] = useState('');
  const [clearLoading, setClearLoading] = useState(false);

  const handleClearAllData = async () => {
    if (clearInput !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    setClearLoading(true);
    try {
      await transactionService.deleteAll();
      toast.success('All transactions deleted successfully! Fresh start 🚀');
      setShowClearConfirm(false);
      setClearInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear data');
    } finally {
      setClearLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch {
        toast.error('Failed to load profile');
      }
    };
    loadProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profile.name || profile.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errs.email = 'Valid email required';
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setProfileLoading(true);
    try {
      const updated = await userService.updateProfile({ name: profile.name, email: profile.email });
      setProfile(updated);
      updateUser({ name: updated.name, email: updated.email });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passForm.currentPassword) errs.currentPassword = 'Current password required';
    if (!passForm.newPassword || passForm.newPassword.length < 6) errs.newPassword = 'At least 6 characters';
    if (passForm.newPassword !== passForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setPassErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPassLoading(true);
    try {
      await userService.changePassword(passForm);
      toast.success('Password changed successfully 🔐');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  const togglePass = (field) => setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Card */}
      <div className="card text-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary-500 to-violet-600" />

        {/* Avatar */}
        <div className="relative pt-10 pb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-primary-500/30">
            {getInitials(user?.name)}
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
        {profile.createdAt && (
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
            <Calendar size={11} /> Member since {formatDate(profile.createdAt, 'MMMM yyyy')}
          </p>
        )}
      </div>

      {/* Update Profile */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <User size={18} className="text-primary-500" /> Profile Information
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            id="profile-name"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            error={profileErrors.name}
            icon={User}
          />
          <Input
            label="Email Address"
            id="profile-email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            error={profileErrors.email}
            icon={Mail}
          />
          <Button type="submit" variant="primary" loading={profileLoading} id="update-profile-btn">
            Save Changes
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <Shield size={18} className="text-primary-500" /> Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
          {[
            { key: 'currentPassword', label: 'Current Password', id: 'current-password' },
            { key: 'newPassword', label: 'New Password', id: 'new-password' },
            { key: 'confirmPassword', label: 'Confirm New Password', id: 'confirm-password' },
          ].map(({ key, label, id }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id={id}
                  type={showPass[key.replace('Password', '').toLowerCase() || 'current'] ? 'text' : 'password'}
                  value={passForm[key]}
                  onChange={(e) => {
                    setPassForm((p) => ({ ...p, [key]: e.target.value }));
                    setPassErrors((p) => ({ ...p, [key]: null }));
                  }}
                  className={`input-base pl-9 pr-10 ${passErrors[key] ? 'border-red-400' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => {
                    const fieldKey = key === 'currentPassword' ? 'current' : key === 'newPassword' ? 'new' : 'confirm';
                    togglePass(fieldKey);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label="Toggle password visibility"
                >
                  {showPass[key === 'currentPassword' ? 'current' : key === 'newPassword' ? 'new' : 'confirm']
                    ? <EyeOff size={16} />
                    : <Eye size={16} />
                  }
                </button>
              </div>
              {passErrors[key] && <p className="text-xs text-red-500">{passErrors[key]}</p>}
            </div>
          ))}
          <Button type="submit" variant="primary" loading={passLoading} id="change-password-btn">
            Change Password
          </Button>
        </form>
      </div>

      {/* Danger Zone Card */}
      <div className="card border-orange-200 dark:border-orange-900/40 bg-orange-50/30 dark:bg-orange-950/10">
        <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-2">
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Permanently delete all your income and expense records. Your account will remain active.
        </p>

        {!showClearConfirm ? (
          <Button
            id="clear-all-data-btn"
            variant="danger"
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 size={16} /> Clear All Transactions
          </Button>
        ) : (
          <div className="space-y-3 border border-red-300 dark:border-red-700 rounded-xl p-4 bg-red-50/50 dark:bg-red-950/20">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              ⚠️ This will permanently delete <strong>ALL</strong> your transactions. This cannot be undone!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type <strong className="text-red-500">DELETE</strong> below to confirm:
            </p>
            <input
              id="clear-confirm-input"
              type="text"
              value={clearInput}
              onChange={(e) => setClearInput(e.target.value)}
              placeholder="Type DELETE here"
              className="input-base w-full"
              autoComplete="off"
            />
            <div className="flex gap-2">
              <Button
                id="confirm-clear-btn"
                variant="danger"
                loading={clearLoading}
                onClick={handleClearAllData}
                disabled={clearInput !== 'DELETE'}
              >
                <Trash2 size={16} /> Yes, Delete Everything
              </Button>
              <Button
                id="cancel-clear-btn"
                variant="secondary"
                onClick={() => { setShowClearConfirm(false); setClearInput(''); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Card */}
      <div className="card flex items-center justify-between border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Sign Out</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Log out of your account on this device</p>
        </div>
        <Button
          variant="danger"
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        >
          <LogOut size={16} /> Sign Out
        </Button>
      </div>
    </div>
  );
}
