import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient";

export const fetchStatements = async (
  token: string,
  creditAccountId: string  // ✅ Pass ID as a parameter
) => {
  try {
    if (!creditAccountId) {
      console.warn("Credit Account ID is missing.");
      return [];
    }

    const url = apiClient.STATEMENTS(creditAccountId);  // Use passed ID
    const statements = await fetchData(
      url,
      token,
      (data) => data, 
      "Failed to fetch statements."
    );

    return statements || [];
  } catch (error) {
    console.error("Error fetching statements:", error);
    return [];
  }
};
