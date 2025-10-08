import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type Currency = 'VND' | 'USD';

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  currency: Currency;
  date: string;
  category: string;
  note: string;
  createdAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  isLoading: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('preferredCurrency');
    return (saved as Currency) || 'VND';
  });

  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency);
  }, [currency]);

  useEffect(() => {
    if (user) {
      const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const userTransactions = allTransactions.filter((t: Transaction) => t.userId === user.id);
      setTransactions(userTransactions);
    } else {
      setTransactions([]);
    }
    setIsLoading(false);
  }, [user]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    allTransactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(allTransactions));
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const index = allTransactions.findIndex((t: Transaction) => t.id === id && t.userId === user.id);

    if (index !== -1) {
      allTransactions[index] = {
        ...allTransactions[index],
        ...transaction,
      };
      localStorage.setItem('transactions', JSON.stringify(allTransactions));
      setTransactions(transactions.map(t => t.id === id ? { ...t, ...transaction } : t));
    }
  };

  const deleteTransaction = (id: string) => {
    if (!user) return;

    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const filtered = allTransactions.filter((t: Transaction) => !(t.id === id && t.userId === user.id));
    localStorage.setItem('transactions', JSON.stringify(filtered));
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction, isLoading, currency, setCurrency }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
