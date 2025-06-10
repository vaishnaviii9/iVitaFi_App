import React, { useCallback } from 'react';
import { View, Text, Pressable, Dimensions, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import SkeletonLoader from '../../components/SkeletonLoader';
import useTransactions from '../../hooks/useTransactions';
import TransactionList from './TransactionList';
import styles from '../../components/styles/RecentTransactionsStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { height: screenHeight } = Dimensions.get("window");

const RecentTransactions = () => {
  const navigation = useNavigation();
  const { transactions, loading, fetchTransactions } = useTransactions();
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight <= 800;
  const isLargeScreen = screenHeight > 800;
  useFocusEffect(
    useCallback(() => {
      fetchTransactions(); // Fetch transactions when the screen comes into focus
    }, [fetchTransactions])
  );

  if (loading) {
    return (
      <SkeletonLoader style={styles.recentTransactions} type="container">
        <SkeletonLoader style={styles.skeletonTitle} type="text" />
        <SkeletonLoader style={styles.skeletonTransaction} type="text" />
        <SkeletonLoader style={styles.skeletonTransaction} type="text" />
        <SkeletonLoader style={styles.skeletonTransaction} type="text" />
      </SkeletonLoader>
    );
  }

  return (
    <View style={[
      styles.recentTransactions,
      { height: isSmallScreen ? hp(30) : isMediumScreen ? hp(32) : hp(45) },
    ]}>
      <View style={styles.baseBlackParent}>
        <View style={[styles.baseBlack, styles.absoluteFill]} />
        <View style={styles.frameParent}>
          <Pressable
            onPress={() => navigation.navigate('Transactions')}
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
                    ? hp(27.9)
                    : isMediumScreen
                    ? hp(28)
                    : hp(35),
                },
              ]}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              <TransactionList
                transactions={transactions}
                maxTransactions={3}
                styles={styles}
                fetchTransactions={fetchTransactions}
              />
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
