import { useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, WalletCards } from 'lucide-react';
import { useFinanceStore } from '../context/FinanceContext';
import styles from './LoginScreen.module.css';

function LoginScreen() {
  const { login, theme, toggleTheme } = useFinanceStore();
  const [credentials, setCredentials] = useState({
    email: 'jaylon@techcorp.com',
    password: 'finance2026',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = login(credentials);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage('');
  };

  return (
    <main className={styles.page}>
      <section className={styles.previewPanel}>
        <div className={styles.badge}>Finance OS 2026</div>
        <h1 className={styles.title}>A cleaner finance dashboard with role-aware access.</h1>
        <p className={styles.copy}>
          Review account health, spending concentration, and monthly balance movement
          in one responsive workspace.
        </p>

        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <span>Secure login</span>
            <ShieldCheck size={18} />
          </div>
          <div className={styles.previewMetrics}>
            <article>
              <span>Balance visibility</span>
              <strong>Real monthly trend</strong>
            </article>
            <article>
              <span>Role controls</span>
              <strong>Admin / Viewer</strong>
            </article>
            <article>
              <span>Theme support</span>
              <strong>Dark and light</strong>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.loginPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.iconWrap}>
            <WalletCards size={24} />
          </div>
          <button type="button" onClick={toggleTheme} className={styles.themeButton}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        <div className={styles.formIntro}>
          <h2>Sign in</h2>
          <p>Use the demo credentials below to enter the dashboard.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <div className={styles.inputWrap}>
              <Mail size={16} />
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="jaylon@techcorp.com"
                required
              />
            </div>
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <div className={styles.inputWrap}>
              <LockKeyhole size={16} />
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="finance2026"
                required
              />
            </div>
          </label>

          {errorMessage ? <p className={styles.errorText}>{errorMessage}</p> : null}

          <button type="submit" className={styles.submitButton}>
            Enter Dashboard
          </button>
        </form>

        <div className={styles.helperText}>
          Demo login: <strong>jaylon@techcorp.com</strong> / <strong>finance2026</strong>
        </div>
      </section>
    </main>
  );
}

export default LoginScreen;
