import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import Loader from "../Loader";
import styles from "../../assets/styles/HomeStyles";
import RecentTransactions from "../RecentTransactions";
import { fetchCustomerData } from "../services/customerService";
import { fetchUserData } from "../services/userService";
import { fetchCreditSummaries } from "../services/creditAccountService";

interface CreditApplication {
  accountNumber: string;
}

const HomeScreen: React.FC = () => {
  const { firstName, token } = useSelector((state: any) => state.auth); // Fetch user details from Redux

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
  const [autoPay, setAutopay] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userResponse, customerResponse] = await Promise.all([
          fetchUserData(token, setUserData),
          fetchCustomerData(token, setCustomerData),
        ]);

        if (customerResponse && customerResponse.creditAccounts) {
          const accountNumbers = customerResponse.creditAccounts.map(
            (application: CreditApplication) => application.accountNumber
          );
          setAccountNumbers(accountNumbers);

          const creditSummaries = await fetchCreditSummaries(customerResponse, token);
          const firstAccount = customerResponse.creditAccounts[0];

          if (firstAccount && firstAccount.patientEpisodes.length > 0) {
            setCreditAccountId(firstAccount.patientEpisodes[0].creditAccountId);
          }

          const validSummary = creditSummaries.find((summary) => summary !== null);
          if (validSummary) {
            setCurrentAmountDue(validSummary.detail.creditAccount.paymentSchedule.paymentAmount);
            setAccountNumber(validSummary.paymentMethod.accountNumber);
            setBalance(validSummary.currentBalance);
            setAvailableCredit(validSummary.displayAvailableCredit);
            const date = new Date(validSummary.nextPaymentDate);
            setNextPaymentDate(`${date.getMonth() + 1}/${date.getDate()}`);
            setAutopay(validSummary.detail?.creditAccount?.paymentSchedule?.autoPayEnabled);
          }
        } else {
          console.log("Failed to fetch user or customer data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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
          <Image source={require("@/assets/images/profile.png")} style={styles.avatarIcon} />
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{firstName}</Text>
            <Text style={styles.welcomeText}>Welcome to IvitaFi</Text>
          </View>
        </View>
        <Image source={require("@/assets/images/menus.png")} style={styles.hamburgerIcon} />
      </View>

      {/* Account details section */}
      <View style={styles.boxContainer}>
        {accountNumbers.length > 0 ? (
          accountNumbers.map((accountNum, index) => (
            <View key={index} style={styles.accountDetails}>
              <View style={styles.accountNumberContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={styles.accountNumberText}>Account Number: {accountNum}</Text>
                </View>
                <View style={styles.autoPayParent}>
                  {autoPay ? (
                    <Image source={require("@/assets/images/autopayOn.png")} style={styles.autopayIcon} />
                  ) : (
                    <Image source={require("@/assets/images/autopayOff.png")} style={styles.autopayIcon} />
                  )}
                  <Text style={styles.autoPay}>{`Auto Pay `}</Text>
                </View>
              </View>
              <View style={styles.paymentContainer}>
                <View>
                  <Text style={styles.paymentLabel}>Next Payment</Text>
                  <Text style={styles.paymentAmount}>${currentAmountDue?.toFixed(2) || " "}</Text>
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
          <Text style={styles.additionalPaymentText}>Make Additional Payment</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.RecentTransactionsContainer}>
        {creditAccountId ? (
          <RecentTransactions creditAccountId={creditAccountId} token={token} />
        ) : (
          <Text style={styles.noAccountText}>No transactions available</Text>
        )}
      </View>

      {/* Bottom Navigation */}
      {/* <View style={styles.BottomNavigationContainer}>
        <BottomNavigation activeTab="Home" />
      </View> */}
    </View>
  );
};

export default HomeScreen;
