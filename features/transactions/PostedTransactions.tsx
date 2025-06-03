import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { fetchPostedTransactions } from "../../app/services/postedTransactionsService";
import { CreditAccountTransactionTypeUtil } from "../../utils/CreditAccountTransactionTypeUtil";
import postedStyles from "../../components/styles/PostedTransactionStyles";
import SkeletonLoader from '../../components/SkeletonLoader';
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

  if (loading) {
    return (
      <ScrollView
        style={postedStyles.scrollView}
        contentContainerStyle={postedStyles.scrollViewContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={[postedStyles.transactionRow, postedStyles.skeletonRow]}>
            <View style={postedStyles.transactionDetailsContainer}>
              <SkeletonLoader style={postedStyles.transactionDetailsSkeleton} type="text" />
            </View>
            <View>
              <SkeletonLoader style={postedStyles.amountTextSkeleton} type="text" />
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={postedStyles.scrollView}
      contentContainerStyle={postedStyles.scrollViewContent}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={true}
    >
      {transactions.length > 0 ? (
        [...transactions].reverse().map((transaction, index) => (
          <View
            key={index}
            style={[
              postedStyles.transactionRow,
              index % 2 === 0 ? postedStyles.rowLight : postedStyles.rowDark,
            ]}
          >
            <View style={postedStyles.transactionDetailsContainer}>
              <Text style={[postedStyles.transactionDetails, postedStyles.textSmall]}>
                <Text style={postedStyles.textBold}>{transaction.id}</Text>
                {"\n"}
                <Text style={postedStyles.textSecondary}>
                  {CreditAccountTransactionTypeUtil.toString(transaction.transactionType) || "Unknown Type"}
                </Text>
                {"\n"}
                <Text style={postedStyles.textSecondary}>
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
              <Text style={postedStyles.amountText}>
                ${transaction.amount?.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={postedStyles.noTransactionsText}>No recent transactions available.</Text>
      )}
    </ScrollView>
  );
};

export default Posted;
