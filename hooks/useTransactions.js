import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPendingTransactions } from '../app/services/pendingTransactionsService';

const useTransactions = () => {
  const token = useSelector((state) => state.auth.token);
  const creditAccountId = useSelector((state) => state.creditAccount.creditAccountId);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
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
    };

    fetchTransactions();
  }, [token, creditAccountId]);

  return { transactions, loading };
};

export default useTransactions;