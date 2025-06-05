import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { fetchPendingTransactions } from "../../app/services/pendingTransactionsService";
import { CreditAccountTransactionTypeUtil } from "../../utils/CreditAccountTransactionTypeUtil";
import styles from "../../components/styles/PendingTransactionsStyles";
import SkeletonLoader from '../../components/SkeletonLoader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { height: screenHeight } = Dimensions.get("window");

const Pending: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  const creditAccountId = useSelector((state: any) => state.creditAccount.creditAccountId);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!creditAccountId) {
        // console.log("No Credit Account ID available in Redux.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchPendingTransactions(token, creditAccountId);
        setTransactions(response || []);
      } catch (error) {
        // console.log("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, creditAccountId]);

  const renderTransactionIcon = (transactionType: number) => {
    if (transactionType !== 404 && transactionType !== 481) {
      return <Image source={require('../../assets/images/Trash.png')} style={styles.trashIcon} />;
    }
    return (
      <View style={{ flexDirection: "row" }}>
        <Image source={require('../../assets/images/Check01.png')} style={styles.icon} />
        <Image source={require('../../assets/images/X02.png')} style={styles.icon} />
      </View>
    );
  };

  if (loading) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={[styles.transactionRow, styles.skeletonRow]}>
            <View style={styles.transactionDetailsContainer}>
              <SkeletonLoader style={styles.transactionDetailsSkeleton} type="text" />
            </View>
            <View>
              <SkeletonLoader style={styles.amountTextSkeleton} type="text" />
            </View>
            <View>
              <SkeletonLoader style={styles.iconSkeleton} type="icon" />
            </View>
          </View>
        ))}
      </ScrollView>
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
                  {transaction.pendingTransactionDate
                    ? new Date(transaction.pendingTransactionDate).toLocaleDateString('en-US', {
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
                ${transaction.requestedAmount?.toFixed(2) || "0.00"}
              </Text>
            </View>
            <View>{renderTransactionIcon(transaction.transactionType)}</View>
          </View>
        ))
      ) : (
        <Text style={styles.noTransactionsText}>No recent transactions available.</Text>
      )}
    </ScrollView>
  );
};

export default Pending;
