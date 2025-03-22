import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Dimensions } from "react-native";
import { fetchData } from "../api/api";
import { CreditAccountTransactionTypeUtil } from "../utils/CreditAccountTransactionTypeUtil";
import AntDesign from '@expo/vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fetchPendingTransactions } from "./services/pendingTransactionsService";
import styles from "../components/styles/RecentTransactionsStyles";  // Import the new styles file

interface RecentTransactionsProps {
  creditAccountId: string;
  token: string;
}

const { height: screenHeight } = Dimensions.get("window");

const renderTransactionIcon = (transactionType: number) => {
  if (transactionType !== 404 && transactionType !== 481) {
    return <Image source={require('@/assets/images/Trash.png')} style={styles.trashIcon} />;
  } else {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image source={require('@/assets/images/Check01.png')} style={styles.icon} />
        <Image source={require('@/assets/images/X02.png')} style={styles.icon} />
      </View>
    );
  }
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ creditAccountId, token }) => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetchPendingTransactions(creditAccountId, token);
        setTransactions(response || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [creditAccountId, token]);

  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight <= 800;
  const isLargeScreen = screenHeight > 800;

  return (
    <View style={[styles.recentTransactions, { height: isSmallScreen ? hp(30) : isMediumScreen ? hp(32) : hp(45) }]}> 
      <View style={styles.baseBlackParent}>
        <View style={[styles.baseBlack, styles.absoluteFill]} />
        <View style={styles.frameParent}>
          <View style={[styles.titleParent, styles.rowCenter]}>
            <Text style={[styles.title, styles.textBold]}>Pending Transactions</Text>
            <AntDesign name="rightcircleo" size={hp(2.5)} color="white" />
          </View>

          {transactions.length > 0 ? (
            <ScrollView 
              style={[styles.scrollView, { maxHeight: isSmallScreen ? hp(22.9) : isMediumScreen ? hp(25) : hp(35) }]} 
              nestedScrollEnabled={true} 
              showsVerticalScrollIndicator={true}
            >
              {transactions.slice(-3).reverse().map((transaction, index) => (
                <View key={index} style={[styles.transactionRow, index % 2 === 0 ? styles.rowLight : styles.rowDark]}>
                  <View style={styles.transactionDetailsContainer}>
                    <Text style={[styles.transactionDetails, styles.textSmall]}>
                      <Text style={styles.textBold}>{transaction.id}</Text>
                      {"\n"}
                      <Text style={styles.textSecondary}>
                        {CreditAccountTransactionTypeUtil.toString(transaction.transactionType) || "Unknown Type"}
                      </Text>
                      {"\n"}
                      <Text style={styles.textSecondary}>
                        {transaction.pendingTransactionDate === null
                          ? "---"
                          : new Date(transaction.pendingTransactionDate).toLocaleDateString()}
                      </Text>
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.amountText}>${transaction.requestedAmount.toFixed(2)}</Text>
                  </View>
                  <View>{renderTransactionIcon(transaction.transactionType)}</View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noTransactionsText}>No recent transactions available.</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default RecentTransactions;
