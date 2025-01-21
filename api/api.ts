import axios from "axios";
import { Alert } from "react-native";

export const fetchData = async (url: string, token: string, setData: React.Dispatch<React.SetStateAction<any>>, errorMessage: string) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data) {
      setData(response.data);
      return response.data; // Return the response data
    } else {
      console.warn("Empty response data");
      return null;
    }
  } catch (error) {
    console.error(errorMessage, error);
    Alert.alert("Error", errorMessage);
    return null;
  }
};
