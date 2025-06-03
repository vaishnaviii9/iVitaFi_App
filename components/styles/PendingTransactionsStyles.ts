import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0', // Light grey background for loading container
  },
  loadingText: {
    color: "#333", // Dark grey color for loading text
    fontSize: hp(2),
    marginTop: hp(1),
  },
  scrollView: {
    backgroundColor: '#D3D3D3', // Light grey background for scroll view
    padding: hp(1),
  },
  scrollViewContent: {
    paddingBottom: hp(2),
  },
  noTransactionsText: {
    color: "#555", // Medium grey color for no transactions text
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
    borderColor: "#e0e0e0", // Light grey border color
    backgroundColor: '#e0e0e0', // Light grey background for transaction row
    shadowColor: "#000", // Black shadow color
  },
  rowLight: {
    backgroundColor: "#3a4466", // Dark blue background for light rows
  },
  rowDark: {
    backgroundColor: "#2f3954", // Darker blue background for dark rows
  },
  skeletonRow: {
    backgroundColor: '#e0e0e0', // Light grey background for skeleton rows
  },
  transactionDetailsContainer: {
    flex: 1,
    paddingRight: wp(1),
  },
  transactionDetails: {
    color: "#fffbfb", // Off-white color for transaction details text
    lineHeight: hp(2.2),
  },
  textBold: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    color: "#fffbfb", // Off-white color for bold text
  },
  textSmall: {
    fontSize: hp(1.8),
    letterSpacing: -0.1,
    textAlign: "left",
    color: "#fffbfb", // Off-white color for small text
  },
  textSecondary: {
    color: "#ceccff", // Light purple color for secondary text
  },
  amountText: {
    color: "#feeeee", // Very light red/off-white color for amount text
    fontWeight: "bold",
    textAlign: "center",
  },
  trashIcon: {
    height: hp(3),
    width: hp(3),
    marginLeft: wp(2),
    // No color specified for the icon itself, typically controlled by the image asset
  },
  icon: {
    height: hp(3),
    width: hp(3),
    marginLeft: wp(2),
    // No color specified for the icon itself, typically controlled by the image asset
  },
  // Skeleton styles
  transactionDetailsSkeleton: {
    width: wp('35%'),
    height: hp('6%'),
    backgroundColor: '#b0b0b0', // Medium grey background for skeleton text
  },
  amountTextSkeleton: {
    width: wp('15%'),
    height: hp('2%'),
    backgroundColor: '#b0b0b0', // Medium grey background for skeleton text
  },
  iconSkeleton: {
    marginLeft: wp('2%'),
    width: wp('10%'),
    height: wp('10%'),
    backgroundColor: '#b0b0b0', // Medium grey background for skeleton icons
  },
});

export default styles;
