import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient";

export const fetchSavedPaymentMethods = async (token: string, customerId: string) => {
  try {
    if (!token) {
      console.warn("Token is missing.");
      return null;
    }

    // console.log("Fetching saved payment methods with token:", token);

    const response = await fetchData(
      apiClient.TOP_THREE_SAVED_PAYMENT_METHODS(customerId),
      token,
      (data: any) => data,
      "Failed to fetch saved payment methods."
    );

    // console.log("API response:", response); // Log the API response

    if (response && response.length === 0) {
      console.warn("API returned an empty response.");
    }

    return response;
  } catch (error) {
    return null;
  }
};
