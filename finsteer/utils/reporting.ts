import { formatCurrency, formatDate } from './formatting';
import { Account, Transaction } from '@prisma/client';

interface ReportData {
  accounts: Account[];
  transactions: Transaction[];
}

export const generateAccountBalanceReport = (reportData: ReportData) => {
  const { accounts, transactions } = reportData;

  const accountBalances = accounts.map((account) => {
    const accountTransactions = transactions.filter(
      (t) => t.accountId === account.id
    );
    const balance = accountTransactions.reduce(
      (total, t) => (t.type === 'credit' ? total + t.amount : total - t.amount),
      0
    );

    return {
      id: account.id,
      name: account.name,
      balance: formatCurrency(balance),
    };
  });

  return accountBalances;
};

export const generateTransactionReport = (
  reportData: ReportData,
  startDate: Date,
  endDate: Date
) => {
  const { transactions } = reportData;

  const filteredTransactions = transactions.filter(
    (t) =>
      t.date >= startDate &&
      t.date <= endDate &&
      (t.description.toLowerCase().includes('payroll') ||
        t.description.toLowerCase().includes('salary'))
  );

  const transactionReport = filteredTransactions.map((t) => ({
    id: t.id,
    date: formatDate(t.date),
    description: t.description,
    amount: formatCurrency(t.amount),
    type: t.type,
    accountName: t.account.name,
  }));

  return transactionReport;
};

export const generateCategoryReport = (
  reportData: ReportData,
  startDate: Date,
  endDate: Date
) => {
  const { transactions } = reportData;

  const filteredTransactions = transactions.filter(
    (t) => t.date >= startDate && t.date <= endDate
  );

  const categoryTotals: { [category: string]: number } = {};

  filteredTransactions.forEach((t) => {
    const category = t.category || 'Uncategorized';
    const amount = t.type === 'credit' ? t.amount : -t.amount;

    if (categoryTotals[category]) {
      categoryTotals[category] += amount;
    } else {
      categoryTotals[category] = amount;
    }
  });

  const categoryReport = Object.entries(categoryTotals).map(
    ([category, total]) => ({
      category,
      total: formatCurrency(total),
    })
  );

  return categoryReport;
};