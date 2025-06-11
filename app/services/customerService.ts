import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient"; // Import API endpoints
import { ErrorCode } from "../../utils/ErrorCodeUtil";

export const fetchCustomerData = async (
  token: string,
  setUserData: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const customerResponse = await fetchData(
      apiClient.CUSTOMER_CURRENT, // Use API object
      token,
      setUserData,
      "Failed to fetch customer data."
    );
    return customerResponse;
  } catch (error) {
    
    return { type: "error", error: { errorCode: ErrorCode.Unknown } };
  }
};
