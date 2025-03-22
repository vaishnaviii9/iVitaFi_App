import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient";

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
