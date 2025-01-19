import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import axios from "axios";
import { fetchData } from "../api/api"; // Import the fetchData function

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

interface CreditAccount {
  creditAccountId: string;
}

const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { firstName, token } = route.params;

  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentAmountDue, setCurrentAmountDue] = useState<number | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      await fetchData("https://dev.ivitafi.com/api/User/current-user", token, setUserData, "Failed to fetch user data.");
    };

    const fetchCustomerData = async () => {
      await fetchData("https://dev.ivitafi.com/api/customer/current/true", token, setCustomerData, "Failed to fetch customer data.");
    };

    fetchUserData();
    fetchCustomerData();
  }, [token]);

  useEffect(() => {
    if (customerData && customerData.creditAccounts) {
      const accountNumbers = customerData.creditAccounts.map((application: CreditApplication) => application.accountNumber);
      setAccountNumbers(accountNumbers);

      customerData.creditAccounts.forEach((account: any) => {
        if (account.patientEpisodes && account.patientEpisodes.length > 0) {
          const creditAccountId = account.patientEpisodes[0].creditAccountId;
          fetchData(`https://dev.ivitafi.com/api/CreditAccount/${creditAccountId}/summary`, token, (response) => {
            console.log(response); // Log the response
            setCurrentAmountDue(response.currentAmountDue); // Set the current amount due
            setAccountNumber(response.paymentMethod.accountNumber); // Set the account number
            const date = new Date(response.nextPaymentDate);
            setNextPaymentDate(`${date.getMonth() + 1}/${date.getDate()}`); // Set the next payment date in MM/DD format
          }, "Failed to fetch credit account summary.");
        }
      });
      setLoading(false);
    }
  }, [customerData]);

  return (
    <View style={styles.container}>
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
          accountNumbers.length > 0 && accountNumbers.map((accountNum, index) => (
            <View key={index} style={styles.accountDetails}>
              <View style={styles.accountNumberContainer}>
                <Text style={styles.accountNumberText}>Account Number: {accountNum}</Text>
              </View>

              <View style={styles.paymentContainer}>
                <View>
                  <Text style={styles.paymentLabel}>Next Payment</Text>
                  <Text style={styles.paymentAmount}>${currentAmountDue !== null ? currentAmountDue : " "}</Text>
                </View>

                <View>
                  <Text style={styles.paymentLabel}>Payment Date</Text>
                  <Text style={styles.paymentDate}>{nextPaymentDate !== null ? nextPaymentDate : " "}</Text>
                </View>

                <View>
                  <Text style={styles.paymentLabel}>Account</Text>
                  <Text style={styles.paymentDate}>*{accountNumber !== null ? accountNumber.slice(-4) : " "}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

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