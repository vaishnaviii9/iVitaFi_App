import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { fetchData } from "../api/api";
import { CreditAccountTransactionTypeUtil } from "../utils/CreditAccountTransactionTypeUtil"; // Import the utility

interface RecentTransactionsProps {
  creditAccountId: string;
  token: string;
}

const renderTransactionIcon = (transactionType: number) => {
  if (transactionType !== 404 && transactionType !== 481) {
    return (
      <Image
        source={require('@/assets/images/Trash.png')}
        style={styles.trashIcon}
      />
    );
  } else {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('@/assets/images/Check01.png')}
          style={styles.icon}
        />
        <Image
          source={require('@/assets/images/X02.png')}
          style={styles.icon}
        />
      </View>
    );
  }
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  creditAccountId,
  token,
}) => {
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
        console.log(response);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    
    fetchTransactions();
  }, [creditAccountId, token]);
  
  const shouldShowTrashIcon = (transactionType: number) => {
    return transactionType !== 404 && transactionType !== 481;
  };

  return (
    <View style={styles.recentTransactions}>
      <View style={styles.baseBlackParent}>
        <View style={[styles.baseBlack, styles.absoluteFill]} />
        <View style={styles.frameParent}>
          <View style={[styles.titleParent, styles.rowCenter]}>
            <Text style={[styles.title, styles.textBold]}>
              Pending Transactions
            </Text>
          </View>

          {transactions.length > 0 ? (
            transactions.slice(-3).reverse().map((transaction, index) => (
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
                      {CreditAccountTransactionTypeUtil.toString(
                        transaction.transactionType
                      ) || "Unknown Type"}
                    </Text>
                    {"\n"}
                    <Text style={styles.textSecondary}>
                      {transaction.pendingTransactionDate === null
                        ? "---"
                        : new Date(
                            transaction.pendingTransactionDate
                          ).toLocaleDateString()}
                    </Text>
                  </Text>

                </View>
                <View><Text style={styles.amountText}>
                  ${transaction.requestedAmount.toFixed(2)}
                </Text>
                </View>
                <View>{renderTransactionIcon(transaction.transactionType)}</View>                
              </View>
            ))
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

const styles = StyleSheet.create({
  noTransactionsText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
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
    fontSize: 12,
    letterSpacing: -0.1,
    textAlign: "left",
  },
  textSecondary: {
    color: "#ceccff",
  },
  recentTransactions: {
    flex: 1,
    height: 228,
    alignItems: "center",
    width: "100%",
  },
  baseBlackParent: {
    width: 335,
    height: 300,
  },
  baseBlack: {
    borderRadius: 10,
    backgroundColor: "#27446f",
    borderWidth: 1,
    borderColor: "rgba(42, 37, 79, 0.05)",
  },
  frameParent: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    gap: 1,
  },
  titleParent: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    letterSpacing: -0.1,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  rowLight: {
    backgroundColor: "#3a4466",
  },
  rowDark: {
    backgroundColor: "#2f3954",
  },
  transactionDetailsContainer: {
    flex: 1,
    paddingRight: 10,
  },
  transactionDetails: {
    color: "#fffbfb",
    lineHeight: 18,
  },
  amountText: {
    color: "#feeeee",
    fontWeight: "bold",
    textAlign: "center",
  },
  trashIcon: {
    height: 24,
    width: 24,
    marginLeft: 10,
  },
  icon: {
    height: 24,
    width: 24,
    marginLeft: 10,
  },
});

export default RecentTransactions;
