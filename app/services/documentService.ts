import axios from "axios";
import apiClient from "../../api/apiClient"; // Adjust the import path as necessary
import { fetchData } from "../../api/api";
// Function to fetch documents using a credit account ID and token
export const fetchDocuments = async (creditAccountId: string, token: string) => {
  try {
    const url = apiClient.DOCUMENTS(creditAccountId);
    const response = await fetchData(url, token, (data) => data, "Failed to fetch documents.");
    if (!response) {
      console.log("No data received from the API");
      return null;
    }
    // console.log("API Response:", response); // Log the full response
    return response;
  } catch (error) {
    console.log("Error fetching documents:", error);
    return null;
  }
};
