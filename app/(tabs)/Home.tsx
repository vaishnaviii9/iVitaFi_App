import React, { useEffect, useState } from "react";
// Import necessary components and libraries
import { View, Text, TouchableOpacity, Image, Pressable, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import styles from "../../components/styles/HomeStyles";
import RecentTransactions from "../../features/transactions/RecentTransactions";
import { fetchCustomerData } from "../services/customerService";
import { fetchUserData } from "../services/userService";
import { fetchCreditSummariesWithId } from "../services/creditAccountService";
import { setCreditAccountId } from "../../features/creditAccount/creditAccountSlice";
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// Define the CreditApplication interface
interface CreditApplication {
  accountNumber: string;
}

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { firstName, lastName, token } = useSelector((state: any) => state.auth); // Fetch user details from Redux
  const creditAccountId = useSelector((state: any) => state.creditAccount.creditAccountId);
  const navigation = useNavigation();

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
  const [creditSummaries, setCreditSummaries] = useState<any[]>([]);
  const [autoPay, setAutopay] = useState<boolean | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch user and customer data in parallel
        const [userResponse, customerResponse] = await Promise.all([
          fetchUserData(token, setUserData),
          fetchCustomerData(token, setCustomerData),
        ]);

        // console.log('CustomerResponse', customerResponse);
        
        // Process customer data if available
        if (customerResponse?.creditAccounts) {
          const accountNumbers = customerResponse.creditAccounts.map(
            (application: CreditApplication) => application.accountNumber
          );
          setAccountNumbers(accountNumbers);

          // Fetch credit summaries and account ID
          const { creditSummaries, creditAccountId } = await fetchCreditSummariesWithId(customerResponse, token);

          if (creditAccountId) {
            dispatch(setCreditAccountId(creditAccountId));
          }

          setCreditSummaries(creditSummaries);

          // Extract and set relevant details from credit summaries
          const validSummary = creditSummaries.find((summary) => summary !== null);
          if (validSummary) {
            setCurrentAmountDue(validSummary.detail.creditAccount.paymentSchedule.paymentAmount);
            setAccountNumber(validSummary.paymentMethod.accountNumber);
            setBalance(validSummary.currentBalance);
            setAvailableCredit(validSummary.displayAvailableCredit);

            const date = new Date(validSummary.nextPaymentDate);
            const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
            setNextPaymentDate(formattedDate);

            const isAutopayEnabled = validSummary.detail?.creditAccount?.paymentSchedule?.autoPayEnabled;
            setAutopay(isAutopayEnabled);
            dispatch(isAutopayEnabled);
          }
        } else {
          console.log("Failed to fetch user or customer data.");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token, dispatch]);

  // Show loader while data is being fetched
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  // Handle hamburger menu press
  const handleHamburgerPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Handle profile icon press
  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerContainer}>
        <Pressable onPress={handleHamburgerPress}>
          <Image
            source={require("../../assets/images/menus.png")}
            style={styles.hamburgerIcon}
          />
        </Pressable>
        <View style={styles.iconAndTextContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{firstName} {lastName}</Text>
            <Text style={styles.welcomeText}>Welcome to IvitaFi</Text>
          </View>
          <Pressable onPress={handleProfilePress}>
            <Image source={require("../../assets/images/profile.png")} style={styles.avatarIcon} />
          </Pressable>
        </View>
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
                    <Image source={require("../../assets/images/autopayOn.png")} style={styles.autopayIcon} />
                  ) : (
                    <Image source={require("../../assets/images/autopayOff.png")} style={styles.autopayIcon} />
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
          <Text style={styles.text}>${balance?.toFixed(2) || " "}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.availableCredit}>Available Credit</Text>
          <Text style={styles.text1}>${availableCredit?.toFixed(2) || " "}</Text>
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
          <RecentTransactions />
        ) : (
          <Text style={styles.noAccountText}>No transactions available</Text>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
