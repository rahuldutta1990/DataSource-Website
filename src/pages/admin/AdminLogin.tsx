import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { DataSourceLogo } from '../../components/DataSourceLogo.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, profile, navigate]);

  const validateField = (field: 'email' | 'password', value: string): string => {
    if (field === 'email') {
      const trimmed = value.trim();
      if (!trimmed) {
        return 'Administrator email is required.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid administrator email address.';
      }
      return '';
    }

    if (field === 'password') {
      if (!value) {
        return 'Password is required.';
      }
      if (value.length < 6) {
        return 'Password must be at least 6 characters long.';
      }
      return '';
    }

    return '';
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === 'email' ? email : password;
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateField('email', val) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField('password', val) }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields touched
    setTouched({ email: true, password: true });

    const emailErr = validateField('email', email);
    const passwordErr = validateField('password', password);

    setErrors({
      email: emailErr,
      password: passwordErr,
    });

    if (emailErr || passwordErr) {
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      await api.login(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      setServerError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1B2B] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-6">
          <DataSourceLogo variant="white-horizontal" className="h-11 w-auto mx-auto" />
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Restricted Access</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-heading">
          CMS Admin Portal
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Sign in with authorized administrator credentials to manage services, content, and inquiries.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Administrator Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="admin@datasource.tech"
                  autoComplete="username"
                  aria-invalid={touched.email && !!errors.email}
                  aria-describedby={touched.email && errors.email ? 'admin-email-error' : undefined}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm focus:outline-none transition-colors ${
                    touched.email && errors.email
                      ? 'border-2 border-rose-500 focus:border-rose-400'
                      : 'border border-slate-700 focus:border-[#38BDF8]'
                  }`}
                />
              </div>
              {touched.email && errors.email && (
                <p id="admin-email-error" className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  aria-invalid={touched.password && !!errors.password}
                  aria-describedby={touched.password && errors.password ? 'admin-password-error' : undefined}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm focus:outline-none transition-colors ${
                    touched.password && errors.password
                      ? 'border-2 border-rose-500 focus:border-rose-400'
                      : 'border border-slate-700 focus:border-[#38BDF8]'
                  }`}
                />
              </div>
              {touched.password && errors.password && (
                <p id="admin-password-error" className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0077FF] hover:bg-[#0062D6] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors active:scale-98"
            >
              {loading ? (
                <span>Verifying Access...</span>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
              ← Return to DataSource Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
