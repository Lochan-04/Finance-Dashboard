import { LogOut, MoonStar, ShieldCheck, SunMedium } from 'lucide-react';
import { useFinanceStore } from '../context/FinanceContext';
import styles from './Header.module.css';

function Header() {
  const { currentRole, logout, setCurrentRole, theme, toggleTheme, user } = useFinanceStore();

  return (
    <header className={styles.header}>
      <div>
        <p className={styles.kicker}>Finance Dashboard</p>
        <h2 className={styles.title}>Screening Assignment Workspace</h2>
        <p className={styles.subtitle}>{user?.email}</p>
      </div>

      <div className={styles.actions}>
        <label className={styles.roleSwitcher}>
          <ShieldCheck size={16} />
          <span>Role</span>
          <select
            value={currentRole}
            onChange={(event) => setCurrentRole(event.target.value)}
            className={styles.select}
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <button type="button" onClick={toggleTheme} className={styles.themeButton}>
          {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button type="button" onClick={logout} className={styles.themeButton}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
