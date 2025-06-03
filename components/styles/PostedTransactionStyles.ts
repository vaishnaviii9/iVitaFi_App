// PostedTransactionStyles.js
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const postedStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0', // Light grey background
  },
  loadingText: {
    color: "#333", // Dark grey text
    fontSize: hp(2),
    marginTop: hp(1),
  },
  scrollView: {
    backgroundColor: '#D3D3D3', // Light grey background
    padding: hp(1),
  },
  scrollViewContent: {
    paddingBottom: hp(2),
  },
  noTransactionsText: {
    color: "#555", // Medium grey text
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
    borderColor: "#e0e0e0", // Light grey border
    shadowColor: "#000",
  },
  skeletonRow: {
    backgroundColor: '#e0e0e0', // Light grey background for skeleton rows
  },
  rowLight: {
    backgroundColor: "#3a4466", // Dark blue background for light rows
  },
  rowDark: {
    backgroundColor: "#2f3954", // Darker blue background for dark rows
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
  // Skeleton styles
  transactionDetailsSkeleton: {
    width: wp('40%'),
    height: hp('6%'),
    backgroundColor: '#b0b0b0', // Medium grey for skeleton text
  },
  amountTextSkeleton: {
    width: wp('20%'),
    height: hp('2%'),
    backgroundColor: '#b0b0b0', // Medium grey for skeleton text
  },
});

export default postedStyles;
