import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient";

// Fetch statements list
export const fetchStatements = async (
  token: string,
  creditAccountId: string
) => {
  try {
    if (!creditAccountId) {
      console.warn("Credit Account ID is missing.");
      return [];
    }

    const url = apiClient.STATEMENTS(creditAccountId);
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

// Fetch statement file URL
export const fetchStatementFile = async (
  token: string,
  creditAccountId: string,
  fileName: string
) => {
  try {
    if (!creditAccountId) {
      console.warn("Credit Account ID is missing.");
      return null;
    }

    const url = apiClient.STATEMENT_FILE(creditAccountId, fileName);
    const statementFileUrl = await fetchData(
      url,
      token,
      (data) => data,
      "Failed to fetch statement file."
    );

    return statementFileUrl ? statementFileUrl.replace(/^"|"$/g, "") : null; // Ensure valid URL
  } catch (error) {
    console.error("Error fetching statement file:", error);
    return null;
  }
};
