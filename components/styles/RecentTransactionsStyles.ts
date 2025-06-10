import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
    maxHeight: hp(30),
    flexShrink: 1,
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

//skeleton styles
skeletonTitle: {
  marginTop: hp('2%'),
  width: wp('80%'),
  height: hp('4%'),
  marginBottom: hp('2%'),
  borderRadius: 15,
},
skeletonTransaction: {
  marginTop: hp('1%'),
  width: wp('85%'),
  height: hp('8%'),
  marginBottom: hp('1%'),
  borderRadius: 15,
},




});

export default styles;
