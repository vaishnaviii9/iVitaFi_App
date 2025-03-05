import { fetchData } from "../../api/api";

const CUSTOMER_API_URL = "https://dev.ivitafi.com/api/customer/current/true";

export const fetchCustomerData = async(
    token: string,
  setUserData: React.Dispatch<React.SetStateAction<any>>
) =>{
try {
    const customerResponse = await fetchData(CUSTOMER_API_URL,token,setUserData,"Failed to fetch customer data.")
    return customerResponse;
  } catch (error) {
    console.log("Error fetching customer data:", error);
    
  }
}