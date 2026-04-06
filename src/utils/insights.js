export const getTopSpendingCategory = (transactions) => {
  const spending = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((accumulator, transaction) => {
      accumulator[transaction.category] =
        (accumulator[transaction.category] || 0) + transaction.amount;
      return accumulator;
    }, {});

  const [category = 'No expenses', amount = 0] =
    Object.entries(spending).sort((left, right) => right[1] - left[1])[0] || [];

  return { category, amount };
};

export const getSavingsRatio = (transactions) => {
  const totals = transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === 'income') {
        accumulator.income += transaction.amount;
      } else {
        accumulator.expense += transaction.amount;
      }

      return accumulator;
    },
    { income: 0, expense: 0 },
  );

  if (totals.income === 0) {
    return 0;
  }

  return ((totals.income - totals.expense) / totals.income) * 100;
};
