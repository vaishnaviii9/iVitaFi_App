import axios from "axios";
import { Alert } from "react-native";

// Function to fetch data from a given URL with a token and set the data to a state variable
// Parameters:
// - url: The API endpoint to fetch data from.
// - token: The authorization token to include in the request headers.
// - setData: A React state setter function to update the state with the fetched data.
// - errorMessage: A custom error message to display in case of a failure.
export const fetchData = async (
  url: string,
  token: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
  errorMessage: string
) => {
  try {
    // Make a GET request to the specified URL with the authorization token in the headers
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Check if the response contains data
    if (response.data) {
      // Update the state with the fetched data
      setData(response.data);
      return response.data; // Return the response data
    } else {
      // Log a warning if the response data is empty
      console.warn("Empty response data");
      return null;
    }
  } catch (error) {
    // Log the error and display an alert with the provided error message
    console.error(errorMessage, error);
    Alert.alert("Error", errorMessage);
    return null;
  }
};
