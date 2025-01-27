import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { fetchData } from "../api/api";
import Loader from "./Loader";
import styles from "./HomeStyles"; // Import the styles
import RecentTransactions from "./RecentTransactions";

// Define the types for the route parameters
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

  // Define state variables
  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentAmountDue, setCurrentAmountDue] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [availableCredit, setAvailableCredit] = useState<number | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null);
  const [creditAccountId, setCreditAccountId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch user and customer data in parallel
        const [userResponse, customerResponse] = await Promise.all([
          fetchData(
            "https://dev.ivitafi.com/api/User/current-user",
            token,
            setUserData,
            "Failed to fetch user data."
          ),
          fetchData(
            "https://dev.ivitafi.com/api/customer/current/true",
            token,
            setCustomerData,
            "Failed to fetch customer data."
          ),
        ]);

        if (customerResponse && customerResponse.creditAccounts) {
          const accountNumbers = customerResponse.creditAccounts.map(
            (application: CreditApplication) => application.accountNumber
          );
          setAccountNumbers(accountNumbers);

          // Fetch credit account summaries in parallel
          const creditSummaries = await Promise.all(
            customerResponse.creditAccounts.map((account: any) => {
              if (
                account.patientEpisodes &&
                account.patientEpisodes.length > 0
              ) {
                const creditAccountId =
                  account.patientEpisodes[0].creditAccountId;
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
          const firstAccount = customerResponse.creditAccounts[0];
          if (firstAccount && firstAccount.patientEpisodes.length > 0) {
            setCreditAccountId(firstAccount.patientEpisodes[0].creditAccountId);
          }

          // Update state with the first valid summary data
          const validSummary = creditSummaries.find(
            (summary) => summary !== null
          );
          console.log(validSummary);
          
          if (validSummary) {
            setCurrentAmountDue(validSummary.detail.creditAccount.paymentSchedule.paymentAmount);
            setAccountNumber(validSummary.paymentMethod.accountNumber);
            setBalance(validSummary.currentBalance);
            setAvailableCredit(validSummary.displayAvailableCredit);
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
      {/* Header section */}
      <View style={styles.headerContainer}>
        <View style={styles.iconAndTextContainer}>
          <Image
            source={require("@/assets/images/profile.png")}
            style={styles.avatarIcon}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{firstName}</Text>
            <Text style={styles.welcomeText}>Welcome to IvitaFi</Text>
          </View>
        </View>
        <Image
          source={require("@/assets/images/menus.png")}
          style={styles.hamburgerIcon}
        />
      </View>

      {/* Account details section */}
      <View style={styles.boxContainer}>
  {accountNumbers.length > 0 ? (
    accountNumbers.map((accountNum, index) => (
      <View key={index} style={styles.accountDetails}>
        <View style={styles.accountNumberContainer}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.accountNumberText}>
              Account Number: {accountNum}
            </Text>
            {/* Auto Pay Section */}
          </View>
          <View style={styles.autoPayParent}>
            {/* <Image
                source={require("@/assets/images/autopay.png")} // Replace with the correct autopay icon path
                style={styles.autopayIcon}
              /> */}
              <Image
                source={require("@/assets/images/Cross Circle.png")} // Replace with the correct autopay icon path
                style={styles.autopayIcon}
              />
              <Text style={styles.autoPay}>{`Auto Pay `}</Text>
            </View>
        </View>
        <View style={styles.paymentContainer}>
          <View>
            <Text style={styles.paymentLabel}>Next Payment</Text>
            <Text style={styles.paymentAmount}>
              ${currentAmountDue || " "}
            </Text>
          </View>
          <View>
            <Text style={styles.paymentLabel}>Payment Date</Text>
            <Text style={styles.paymentDate}>
              {nextPaymentDate || " "}
            </Text>
          </View>
          <View>
            <Text style={styles.paymentLabel}>Account</Text>
            <Text style={styles.paymentDate}>
              *{accountNumber?.slice(-4) || " "}
            </Text>
          </View>
        </View>
      </View>
    ))
  ) : (
    <Text style={styles.noAccountText}>No accounts available</Text>
  )}
</View>


      {/* Balance and available credit section */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceRow}>
          <Text style={styles.myBalance}>My Balance</Text>
          <Text style={styles.text}>${balance || " "}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.availableCredit}>Available Credit</Text>
          <Text style={styles.text1}>${availableCredit || " "}</Text>
        </View>
      </View>

      {/* Additional payment button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.additionalPaymentText}>
            Make Additional Payment
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.RecentTransactionsContainer}>
  {creditAccountId ? (
    <RecentTransactions creditAccountId={creditAccountId} token={token} />
  ) : (
    <Text style={styles.noAccountText}>No transactions available</Text>
  )}
</View>

    </View>
  );
};

export default HomeScreen;
