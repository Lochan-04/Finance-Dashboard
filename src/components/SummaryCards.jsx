import { ArrowDownCircle, ArrowUpCircle, Landmark } from 'lucide-react';
import { useFinanceStore } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import styles from './SummaryCards.module.css';

const cardConfig = [
  {
    key: 'totalBalance',
    label: 'Total Balance',
    icon: Landmark,
  },
  {
    key: 'monthlyIncome',
    label: 'Monthly Income',
    icon: ArrowUpCircle,
  },
  {
    key: 'totalExpense',
    label: 'Total Spend',
    icon: ArrowDownCircle,
  },
];

function SummaryCards() {
  const { overview } = useFinanceStore();

  return (
    <section className={styles.grid}>
      {cardConfig.map(({ key, label, icon: Icon }) => (
        <article key={key} className={styles.card}>
          <div className={styles.cardHeader}>
            <span>{label}</span>
            <div className={styles.iconWrap}>
              <Icon size={18} />
            </div>
          </div>
          <strong className={styles.value}>{formatCurrency(overview[key])}</strong>
        </article>
      ))}
    </section>
  );
}

export default SummaryCards;
