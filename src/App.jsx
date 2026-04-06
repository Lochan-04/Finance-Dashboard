import { useEffect } from 'react';
import { WalletCards } from 'lucide-react';
import AddTransactionForm from './components/AddTransactionForm';
import DashboardCharts from './components/DashboardCharts';
import Header from './components/Header';
import InsightsSidebar from './components/InsightsSidebar';
import LoginScreen from './components/LoginScreen';
import SummaryCards from './components/SummaryCards';
import TransactionTable from './components/TransactionTable';
import { useFinanceStore } from './context/FinanceContext';
import styles from './styles/App.module.css';

function App() {
  const { currentRole, isAuthenticated, theme, user } = useFinanceStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className={styles.appShell}>
      <Header />
      <main className={styles.dashboardLayout}>
        <section className={styles.primaryColumn}>
          <div className={styles.heroCard}>
            <div>
              <span className={styles.eyebrow}>2026 Finance Command Center</span>
              <h1 className={styles.heroTitle}>Good morning, {user?.name?.split(' ')[0] ?? 'Jaylon'}</h1>
              <p className={styles.heroCopy}>
                Review balance movement, compare monthly inflow versus outflow, and manage
                transactions with a layout that stays readable across mobile and desktop.
              </p>
            </div>
            <div className={styles.heroIconWrap}>
              <WalletCards size={30} />
            </div>
          </div>

          <SummaryCards />
          <DashboardCharts />

          {currentRole === 'admin' ? (
            <AddTransactionForm />
          ) : (
            <div className={styles.viewerNotice}>
              Viewer mode is active. Add, edit, and delete actions stay hidden to keep the
              dashboard read-only.
            </div>
          )}

          <TransactionTable />
        </section>

        <InsightsSidebar />
      </main>
    </div>
  );
}

export default App;
