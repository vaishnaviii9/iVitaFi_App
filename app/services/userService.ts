import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient";
import { ErrorCode } from "../../utils/ErrorCodeUtil";

export const fetchUserData = async (
  token: string,
  setUserData: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const userResponse = await fetchData(apiClient.CURRENT_USER,token,setUserData,"Failed to fetch user data.")
    return userResponse;
  } catch (error) {
    console.log("Error fetching user data:", error);
    
  }
};

// userService.js

export const updateCustomer = async (customerId: any, customerData: any,token: any) => {
  try {
    const response = await fetch(`https://dev.ivitafi.com/api/customer/${customerId}`, {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...customerData,
       customerId
      }),
    });

    const contentType = response.headers.get("content-type");
    
           if (!response.ok) {
          const errorData = contentType?.includes("application/json")
            ? await response.json()
            : { errorMessage: await response.text() };
    
          return { type: "error", response: errorData };
        }
    
        const data = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
    
        return { type: "data", data };
      } catch (error) {
        console.error("Error Error updating debit card information: payment method:", error);
        return { type: "error", error: { errorCode: ErrorCode.Unknown } };
      }
};

