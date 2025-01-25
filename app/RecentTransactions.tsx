import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

const RecentTransactions = () => {
  return (

    // View for Recent Transactions
    <View style={styles.recentTransactions}>
      <View style={styles.baseBlackParent}>
        <View style={[styles.baseBlack, styles.absoluteFill]} />
        <View style={styles.frameParent}>
          <View style={[styles.titleParent, styles.rowCenter]}>
            <Text style={[styles.title, styles.textBold]}>Pending Transactions</Text>
            <View style={styles.iconBack}>
              <Image
                style={[styles.icon]}
                resizeMode="cover"
                source={require('@/assets/images/next.png')}
              />
            </View>
          </View>

            {/* Transaction Rows */}
            <View style={styles.transactionRow}>
              <Text style={[styles.transactionDetails, styles.textSmall]}>
                <Text style={styles.textBold}>{`25587\n`}</Text>
                <Text style={styles.textSecondary}>{`Downward Adjustment\n12/18/2024`}</Text>
              </Text>
              <Text style={styles.amountText}>$180.00</Text>
              <Image
                source={require('@/assets/images/Trash.png')}
                style={styles.trashIcon}
              />
            </View>

            <View style={styles.transactionRow}>
              <Text style={[styles.transactionDetails, styles.textSmall]}>
                <Text style={styles.textBold}>{`26007\n`}</Text>
                <Text style={styles.textSecondary}>{`Debit Card\n01/31/2025`}</Text>
              </Text>
              <Text style={styles.amountText}>$46.00</Text>
              <Image
                source={require('@/assets/images/Trash.png')}
                style={styles.trashIcon}
              />
            </View>

          
            <View style={styles.transactionRow}>
              <Text style={[styles.transactionDetails, styles.textSmall]}>
                <Text style={styles.textBold}>{`26005\n`}</Text>
                <Text style={styles.textSecondary}>{`Upward Adjustment\n12/18/2024`}</Text>
              </Text>
              <Text style={styles.amountText}>---</Text>
              <View style={styles.twoiconstyle}>
              <Image
                source={require('@/assets/images/Check01.png')}
                style={styles.icon}
              />
              <Image
                source={require('@/assets/images/X02.png')}
                style={styles.icon}
              />
              </View>
             
            </View>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nextIcon:{
    color: "#fff",
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
  iconBack: {
    width: 25,
    height: 20,
  },
  icon: {
    height: 24,
    width: 24,
    resizeMode: "cover",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 305,
    height: 45,
    justifyContent: "space-between",
  },
  
  transactionDetails: {
    // flex: 1,
    color: "#fffbfb",
    width: 150,
  },

  amountText: {
    color: "#feeeee",
    width: 60,
    height: 18,
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  trashIcon: {
    height: 24,
    width: 24,
    marginLeft: 10,
  },
    twoiconstyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 50,
        gap: 10,
        height: 28,
    },
});

export default RecentTransactions;
