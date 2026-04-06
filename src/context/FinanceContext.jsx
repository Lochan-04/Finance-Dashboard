import { createContext, useContext, useMemo, useState } from 'react';
import { defaultTransaction, initialTransactions } from '../utils/mockData';
import { getSavingsRatio, getTopSpendingCategory } from '../utils/insights';

const FinanceContext = createContext(null);

const buildOverview = (transactions) => {
  const sortedTransactions = [...transactions].sort(
    (left, right) => new Date(left.date) - new Date(right.date),
  );

  const totals = sortedTransactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === 'income') {
        accumulator.totalIncome += transaction.amount;
      } else {
        accumulator.totalExpense += transaction.amount;
      }

      accumulator.totalBalance =
        accumulator.totalIncome - accumulator.totalExpense;

      const monthKey = transaction.date.slice(0, 7);

      if (!accumulator.monthlyMap[monthKey]) {
        accumulator.monthlyMap[monthKey] = {
          month: new Intl.DateTimeFormat('en-US', {
            month: 'short',
          }).format(new Date(transaction.date)),
          income: 0,
          expense: 0,
          balance: 0,
        };
      }

      accumulator.monthlyMap[monthKey][transaction.type] += transaction.amount;
      accumulator.monthlyMap[monthKey].balance =
        accumulator.monthlyMap[monthKey].income -
        accumulator.monthlyMap[monthKey].expense;

      return accumulator;
    },
    {
      totalIncome: 0,
      totalExpense: 0,
      totalBalance: 0,
      monthlyMap: {},
    },
  );

  const monthlyTrend = Object.values(totals.monthlyMap);
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const currentMonth =
    totals.monthlyMap[currentMonthKey] ||
    monthlyTrend[monthlyTrend.length - 1] || {
      income: 0,
      expense: 0,
      balance: 0,
    };

  const expenseByCategory = sortedTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((accumulator, transaction) => {
      accumulator[transaction.category] =
        (accumulator[transaction.category] || 0) + transaction.amount;
      return accumulator;
    }, {});

  return {
    totalBalance: totals.totalBalance,
    totalIncome: totals.totalIncome,
    totalExpense: totals.totalExpense,
    monthlyIncome: currentMonth.income,
    monthlyExpense: currentMonth.expense,
    monthlyTrend,
    expenseBreakdown: Object.entries(expenseByCategory).map(([name, value]) => ({
      name,
      value,
    })),
  };
};

const demoUser = {
  name: 'Jaylon Baptista',
  email: 'jaylon@techcorp.com',
};

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [currentRole, setCurrentRole] = useState('admin');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
  });
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === demoUser.email && password === 'finance2026') {
      setUser(demoUser);
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      message: 'Use jaylon@techcorp.com with password finance2026.',
    };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const addTransaction = (transaction) => {
    setTransactions((currentTransactions) => [
      {
        ...transaction,
        id: crypto.randomUUID(),
        amount: Number(transaction.amount),
      },
      ...currentTransactions,
    ]);
  };

  const deleteTransaction = (transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    );
  };

  const updateFilters = (nextFilters) => {
    setFilters((currentFilters) => ({ ...currentFilters, ...nextFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
    });
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const categories = useMemo(() => {
    const allCategories = transactions.map((transaction) => transaction.category);
    return Array.from(new Set(allCategories)).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = transaction.label
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesCategory =
        filters.category === 'all' || transaction.category === filters.category;

      return matchesSearch && matchesCategory;
    });
  }, [filters.category, filters.search, transactions]);

  const overview = useMemo(() => buildOverview(transactions), [transactions]);
  const insights = useMemo(
    () => ({
      topSpendingCategory: getTopSpendingCategory(transactions),
      savingsRatio: getSavingsRatio(transactions),
    }),
    [transactions],
  );

  const value = {
    transactions,
    filteredTransactions,
    currentRole,
    filters,
    theme,
    isAuthenticated,
    user,
    categories,
    overview,
    insights,
    defaultTransaction,
    setCurrentRole,
    addTransaction,
    deleteTransaction,
    updateFilters,
    resetFilters,
    toggleTheme,
    login,
    logout,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export const useFinanceStore = () => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinanceStore must be used within FinanceProvider');
  }

  return context;
};
