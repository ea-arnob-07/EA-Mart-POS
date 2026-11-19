'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingCart,
  Store,
  UserRound,
} from 'lucide-react';

const demoRoles = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', username: 'admin', email: 'admin@eamart.test', description: 'Full platform access' },
  { role: 'STORE_OWNER', label: 'Store Owner', username: 'owner', email: 'owner@eamart.test', description: 'Store-wide controls' },
  { role: 'STORE_MANAGER', label: 'Store Manager', username: 'manager', email: 'manager@eamart.test', description: 'Daily operations' },
  { role: 'CASHIER', label: 'Cashier', username: 'cashier01', email: 'cashier@eamart.test', description: 'POS and sales' },
  { role: 'INVENTORY_MANAGER', label: 'Inventory Manager', username: 'inventory01', email: 'inventory@eamart.test', description: 'Stock and products' },
  { role: 'PURCHASING_OFFICER', label: 'Purchasing Officer', username: 'purchase01', email: 'purchasing@eamart.test', description: 'Orders and suppliers' },
  { role: 'ACCOUNTANT', label: 'Accountant', username: 'accountant01', email: 'accountant@eamart.test', description: 'Finance and reports' },
  { role: 'WAREHOUSE_STAFF', label: 'Warehouse Staff', username: 'warehouse01', email: 'warehouse@eamart.test', description: 'Warehouse operations' },
  { role: 'AUDITOR', label: 'Auditor', username: 'auditor01', email: 'auditor@eamart.test', description: 'Audit and reporting' },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoRoles, setShowDemoRoles] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleDemoRoleSelect = (email: string) => {
    setError(null);
    setIdentifier(email);
    setPassword('');
    setShowDemoRoles(false);
    passwordInputRef.current?.focus();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid username or password.');
        setLoading(false);
        return;
      }

      router.push('/');
    } catch {
      setError('We could not sign you in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="ea-login-shell">
      <div className="ea-login-glow ea-login-glow-one" />
      <div className="ea-login-glow ea-login-glow-two" />
      <div className="ea-login-frame">
        <section className="ea-login-story">
          <div className="ea-login-brand">
            <span className="ea-login-mark"><ShoppingCart className="h-6 w-6" /></span>
            <span>
              <strong>EA Mart</strong>
              <small>RETAIL MANAGEMENT</small>
            </span>
          </div>

          <div className="ea-login-story-copy">
            <span className="ea-login-kicker"><span /> RETAIL OPERATIONS PLATFORM</span>
            <h1>Run retail smarter with <em>EA Mart.</em></h1>
            <p>One connected workspace for sales, inventory, customers and business performance. Built to keep every store moving.</p>
          </div>

          <div className="ea-login-feature-list">
            <div><CheckCircle2 className="h-4 w-4" /><span>Fast, dependable checkout</span></div>
            <div><CheckCircle2 className="h-4 w-4" /><span>Real-time inventory control</span></div>
            <div><CheckCircle2 className="h-4 w-4" /><span>Clear business intelligence</span></div>
          </div>

          <div className="ea-login-story-bottom">
            <span>EA MART TECHNOLOGIES</span>
            <span>MADE FOR MODERN RETAIL</span>
          </div>
        </section>

        <section className="ea-login-panel">
          <div className="ea-login-panel-top">
            <span><ShieldCheck className="h-4 w-4" /> Protected workspace</span>
            <span className="ea-login-region"><Store className="h-3.5 w-3.5" /> Bangladesh</span>
          </div>

          <div className="ea-login-form-wrap">
            <div className="ea-login-mobile-brand">
              <span className="ea-login-mark"><ShoppingCart className="h-5 w-5" /></span>
              <span><strong>EA Mart</strong><small>RETAIL MANAGEMENT</small></span>
            </div>

            <p className="ea-login-welcome">WELCOME BACK</p>
            <h2>Log in to your account</h2>
            <p className="ea-login-description">Enter your staff credentials to access your store workspace.</p>

            {error && <div className="ea-login-error" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className="ea-login-form">
              <div className="ea-login-field">
                <label htmlFor="identifier">Email or username <span>*</span></label>
                <div className="ea-login-input-wrap">
                  <Mail className="h-4 w-4" />
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Enter your email or username"
                  />
                </div>
              </div>

              <div className="ea-login-field">
                <label htmlFor="password">Password <span>*</span></label>
                <div className="ea-login-input-wrap">
                  <LockKeyhole className="h-4 w-4" />
                  <input
                    id="password"
                    name="password"
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="ea-login-options">
                <span><ShieldCheck className="h-3.5 w-3.5" /> Secure staff access</span>
                <span>Authorized team members only</span>
              </div>

              <button type="submit" disabled={loading} className="ea-login-submit">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : <>Continue <ArrowUpRight className="h-4 w-4" /></>}
              </button>
            </form>

            <div className="ea-login-role-picker mt-4">
              <button
                type="button"
                className="ea-login-role-trigger"
                onClick={() => setShowDemoRoles((value) => !value)}
                aria-expanded={showDemoRoles}
                aria-haspopup="menu"
                disabled={loading}
              >
                <span className="ea-login-role-trigger-icon"><UserRound className="h-4 w-4" /></span>
                <span className="ea-login-role-trigger-copy">
                  <strong>Login as (Roles)</strong>
                  <small>Choose a role to auto-fill email address</small>
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showDemoRoles && (
                <div className="ea-login-role-menu" role="menu" aria-label="Choose a demo role">
                  {demoRoles.map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      className="ea-login-role-option"
                      role="menuitem"
                      onClick={() => handleDemoRoleSelect(item.email)}
                    >
                      <strong>{item.label}</strong>
                      <small>{item.email} · {item.description}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ea-login-panel-footer">
            <span>Powered by <strong>EA Mart Technologies</strong></span>
            <span>Bangladesh retail workspace</span>
            <span className="ea-login-credit">
              Developed by{' '}
              <a href="https://ea-arnob-07.github.io/Arnob-Portfolio/" target="_blank" rel="noopener noreferrer">
                Estiuk Arafat Arnob <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
