// src/features/transactions/PendingTransactions.js
import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import useTransactions from '../../hooks/useTransactions';
import TransactionList from './TransactionList';
import SkeletonLoader from '../../components/SkeletonLoader';
import styles from '../../components/styles/PendingTransactionsStyles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { height: screenHeight } = Dimensions.get("window");

const Pending = () => {
  const { transactions, loading } = useTransactions();

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
        <TransactionList transactions={transactions} styles={styles} maxTransactions={undefined} />
      ) : (
        <Text style={styles.noTransactionsText}>No recent transactions available.</Text>
      )}
    </ScrollView>
  );
};

export default Pending;
