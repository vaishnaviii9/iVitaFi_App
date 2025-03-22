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
    const url = apiClient.PENDING_TRANSACTIONS(creditAccountId);
    const transactions = await fetchData(url, token, (data) => data, "Failed to fetch transactions.");
    return transactions || [];
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    return [];
  }
};
