import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import axios from "axios";


type RootStackParamList = {
  Home: {
    firstName: string;
    lastName: string;
    token: string;
  };
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

interface CreditApplication {
  accountNumber: string;
}

interface CreditApplication {
  accountNumber: string;
}

const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { firstName, lastName, token } = route.params;

  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState<boolean>(true);
>>>>>>> master

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          "https://dev.ivitafi.com/api/User/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      }
    };

    const fetchCustomerData = async () => {
      try {
<<<<<<< HEAD
        const customerResponse = await axios.get('https://dev.ivitafi.com/api/customer/current/true', {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
        });
        const customerResponseData = customerResponse.data;
        setCustomerData(customerResponseData);
        // console.log(customerResponseData);

        if (customerResponseData.creditAccounts) {
          const accountNumbers = customerResponseData.creditAccounts.map((application: CreditApplication) => application.accountNumber);
          setAccountNumbers(accountNumbers);
          // console.log(accountNumbers);
          
=======
        const customerResponse = await axios.get(
          "https://dev.ivitafi.com/api/customer/current/true",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const customerResponseData = customerResponse.data;
        setCustomerData(customerResponseData);

        if (customerResponseData.creditAccounts) {
          const accountNumbers = customerResponseData.creditAccounts.map(
            (application: CreditApplication) => application.accountNumber
          );
          setAccountNumbers(accountNumbers);
>>>>>>> master
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        Alert.alert("Error", "Failed to fetch customer data.");
      } finally {
        setLoading(false); // Stop loading after fetching is done
      }
    };

    fetchUserData();
    fetchCustomerData();
  }, [token]);

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      {/* Avatar Container */}
      <View style={styles.avatarContainer}>
        <Avatar
          size="medium"          
          rounded
          title={`${firstName[0]}${lastName[0]}`} // Initials as avatar title
          containerStyle={styles.avatar}
          titleStyle={{ color: 'white' }}
        />
        <Text style={styles.nameText}>
          Welcome, {firstName} {lastName}
        </Text>
      </View>

      {/* Box Container */}
      <View style={styles.boxContainer}>
     
        {accountNumbers.map((accountNumber, index) => (
          <Text key={index} style={styles.accountNumberText}>Account Number: {accountNumber}</Text>
        ))}
      </View>

      {/* Button Container */}
=======
      <View style={styles.headerContainer}>
        <View style={styles.iconAndTextContainer}>
          <Image source={require("@/assets/images/profile.png")} style={styles.avatarIcon} />
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{firstName}</Text>
            <Text style={styles.welcomeText}>Welcome to IvitaFi</Text>
          </View>
        </View>
        <Image source={require("@/assets/images/menus.png")} style={styles.hamburgerIcon} />
      </View>

      <View style={styles.boxContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text> // Show loading text
        ) : (
          accountNumbers.length > 0 && accountNumbers.map((accountNumber, index) => (
            <View key={index} style={styles.accountDetails}>
              <View style={styles.accountNumberContainer}>
                <Text style={styles.accountNumberText}>Account Number: {accountNumber}</Text>
              </View>

              <View style={styles.paymentContainer}>
                <View>
                  <Text style={styles.paymentLabel}>Next Payment</Text>
                  <Text style={styles.paymentAmount}>$20.00</Text>
                </View>

                <View>
                  <Text style={styles.paymentLabel}>Payment Date</Text>
                  <Text style={styles.paymentDate}>01/21</Text>
                </View>

                <View>
                  <Text style={styles.paymentLabel}>Account</Text>
                  <Text style={styles.paymentDate}>*0016</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

>>>>>>> master
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.additionalPaymentText}>Make Additional Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
<<<<<<< HEAD
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop:30, // Add spacing below avatar
    paddingHorizontal: 20, // Horizontal padding for better alignment
  },
  avatar: {
    backgroundColor: '#517fa4', // Background color for the avatar
    marginRight: 10, // Space between avatar and text
  },
  nameText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },  
  accountNumberText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  boxContainer: {
    width: 377,
    height: 153,
    backgroundColor: '#2D4768',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
=======
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 25,
  },
  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  hamburgerIcon: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
  infoContainer: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
  },
  welcomeText: {
    fontSize: 16,
    color: "#757575",
  },
  boxContainer: {
    width: "90%",
    backgroundColor: "#2D4768",
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
  },
  accountDetails: {
    marginBottom: 15,
  },
  accountNumberContainer: {
    display: "flex",
    alignContent: "flex-start",
  },
  accountNumberText: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },

  paymentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: 25,
  },

  paymentLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  paymentAmount: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5,
  },
  paymentDate: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
>>>>>>> master
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2D4768",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  additionalPaymentText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  
});

export default HomeScreen;