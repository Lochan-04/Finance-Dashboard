import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useFinanceStore } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import styles from './DashboardCharts.module.css';

const chartColors = ['#0ea5e9', '#22c55e', '#f97316', '#facc15', '#8b5cf6'];

function TooltipContent({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      <strong>{label || payload[0].name}</strong>
      {payload.map((entry) => (
        <div key={entry.name} className={styles.tooltipRow}>
          <span>{entry.name}</span>
          <span>{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyChartState({ message }) {
  return <div className={styles.emptyState}>{message}</div>;
}

function DashboardCharts() {
  const { overview } = useFinanceStore();
  const totalExpense = overview.expenseBreakdown.reduce(
    (accumulator, entry) => accumulator + entry.value,
    0,
  );

  return (
    <section className={styles.grid}>
      <article className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <h3>Balance Trend</h3>
          <span>Income, expense, and closing balance by month</span>
        </div>
        <div className={styles.chartArea}>
          {overview.monthlyTrend.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.monthlyTrend}>
                <defs>
                  <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                  tickLine={false}
                  axisLine={false}
                  width={46}
                />
                <Tooltip content={<TooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={0}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={0}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fill="url(#balanceFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No balance trend yet. Add a transaction to see the chart populate." />
          )}
        </div>
      </article>

      <article className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <h3>Expense Categories</h3>
          <span>Distribution of total spend with category share</span>
        </div>
        <div className={styles.pieLayout}>
          {overview.expenseBreakdown.length ? (
            <>
              <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overview.expenseBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={64}
                      outerRadius={96}
                      paddingAngle={3}
                    >
                      {overview.expenseBreakdown.map((entry, index) => (
                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<TooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.legendList}>
                {overview.expenseBreakdown.map((entry, index) => {
                  const percentage = totalExpense ? (entry.value / totalExpense) * 100 : 0;

                  return (
                    <div key={entry.name} className={styles.legendItem}>
                      <div className={styles.legendLabel}>
                        <span
                          className={styles.legendSwatch}
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        />
                        <span>{entry.name}</span>
                      </div>
                      <div className={styles.legendMeta}>
                        <strong>{formatCurrency(entry.value)}</strong>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyChartState message="Expense categories will appear here once expense transactions are available." />
          )}
        </div>
      </article>
    </section>
  );
}

export default DashboardCharts;
