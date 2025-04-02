import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0'
  },
  loadingText: {
    color: "#333",
    fontSize: hp(2),
    marginTop: hp(1),
  },
  scrollView: {
    backgroundColor: '#D3D3D3', // Light gray background
    padding: hp(1),
  },
  scrollViewContent: {
    paddingBottom: hp(2),
  },
  noTransactionsText: {
    color: "#555",
    fontSize: hp(2),
    textAlign: "center",
    marginTop: hp(2),
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: hp(1),
    marginBottom: hp(1.2),
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
  },
  rowLight: {
    backgroundColor: "#3a4466", // Dark background for light rows
  },
  rowDark: {
    backgroundColor: "#2f3954", // Darker background for dark rows
  },
  transactionDetailsContainer: {
    flex: 1,
    paddingRight: wp(1),
  },
  transactionDetails: {
    color: "#fffbfb", // Light text color for contrast
    lineHeight: hp(2.2),
  },
  textBold: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    color: "#fffbfb", // Light text color for bold text
  },
  textSmall: {
    fontSize: hp(1.8),
    letterSpacing: -0.1,
    textAlign: "left",
    color: "#fffbfb", // Light text color for small text
  },
  textSecondary: {
    color: "#ceccff", // Light secondary text color
  },
  amountText: {
    color: "#feeeee", // Light text color for amount
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

export default styles;
