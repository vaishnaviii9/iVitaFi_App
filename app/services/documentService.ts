import axios from "axios";
import apiClient from "../../api/apiClient"; // Adjust the import path as necessary

// Function to fetch documents using a credit account ID and token
export const fetchDocuments = async (creditAccountId: string, token: string) => {
  try {
    const url = apiClient.DOCUMENTS(creditAccountId); // Use the new endpoint
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return null;
  }
};
