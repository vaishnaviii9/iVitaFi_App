import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { fetchData } from "../api/api";

interface RecentTransactionsProps {
  creditAccountId: string;
  token: string;
}

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
          token, // Use token here
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

  return (
    <View style={styles.recentTransactions}>
      <View style={styles.baseBlackParent}>
        <View style={[styles.baseBlack, styles.absoluteFill]} />
        <View style={styles.frameParent}>
          <View style={[styles.titleParent, styles.rowCenter]}>
            <Text style={[styles.title, styles.textBold]}>
              Recent Transactions
            </Text>
          </View>

          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <View key={index} style={styles.transactionRow}>
                <Text style={[styles.transactionDetails, styles.textSmall]}>
                  <Text style={styles.textBold}>
                    {transaction.id}
                  </Text>
                  {"\n"}
                  <Text style={styles.textSecondary}>
                    {" "}
                    {transaction.transactionType || "No type available"}
                  </Text>
                  {"\n"}
                  <Text style={styles.textSecondary}>
                   {" "}
                    {new Date(transaction.pendingTransactionDate).toLocaleDateString()}
                  </Text>
                </Text>
                <Text style={styles.amountText}>
                  ${transaction.requestedAmount.toFixed(2)}
                </Text>
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
    height: 229,
  },
  baseBlack: {
    borderRadius: 10,
    backgroundColor: "#27446f",
    borderWidth: 1,
    borderColor: "rgba(42, 37, 79, 0.05)",
  },
  frameParent: {
    position: "absolute",
    top: 16,
    left: 16,
    gap: 13,
  },
  titleParent: {
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    color: "#fff",
    letterSpacing: -0.1,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 305,
    height: 65,
    justifyContent: "space-between",
  },
  transactionDetails: {
    color: "#fffbfb",
    width: 200,
  },
  amountText: {
    color: "#feeeee",
    textAlign: "center",
  },
});

export default RecentTransactions;
