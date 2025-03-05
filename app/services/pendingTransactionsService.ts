// src/services/transactionService.ts
import { fetchData } from "../../api/api";

export const fetchPendingTransactions = async (
  creditAccountId: string,
  token: string
) => {
  try {
    const url = `https://dev.ivitafi.com/api/creditaccount/${creditAccountId}/pending-transactions`;
    const transactions = await fetchData(url, token, (data) => data, "Failed to fetch transactions.");
    return transactions || []; // Ensure it always returns an array
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    return [];
  }
};
