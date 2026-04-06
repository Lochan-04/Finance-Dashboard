import { Search, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../context/FinanceContext';
import { formatCurrency, formatDisplayDate } from '../utils/finance';
import styles from './TransactionTable.module.css';

function TransactionTable() {
  const {
    categories,
    currentRole,
    deleteTransaction,
    filteredTransactions,
    filters,
    updateFilters,
    resetFilters,
  } = useFinanceStore();

  const isEmpty = filteredTransactions.length === 0;

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3>Transactions</h3>
          <p>Search by label and filter by category.</p>
        </div>

        <div className={styles.filters}>
          <label className={styles.searchField}>
            <Search size={16} />
            <input
              type="search"
              placeholder="Search label"
              value={filters.search}
              onChange={(event) => updateFilters({ search: event.target.value })}
            />
          </label>

          <select
            value={filters.category}
            onChange={(event) => updateFilters({ category: event.target.value })}
            className={styles.select}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button type="button" className={styles.resetButton} onClick={resetFilters}>
            Clear
          </button>
        </div>
      </div>

      {isEmpty ? (
        <div className={styles.emptyState}>
          No transactions match the current search or category filter.
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Label</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                {currentRole === 'admin' ? <th>Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDisplayDate(transaction.date)}</td>
                  <td>{transaction.label}</td>
                  <td>{transaction.category}</td>
                  <td
                    className={
                      transaction.type === 'income' ? styles.incomeValue : styles.expenseValue
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <span className={styles.typeBadge}>{transaction.type}</span>
                  </td>
                  {currentRole === 'admin' ? (
                    <td>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => deleteTransaction(transaction.id)}
                        aria-label={`Delete ${transaction.label}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TransactionTable;
