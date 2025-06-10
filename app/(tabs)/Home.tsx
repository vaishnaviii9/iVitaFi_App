import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SkeletonLoader from "../../components/SkeletonLoader";
import RecentTransactions from "../../features/transactions/RecentTransactions";
import { fetchCustomerData } from "../services/customerService";
import { fetchUserData } from "../services/userService";
import { fetchCreditSummariesWithId } from "../services/creditAccountService";
import { setCreditAccountId } from "../../features/creditAccount/creditAccountSlice";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { fetchPendingTransactions } from "../../app/services/pendingTransactionsService";
import { logout } from "../../features/login/loginSlice";
import { CreditApplicationStatus } from "../../utils/CreditApplicationStatusUtil";
import styles from "../../components/styles/HomeStyles";
import {
  setShowMakePayment,
  setShowMakeAdditionalPayment,
} from "../../features/buttonVisibility/buttonVisibilitySlice";

interface CreditApplication {
  accountNumber: string;
  status: CreditApplicationStatus;
}

interface CreditAccountPaymentSetupDto {
  isPaymentMethod: boolean;
  isPaymentSchedule: boolean;
  isAutoPay: boolean;
  isProfile: boolean;
}

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { firstName, lastName, token } = useSelector(
    (state: any) => state.auth
  );
  const creditAccountId = useSelector(
    (state: any) => state.creditAccount.creditAccountId
  );
  const navigation = useNavigation();

  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentAmountDue, setCurrentAmountDue] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [availableCredit, setAvailableCredit] = useState<number | null>(null);
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null);
  const [creditSummaries, setCreditSummaries] = useState<any[]>([]);
  const [autoPay, setAutopay] = useState<boolean | null>(null);
  const [last4Digits, setLast4Digits] = useState<string | null>(null);
  const [isCardNumber, setIsCardNumber] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentSetupData, setPaymentSetupData] =
    useState<CreditAccountPaymentSetupDto | null>(null);

  // State variables for customer standing logic
  const [customerStandingDisplayMessage, setCustomerStandingDisplayMessage] =
    useState<string | null>(null);
  const [noAdditionalPayment, setNoAdditionalPayment] =
    useState<boolean>(false);
  const [setUpAutopay, setSetUpAutopay] = useState<boolean>(false);
  const [enableClick, setEnableClick] = useState<boolean>(false);
  const [enableConfigureAutopayText, setEnableConfigureAutopayText] =
    useState<boolean>(false);
  const [closedAccount, setClosedAccount] = useState<boolean>(false);
  const [bankruptAccount, setBankruptAccount] = useState<boolean>(false);
  const [isActiveClass, setIsActiveClass] = useState<boolean>(false);

  useEffect(() => {
    setUserData(null);
    setCustomerData(null);
    setAccountNumbers([]);
    setCurrentAmountDue(null);
    setBalance(null);
    setAvailableCredit(null);
    setNextPaymentDate(null);
    setCreditSummaries([]);
    setAutopay(null);
    setLast4Digits(null);
    setIsCardNumber(false);
    setTransactions([]);
    setCustomerStandingDisplayMessage(null);
    setNoAdditionalPayment(false);
    setSetUpAutopay(false);
    setEnableClick(false);
    setEnableConfigureAutopayText(false);
    setClosedAccount(false);
    setBankruptAccount(false);
    setIsActiveClass(false);
  }, [token]);

  const fetchPaymentSetupData = useCallback(
    async (creditAccountId: string) => {
      try {
        const response = await fetch(
          `https://dev.ivitafi.com/api/admin/credit-account/${creditAccountId}/accountPaymentSetup`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPaymentSetupData(data);
        }
      } catch (error) {
        console.error("Error fetching payment setup data:", error);
      }
    },
    [token]
  );

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [userResponse, customerResponse] = await Promise.all([
        fetchUserData(token, setUserData),
        fetchCustomerData(token, setCustomerData),
      ]);

      if (customerResponse?.creditAccounts) {
        const accountNumbers = customerResponse.creditAccounts.map(
          (application: CreditApplication) => application.accountNumber
        );
        setAccountNumbers(accountNumbers);

        const { creditSummaries, creditAccountId } =
          await fetchCreditSummariesWithId(customerResponse, token);

        if (creditAccountId) {
          dispatch(setCreditAccountId(creditAccountId));
          await fetchPaymentSetupData(creditAccountId);
        }

        setCreditSummaries(creditSummaries);
        const validSummary = creditSummaries.find(
          (summary) => summary !== null
        );
        if (validSummary) {
          setCurrentAmountDue(validSummary?.totalAmountDue);

          const accountNum = validSummary.paymentMethod?.accountNumber;
          const cardNum = validSummary.paymentMethod?.cardNumber;

          if (accountNum) {
            setLast4Digits(accountNum.slice(-4));
            setIsCardNumber(false);
          } else if (cardNum) {
            setLast4Digits(cardNum.slice(-4));
            setIsCardNumber(true);
          } else {
            setLast4Digits(null);
            setIsCardNumber(false);
          }

          setBalance(validSummary.currentBalance);
          setAvailableCredit(validSummary.displayAvailableCredit);

          const date = new Date(validSummary.nextPaymentDate);
          const formattedDate = `${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}/${String(date.getDate()).padStart(2, "0")}`;
          setNextPaymentDate(formattedDate);

          const isAutopayEnabled =
            validSummary.detail?.creditAccount?.paymentSchedule?.autoPayEnabled;
          setAutopay(isAutopayEnabled);
          dispatch({ type: "SET_AUTOPLAY_ENABLED", payload: isAutopayEnabled });

          determineCustomerStandingPaymentOptions(
            validSummary,
            paymentSetupData
          );
        }
      }

      if (creditAccountId) {
        const transactionsResponse = await fetchPendingTransactions(
          token,
          creditAccountId
        );
        setTransactions(transactionsResponse || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch, creditAccountId]);

  const determineCustomerStandingPaymentOptions = (
    validSummary: any,
    paymentSetupData: CreditAccountPaymentSetupDto | null
  ) => {
    const isAccountClosed =
      validSummary.detail?.creditAccount?.creditApplication?.status ===
      CreditApplicationStatus.AccountClosed;
    const isBankrupt = validSummary.isBankrupt;
    const isAutoPay = paymentSetupData?.isAutoPay;
    const currentAmountDue = validSummary.currentAmountDue;
    const currentBalance = validSummary.currentBalance;
    const daysDelinquent = validSummary.daysDelinquent;
    const totalAmountDue = validSummary.totalAmountDue;

    if (isAccountClosed) {
      setCustomerStandingDisplayMessage("ACCOUNT IS CLOSED");
      setNoAdditionalPayment(true);
      setSetUpAutopay(false);
      setClosedAccount(true);
      setIsActiveClass(true);
    } else if (isBankrupt) {
      setCustomerStandingDisplayMessage("ACCOUNT IN BANKRUPTCY");
      setIsActiveClass(true);
      setEnableClick(true);
      setSetUpAutopay(false);
      setNoAdditionalPayment(true);
      setBankruptAccount(true);
    } else if (isAutoPay === false && !isBankrupt && !isAccountClosed) {
      setEnableConfigureAutopayText(false);
      setSetUpAutopay(true);
      setNoAdditionalPayment(true);
      setEnableClick(true);
    } else if (
      currentAmountDue === 0 &&
      isAutoPay === true &&
      currentBalance > 0
    ) {
      setEnableConfigureAutopayText(false);
      setSetUpAutopay(false);
      setEnableClick(true);
      setClosedAccount(false);
      setNoAdditionalPayment(false);
    } else if (
      (currentAmountDue === 0 && isAutoPay === false && currentBalance > 0) ||
      (currentAmountDue > 0 && totalAmountDue - currentAmountDue === 0) ||
      (totalAmountDue - currentAmountDue > 0 && daysDelinquent <= 60) ||
      (totalAmountDue - currentAmountDue > 0 && daysDelinquent > 60)
    ) {
      if (isAutoPay === false && !isBankrupt && !isAccountClosed) {
        setSetUpAutopay(true);
      } else {
        setSetUpAutopay(false);
        setEnableClick(true);
        setNoAdditionalPayment(true);
      }
    } else {
      // Handle any other cases if necessary
      setEnableClick(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("useFocusEffect triggered");
      fetchAllData();
    }, [fetchAllData,token])
  );

  const isLoggedOut = useSelector((state: any) => !state.auth.token);

  useEffect(() => {
    if (isLoggedOut) {
      setTransactions([]);
    }
  }, [isLoggedOut]);

  const handleHamburgerPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleMakeAdditionalPayment = () => {
    navigation.navigate("MakeAdditionalPayment");
  };

  const handleMakeAPayment = () => {
    navigation.navigate("MakeAPayment");
  };

  const handleConfigureAutoPay = () => {
    navigation.navigate("ConfigureAutopay");
  };

  const renderAccountStatus = () => {
    const isVisible =
      customerStandingDisplayMessage === "ACCOUNT IS CLOSED" ||
      customerStandingDisplayMessage === "ACCOUNT IN BANKRUPTCY" ||
      customerStandingDisplayMessage === "THIS ACCOUNT IS PAST DUE";

    if (!isVisible) return null;

    const messageStyle = isActiveClass
      ? styles.accountStatusRed
      : styles.accountStatus;
    const iconStyle = isActiveClass ? styles.iconRed : styles.icon;

    return (
      <View style={[styles.accountStatusContainer, messageStyle]}>
        <View style={styles.row}>
          <View style={styles.col3} />
          <View style={styles.col6}>
            <Text style={styles.typography}>
              <Text style={iconStyle}>⚠️ </Text>
              {customerStandingDisplayMessage}
            </Text>
          </View>
          <View style={styles.col3} />
        </View>
      </View>
    );
  };

  useEffect(() => {
    dispatch(setShowMakePayment(noAdditionalPayment && enableClick));
    dispatch(setShowMakeAdditionalPayment(!noAdditionalPayment && enableClick));
  }, [noAdditionalPayment, enableClick, dispatch]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.headerContainer}>
          <SkeletonLoader style={styles.hamburgerIcon} />
          <View style={styles.iconAndTextContainer}>
            <View style={styles.infoContainer}>
              <SkeletonLoader style={styles.userNameSkeleton} type="text" />
              <SkeletonLoader style={styles.welcomeTextSkeleton} type="text" />
            </View>
            <SkeletonLoader style={styles.avatarIcon} />
          </View>
        </View>

        <SkeletonLoader style={styles.boxContainerSkeleton} type="container">
          <SkeletonLoader style={styles.accountNumberSkeleton} type="text" />
          <View style={styles.paymentContainer}>
            <View>
              <SkeletonLoader style={styles.paymentLabelSkeleton} type="text" />
              <SkeletonLoader
                style={styles.paymentAmountSkeleton}
                type="text"
              />
            </View>
            <View>
              <SkeletonLoader style={styles.paymentLabelSkeleton} type="text" />
              <SkeletonLoader style={styles.paymentDateSkeleton} type="text" />
            </View>
            <View>
              <SkeletonLoader style={styles.paymentLabelSkeleton} type="text" />
              <SkeletonLoader style={styles.paymentDateSkeleton} type="text" />
            </View>
          </View>
        </SkeletonLoader>

        <SkeletonLoader
          style={styles.balanceContainerSkeleton}
          type="container"
        >
          <View style={styles.balanceRow}>
            <SkeletonLoader style={styles.balanceLabelSkeleton} type="text" />
            <SkeletonLoader style={styles.balanceValueSkeleton} type="text" />
          </View>
          <View style={styles.balanceRow}>
            <SkeletonLoader style={styles.balanceLabelSkeleton} type="text" />
            <SkeletonLoader style={styles.balanceValueSkeleton} type="text" />
          </View>
        </SkeletonLoader>

        <View style={styles.buttonContainer}>
          <SkeletonLoader style={styles.buttonSkeleton} type="container" />
        </View>

        <SkeletonLoader
          style={styles.RecentTransactionsContainerSkeleton}
          type="container"
        >
          <SkeletonLoader
            style={styles.recentTransactionsSkeleton}
            type="text"
          />
        </SkeletonLoader>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable onPress={handleHamburgerPress}>
            <Image
              source={require("../../assets/images/menus.png")}
              style={styles.hamburgerIcon}
            />
          </Pressable>
          <View style={styles.iconAndTextContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.userName}>
                {firstName} {lastName}
              </Text>
              <Text style={styles.welcomeText}>Welcome to IvitaFi</Text>
            </View>
            <Pressable onPress={handleProfilePress}>
              <Image
                source={require("../../assets/images/profile.png")}
                style={styles.avatarIcon}
              />
            </Pressable>
          </View>
        </View>
        {renderAccountStatus()}
        <View style={styles.boxContainer}>
          {accountNumbers.length > 0 ? (
            accountNumbers.map((accountNum, index) => (
              <View key={index} style={styles.accountDetails}>
                <View style={styles.accountNumberContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.accountNumberText}>
                      Account Number: {accountNum}
                    </Text>
                  </View>
                  <View style={styles.autoPayParent}>
                    {autoPay ? (
                      <Image
                        source={require("../../assets/images/autopayOn.png")}
                        style={styles.autopayIcon}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/autopayOff.png")}
                        style={styles.autopayIcon}
                      />
                    )}
                    <Text style={styles.autoPay}>Auto Pay</Text>
                  </View>
                </View>
                <View style={styles.paymentContainer}>
                  <View>
                    <Text style={styles.paymentLabel}>Next Payment</Text>
                    <Text style={styles.paymentAmount}>
                      ${currentAmountDue?.toFixed(2) || " "}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.paymentLabel}>Payment Date</Text>
                    <Text style={styles.paymentDate}>
                      {nextPaymentDate || " "}
                    </Text>
                  </View>
                  <View>
                    <View>
                      <Text style={styles.paymentLabel}>
                        {isCardNumber ? "Debit Card" : "Account"}
                      </Text>
                      <Text style={styles.paymentDate}>
                        {last4Digits ? `*${last4Digits}` : " -- "}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noAccountText}>No accounts available</Text>
          )}
        </View>

        <View style={styles.balanceContainer}>
          <View style={styles.balanceRow}>
            <Text style={styles.myBalance}>My Balance</Text>
            <Text style={styles.text}>${balance?.toFixed(2) || " "}</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.availableCredit}>Available Credit</Text>
            <Text style={styles.text1}>
              ${availableCredit?.toFixed(2) || " "}
            </Text>
          </View>
        </View>

      <View style={styles.buttonContainer}>
  {noAdditionalPayment === false && enableClick === true && (
    <TouchableOpacity
      style={styles.button}
      onPress={handleMakeAdditionalPayment}
    >
      <Text style={styles.additionalPaymentText}>
        Make Additional Payment
      </Text>
    </TouchableOpacity>
  )}

  {setUpAutopay === true ? (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={handleConfigureAutoPay}
      >
        <Text style={styles.additionalPaymentText}>
          Configure AutoPay
        </Text>
      </TouchableOpacity>
      {noAdditionalPayment === true && (
        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={handleMakeAPayment}
        >
          <Text style={styles.additionalPaymentText}>
            Make a Payment
          </Text>
        </TouchableOpacity>
      )}
    </>
  ) : (
    noAdditionalPayment === true && enableClick === true && (
      <TouchableOpacity
        style={styles.button}
        onPress={handleMakeAPayment}
      >
        <Text style={styles.additionalPaymentText}>Make a Payment</Text>
      </TouchableOpacity>
    )
  )}
</View>

        <View style={styles.RecentTransactionsContainer}>
          {creditAccountId ? (
            <RecentTransactions />
          ) : (
            <Text style={styles.noAccountText}>No transactions available</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
