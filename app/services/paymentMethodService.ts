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
    console.error("Error deleting payment method:", error);
    return false;
  }
};

// Placeholder for future function to add a payment method
export const addPaymentMethod = async (
  token: string,
  paymentMethodDetails: any  // Pass the payment method details as a parameter
) => {
  try {
    // Implementation for adding a payment method will be added here
    console.log("Adding a payment method:", paymentMethodDetails);
    return true;
  } catch (error) {
    console.error("Error adding payment method:", error);
    return false;
  }
};
