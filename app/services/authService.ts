import axios from "axios";
import apiClient from "../../api/apiClient";  // Import API endpoints
import { ErrorCode } from "../../utils/ErrorCodeUtil";

export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(apiClient.AUTHENTICATE_USER, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
     
      return { type: "error", error: { errorCode: ErrorCode.Unknown } };
    }
};
