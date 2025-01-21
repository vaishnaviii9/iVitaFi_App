import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { fetchData } from "../api/api";
import Loader from "./Loader";

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

const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { firstName, token } = route.params;

  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentAmountDue, setCurrentAmountDue] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [availableCredit, setAvailableCredit] = useState<number | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch user and customer data in parallel
        const [userResponse, customerResponse] = await Promise.all([
          fetchData("https://dev.ivitafi.com/api/User/current-user", token, setUserData, "Failed to fetch user data."),
          fetchData("https://dev.ivitafi.com/api/customer/current/true", token, setCustomerData, "Failed to fetch customer data."),
        ]);

        if (customerResponse && customerResponse.creditAccounts) {
          const accountNumbers = customerResponse.creditAccounts.map((application: CreditApplication) => application.accountNumber);
          setAccountNumbers(accountNumbers);

          // Fetch credit account summaries in parallel
          const creditSummaries = await Promise.all(
            customerResponse.creditAccounts.map((account: any) => {
              if (account.patientEpisodes && account.patientEpisodes.length > 0) {
                const creditAccountId = account.patientEpisodes[0].creditAccountId;
                return fetchData(
                  `https://dev.ivitafi.com/api/CreditAccount/${creditAccountId}/summary`,
                  token,
                  (data) => data,
                  "Failed to fetch credit account summary."
                );
              }
              return null;
            })
          );

          // Update state with the first valid summary data
          const validSummary = creditSummaries.find((summary) => summary !== null);
          if (validSummary) {
            setCurrentAmountDue(validSummary.currentAmountDue);
            setAccountNumber(validSummary.paymentMethod.accountNumber);
            setBalance(validSummary.currentBalance);
            setAvailableCredit(validSummary.availableCredit);
            const date = new Date(validSummary.nextPaymentDate);
            setNextPaymentDate(`${date.getMonth() + 1}/${date.getDate()}`);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchAllData();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

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
        {accountNumbers.length > 0 ? (
          accountNumbers.map((accountNum, index) => (
            <View key={index} style={styles.accountDetails}>
              <View style={styles.accountNumberContainer}>
                <Text style={styles.accountNumberText}>Account Number: {accountNum}</Text>
              </View>
              <View style={styles.paymentContainer}>
                <View>
                  <Text style={styles.paymentLabel}>Next Payment</Text>
                  <Text style={styles.paymentAmount}>${currentAmountDue || " "}</Text>
                </View>
                <View>
                  <Text style={styles.paymentLabel}>Payment Date</Text>
                  <Text style={styles.paymentDate}>{nextPaymentDate || " "}</Text>
                </View>
                <View>
                  <Text style={styles.paymentLabel}>Account</Text>
                  <Text style={styles.paymentDate}>*{accountNumber?.slice(-4) || " "}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noAccountText}>No accounts available</Text>
        )}
      </View>
      {/* the balance and available credit */}
      <View>
        <Text>Balance: {balance || " "}</Text>
      </View>
      <View>
        <Text>Available Credit: {availableCredit || " "}</Text>
      </View>

    {/* additional payment button */}
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
    height: 150,
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  noAccountText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  loaderStyle:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000",
  },
  accountDetails: {
    marginBottom: 15,
  },
  accountNumberContainer: {
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
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
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
