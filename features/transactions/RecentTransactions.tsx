import React from "react";
import { View, Text, Image, ScrollView, Dimensions, Pressable } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import SkeletonLoader from "../../components/SkeletonLoader";
import styles from "../../components/styles/RecentTransactionsStyles";
import { CreditAccountTransactionTypeUtil } from "../../utils/CreditAccountTransactionTypeUtil";

interface RecentTransactionsProps {
  loading: boolean;
  transactions: any[];
}

const { height: screenHeight } = Dimensions.get("window");

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ loading, transactions }) => {
  const navigation = useNavigation<NavigationProp<{ Transactions: undefined }>>();
console.log('RecentTransactions loading:', loading);
  console.log('RecentTransactions transactions:', transactions);
  const renderTransactionIcon = (transactionType: number) => {
    console.log('Rendering transaction icon for type:', transactionType);
    if (transactionType !== 404 && transactionType !== 481) {
      return <Image source={require("../../assets/images/Trash.png")} style={styles.trashIcon} />;
    }
    return (
      <View style={{ flexDirection: "row" }}>
        <Image source={require("../../assets/images/Check01.png")} style={styles.icon} />
        <Image source={require("../../assets/images/X02.png")} style={styles.icon} />
      </View>
    );
  };

  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight <= 800;
  const isLargeScreen = screenHeight > 800;

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
    <View style={[styles.recentTransactions, { height: isSmallScreen ? hp(30) : isMediumScreen ? hp(32) : hp(45) }]}>
      <View style={styles.baseBlackParent}>
        <View style={[styles.baseBlack, styles.absoluteFill]} />
        <View style={styles.frameParent}>
          <Pressable onPress={() => navigation.navigate("Transactions")} style={[styles.titleParent, styles.rowCenter]}>
            <Text style={[styles.title, styles.textBold]}>Pending Transactions</Text>
            <AntDesign name="rightcircleo" size={hp(2.5)} color="white" />
          </Pressable>

          {transactions.length > 0 ? (
            <ScrollView
              style={[
                styles.scrollView,
                { maxHeight: isSmallScreen ? hp(22.9) : isMediumScreen ? hp(25) : hp(35) },
              ]}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {transactions.slice(-3).reverse().map((transaction, index) => (
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
                          ? new Date(transaction.pendingTransactionDate).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : "---"}
                      </Text>
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.amountText}>${transaction.requestedAmount?.toFixed(2) || "0.00"}</Text>
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
