import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { fetchPendingTransactions } from "./services/pendingTransactionsService";
import { CreditAccountTransactionTypeUtil } from "../utils/CreditAccountTransactionTypeUtil";
import styles from "../components/styles/RecentTransactionsStyles";

const { height: screenHeight } = Dimensions.get("window");

const RecentTransactions: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  const creditAccountId = useSelector(
    (state: any) => state.creditAccount.creditAccountId
  );
  const navigation = useNavigation<NavigationProp<{ Transactions: undefined }>>();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!creditAccountId) {
        console.warn("No Credit Account ID available in Redux.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchPendingTransactions(token, creditAccountId);
        setTransactions(response || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, creditAccountId]);

  const renderTransactionIcon = (transactionType: number) => {
    if (transactionType !== 404 && transactionType !== 481) {
      return (
        <Image
          source={require("@/assets/images/Trash.png")}
          style={styles.trashIcon}
        />
      );
    }
    return (
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("@/assets/images/Check01.png")}
          style={styles.icon}
        />
        <Image
          source={require("@/assets/images/X02.png")}
          style={styles.icon}
        />
      </View>
    );
  };

  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight <= 800;
  const isLargeScreen = screenHeight > 800;

  if (loading) {
    return (
      <View style={styles.recentTransactions}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.recentTransactions,
        { height: isSmallScreen ? hp(30) : isMediumScreen ? hp(32) : hp(45) },
      ]}
    >
      <View style={styles.baseBlackParent}>
        <View style={[styles.baseBlack, styles.absoluteFill]} />
        <View style={styles.frameParent}>
          <Pressable
            onPress={() => navigation.navigate("Transactions")}
            style={[styles.titleParent, styles.rowCenter]}
          >
            <Text style={[styles.title, styles.textBold]}>
              Pending Transactions
            </Text>
            <AntDesign name="rightcircleo" size={hp(2.5)} color="white" />
          </Pressable>

          {transactions.length > 0 ? (
            <ScrollView
              style={[
                styles.scrollView,
                {
                  maxHeight: isSmallScreen
                    ? hp(22.9)
                    : isMediumScreen
                    ? hp(25)
                    : hp(35),
                },
              ]}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {transactions
                .slice(-3)
                .reverse()
                .map((transaction, index) => (
                  <View
                    key={index}
                    style={[
                      styles.transactionRow,
                      index % 2 === 0 ? styles.rowLight : styles.rowDark,
                    ]}
                  >
                    <View style={styles.transactionDetailsContainer}>
                      <Text
                        style={[styles.transactionDetails, styles.textSmall]}
                      >
                        <Text style={styles.textBold}>{transaction.id}</Text>
                        {"\n"}
                        <Text style={styles.textSecondary}>
                          {CreditAccountTransactionTypeUtil.toString(
                            transaction.transactionType
                          ) || "Unknown Type"}
                        </Text>
                        {"\n"}
                        <Text style={styles.textSecondary}>
                          {transaction.pendingTransactionDate
                            ? new Date(
                                transaction.pendingTransactionDate
                              ).toLocaleDateString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              })
                            : "---"}
                        </Text>
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.amountText}>
                        ${transaction.requestedAmount?.toFixed(2) || "0.00"}
                      </Text>
                    </View>
                    <View>
                      {renderTransactionIcon(transaction.transactionType)}
                    </View>
                  </View>
                ))}
            </ScrollView>
          ) : (
            <Text style={styles.noTransactionsText}>
              No recent transactions available.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default RecentTransactions;
