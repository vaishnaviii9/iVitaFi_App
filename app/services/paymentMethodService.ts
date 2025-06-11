import { deleteData } from "../../api/api";
import apiClient from "../../api/apiClient";

// Function to delete a payment method
export const deletePaymentMethod = async (
  token: string,
  methodId: string  // Pass the method ID as a parameter
) => {
  try {
    if (!methodId) {
      console.warn("Payment Method ID is missing.");
      return false;
    }

    const url = apiClient.DELETE_PAYMENT_METHOD(methodId);  // Use the passed method ID
    const success = await deleteData(
      url,
      token,
      "Failed to delete payment method."
    );

    return success;
  } catch (error) {
    return false;
  }
};

