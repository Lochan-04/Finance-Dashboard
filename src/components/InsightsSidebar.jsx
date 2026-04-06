import { PiggyBank, Sparkles, TrendingDown } from 'lucide-react';
import { useFinanceStore } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import styles from './InsightsSidebar.module.css';

function InsightsSidebar() {
  const { insights, overview } = useFinanceStore();

  return (
    <aside className={styles.sidebar}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <Sparkles size={18} />
          <h3>Insights</h3>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <TrendingDown size={18} />
          </div>
          <div>
            <span className={styles.metricLabel}>Top Spending Category</span>
            <strong className={styles.metricValue}>
              {insights.topSpendingCategory.category}
            </strong>
            <p className={styles.metricMeta}>
              {formatCurrency(insights.topSpendingCategory.amount)} total outflow
            </p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <PiggyBank size={18} />
          </div>
          <div>
            <span className={styles.metricLabel}>Savings Ratio</span>
            <strong className={styles.metricValue}>{insights.savingsRatio.toFixed(1)}%</strong>
            <p className={styles.metricMeta}>Calculated from total income versus total expense.</p>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <h3 className={styles.panelTitle}>Quick Notes</h3>
        <ul className={styles.noteList}>
          <li>Total income tracked: {formatCurrency(overview.totalIncome)}</li>
          <li>Total spend tracked: {formatCurrency(overview.totalExpense)}</li>
          <li>Use the role switcher to preview admin and viewer flows.</li>
        </ul>
      </section>
    </aside>
  );
}

export default InsightsSidebar;
