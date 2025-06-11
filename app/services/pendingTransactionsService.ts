import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient";

export const fetchPendingTransactions = async (
  token: string,
  creditAccountId: string
) => {
  if (!creditAccountId) {
    console.warn("Credit Account ID is missing.");
    return [];
  }

  try {
    // console.log('Fetching pending transactions for credit account ID:', creditAccountId);
    const url = apiClient.PENDING_TRANSACTIONS(creditAccountId);
    const transactions = await fetchData(url, token, (data) => data, "Failed to fetch transactions.");
    // console.log('Fetched pending transactions:', transactions);
    return transactions || [];
  } catch (error) {
    return [];
  }
};

