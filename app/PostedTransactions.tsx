import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { fetchPostedTransactions } from "./services/postedTransactionsService";
import { CreditAccountTransactionTypeUtil } from "../utils/CreditAccountTransactionTypeUtil";
import styles from "../components/styles/PostedTransactionStyles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { height: screenHeight } = Dimensions.get("window");

const Posted: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  const creditAccountId = useSelector((state: any) => state.creditAccount.creditAccountId);

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
        const response = await fetchPostedTransactions(token, creditAccountId);
        setTransactions(response || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, creditAccountId]);

  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight <= 800;
  const isLargeScreen = screenHeight > 800;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={true}
    >
      {transactions.length > 0 ? (
        [...transactions].reverse().map((transaction, index) => (
          <View
            key={index}
            style={[
              styles.transactionRow,
              index % 2 === 0 ? styles.rowLight : styles.rowDark,
            ]}
          >
            <View style={styles.transactionDetailsContainer}>
              <Text style={[styles.transactionDetails, styles.textSmall]}>
                <Text style={styles.textBold}>{transaction.id}</Text>
                {"\n"}
                <Text style={styles.textSecondary}>
                  {CreditAccountTransactionTypeUtil.toString(transaction.transactionType) || "Unknown Type"}
                </Text>
                {"\n"}
                <Text style={styles.textSecondary}>
                  {transaction.transactionDate
                    ? new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })
                    : "---"}
                </Text>
              </Text>
            </View>
            <View>
              <Text style={styles.amountText}>
                ${transaction.amount?.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noTransactionsText}>No recent transactions available.</Text>
      )}
    </ScrollView>
  );
};

export default Posted;
