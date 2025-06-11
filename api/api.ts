import axios from "axios";
import { Alert } from "react-native";

// Function to fetch data from a given URL with a token and set the data to a state variable
export const fetchData = async (
  url: string,
  token: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
  errorMessage: string
) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      setData(response.data);
      return response.data;
    } else {
      console.warn("Empty response data");
      return null;
    }
  } catch (error) {
    
    return null;
  }
};

// Function to delete data from a given URL with a token
export const deleteData = async (
  url: string,
  token: string,
  errorMessage: string
) => {
  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return true;
    } else {
      // console.warn("Unsuccessful response status", response.status);
      return false;
    }
  } catch (error) {
 
    return false;
  }
};
