import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { fetchPendingTransactions } from '../app/services/pendingTransactionsService';

const useTransactions = () => {
  const token = useSelector((state) => state.auth.token);
  const creditAccountId = useSelector((state) => state.creditAccount.creditAccountId);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!creditAccountId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetchPendingTransactions(token, creditAccountId);
      setTransactions(response || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [token, creditAccountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, fetchTransactions };
};

export default useTransactions;
