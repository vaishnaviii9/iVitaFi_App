import axios from "axios";
import apiClient from "../../api/apiClient";  // Import API endpoints

export const resetPasswordService = async (email: string) => {
  try {
    await axios.get(apiClient.RESET_PASSWORD, {
      params: { email },
    });
  } catch (error) {
    throw error;
  }
};
