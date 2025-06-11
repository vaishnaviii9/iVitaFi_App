import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient";

export const fetchPostedTransactions = async (
  token: string,
  creditAccountId: string
) => {
  if (!creditAccountId) {
    console.warn("Credit Account ID is missing.");
    return [];
  }

  try {
    const url = apiClient.POSTED_TRANSACTIONS(creditAccountId);
    const transactions = await fetchData(url, token, (data) => data, "Failed to fetch posted transactions.");
    return transactions || [];
  } catch (error) {
    return [];
  }
};
