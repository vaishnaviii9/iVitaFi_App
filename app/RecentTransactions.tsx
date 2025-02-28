import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, ScrollView, Dimensions } from "react-native";
import { fetchData } from "../api/api";
import { CreditAccountTransactionTypeUtil } from "../utils/CreditAccountTransactionTypeUtil";
import AntDesign from '@expo/vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface RecentTransactionsProps {
  creditAccountId: string;
  token: string;
}

const { height: screenHeight } = Dimensions.get("window"); // Get screen height

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
        const response = await fetchData(
          `https://dev.ivitafi.com/api/creditaccount/${creditAccountId}/pending-transactions`,
          token,
          (data) => data,
          "Failed to fetch transactions."
        );
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


const styles = StyleSheet.create({
  noTransactionsText: {
    color: "#fff",
    fontSize: hp(2),
    textAlign: "center",
    marginTop: hp(1),
  },
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  textBold: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
  },
  textSmall: {
    fontSize: hp(1.8),
    letterSpacing: -0.1,
    textAlign: "left",
  },
  textSecondary: {
    color: "#ceccff",
  },
  recentTransactions: {
    flex: 1,
    height: hp(40), 
    alignItems: "center",
    width: "100%",
  },
  baseBlackParent: {
    width: wp(90),
    height: hp(40), 
  },
  baseBlack: {
    borderRadius: 10,
    backgroundColor: "#27446f",
    borderWidth: 1,
    borderColor: "rgba(42, 37, 79, 0.05)",
  },
  frameParent: {
    position: "absolute",
    top: hp(1),
    left: wp(4),
    right: wp(4),
    gap: 1,
  },
  titleParent: {
    justifyContent: "space-between",
    marginBottom: hp(1),
  },
  title: {
    fontSize: hp(2.3),
    color: "#fff",
    letterSpacing: -0.1,
  },
  scrollView: {
    maxHeight: hp(22.9), 
    flexShrink:1 , 
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: hp(1.4),
    marginBottom: hp(1.2),
  },
  rowLight: {
    backgroundColor: "#3a4466",
  },
  rowDark: {
    backgroundColor: "#2f3954",
  },
  transactionDetailsContainer: {
    flex: 1,
    paddingRight: wp(1),
  },
  transactionDetails: {
    color: "#fffbfb",
    lineHeight: hp(2.2),
  },
  amountText: {
    color: "#feeeee",
    fontWeight: "bold",
    textAlign: "center",
  },
  trashIcon: {
    height: hp(3),
    width: hp(3),
    marginLeft: wp(2),
  },
  icon: {
    height: hp(3),
    width: hp(3),
    marginLeft: wp(2),
  },
});

export default RecentTransactions;
