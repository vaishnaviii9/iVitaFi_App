import { fetchData } from "../../api/api";

const USER_API_URL = "https://dev.ivitafi.com/api/User/current-user";

export const fetchUserData = async (
  token: string,
  setUserData: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const userResponse = await fetchData(USER_API_URL,token,setUserData,"Failed to fetch user data.")
    return userResponse;
  } catch (error) {
    console.log("Error fetching user data:", error);
    
  }
};
