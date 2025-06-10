import { StyleSheet, Dimensions, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    // paddingTop: hp("%"),
    paddingBottom: hp("2.5%"),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: wp("5%"),
    marginTop: hp("4%"),
  },
  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1.2%"),
  },
  avatarIcon: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
  },
  hamburgerIcon: {
    width: wp("7%"),
    height: wp("7%"),
    marginTop: hp("2%"),
  },
  infoContainer: {
    marginRight: wp("2.5%"),
    alignItems: "flex-end",
  },
   userName: {
  fontSize: wp("4.5%"),
  fontWeight: "600",
  color: "#000", 
  flexShrink: 1, 
  ...Platform.select({
    ios: {
        color: "#000", 
    },
    android: {
      
      color: "#000", 
    },
  }),
},
 
  welcomeText: {
    fontSize: wp("4%"),
    color: "#757575",
  },
  boxContainer: {
    width: wp("90%"),
    backgroundColor: "#2D4768",
    borderRadius: wp("5%"),
    padding: wp("4%"),
    marginTop: hp("2%"),
    justifyContent: "space-between",
  },
  accountDetails: {
    marginBottom: hp("2%"),
  },
  accountNumberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountNumberText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  autoPayParent: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("1.2%"),
    borderRadius: wp("4%"),
    backgroundColor: "#1E3553",
  },
  autoPay: {
    fontSize: wp("3%"),
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    color: "#fff",
    marginRight: wp("1.2%"),
  },
  autopayIcon: {
    width: wp("5%"),
    height: wp("5%"),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  noAccountText: {
    color: "#fff",
    fontSize: wp("4%"),
    textAlign: "center",
    marginTop: hp("2.5%"),
  },
  paymentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("3%"),
  },
  paymentLabel: {
    color: "#fff",
    fontSize: wp("3.5%"),
    fontWeight: "600",
  },
  paymentAmount: {
    color: "#fff",
    fontSize: wp("5.5%"),
    fontWeight: "700",
    marginBottom: hp("0.6%"),
  },
  paymentDate: {
    color: "#fff",
    fontSize: wp("5.5%"),
    fontWeight: "700",
    marginBottom: hp("0.6%"),
  },
  balanceContainer: {
    width: wp("90%"),
    padding: wp("2.5%"),
    marginTop: hp("2%"),
    height: hp("11%"),
    justifyContent: "center",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1.2%"),
  },
  myBalance: {
    fontWeight: "600",
    fontSize: wp("5%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  availableCredit: {
    fontWeight: "600",
    fontSize: wp("5%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  text: {
    fontWeight: "700",
    fontSize: wp("6%"),
    color: "#000",
    fontFamily: "Poppins-Bold",
    textAlign: "right",
  },
  text1: {
    fontWeight: "700",
    fontSize: wp("6%"),
    color: "#000",
    fontFamily: "Poppins-Bold",
    textAlign: "right",
  },

  smallButton:{
    backgroundColor: "#2D4768",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    borderRadius: wp("2.5%"),
    
  },
  twoButtons:{
    marginTop: hp("0.3%"),
    marginBottom: hp("0.3%"),
   flexDirection: "row",
    justifyContent: "space-between",
    gap: wp("2%"),
  },
  buttonContainer: {
    marginTop: hp("0.1%"),
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2D4768",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("10%"),
    borderRadius: wp("2.5%"),
  },
  additionalPaymentText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  RecentTransactionsContainer: {
    marginTop: hp("1.5%"),
    width: wp("90%"),
    height:
      screenHeight < 700
        ? hp("35%")
        : screenHeight > 700 && screenHeight <= 800
        ? hp("35%")
        : hp("37%"),
    borderRadius: wp("4%"),
    overflow: "hidden",
    marginBottom: hp("3%"), // Add space between Recent Transactions and Bottom Navigation
  },

  BottomNavigationContainer: {
    width: wp("90%"),
    flex: 1, // Prevent unintended stretching
    marginBottom: hp("1%"),
  },

  // skeleton loader styles
  headerSkeleton: {
    width: wp("90%"),
    height: hp("10%"),
    marginBottom: hp("2%"),
    borderRadius: wp("2%"),
    marginTop: hp("2%"),
  },
  boxContainerSkeleton: {
    width: wp("90%"),
    height: hp("20%"),
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
    borderRadius: wp("2%"),
  },
  balanceContainerSkeleton: {
    width: wp("90%"),
    height: hp("10%"),
    marginBottom: hp("2%"),
    borderRadius: wp("2%"),
  },
  buttonSkeleton: {
    width: wp("60%"),
    height: hp("6%"),
    marginBottom: hp("2%"),
    borderRadius: wp("2%"),
  },
  RecentTransactionsContainerSkeleton: {
    width: wp("90%"),
    height: hp("30%"),
    marginBottom: hp("2%"),
    borderRadius: wp("2%"),
  },

  userNameSkeleton: {
    marginHorizontal: wp("1.5%"),
    width: wp("30%"),
    height: hp("2.5%"),
    marginBottom: hp("1%"),
  },
  welcomeTextSkeleton: {
    marginHorizontal: wp("1.5%"),
    width: wp("40%"),
    height: hp("2%"),
  },
  accountNumberSkeleton: {
    marginHorizontal: wp("1.5%"),
    width: wp("80%"),
    height: hp("3%"),
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
  },
  paymentLabelSkeleton: {
    marginHorizontal: wp("1.5%"),
    width: wp("25%"),
    height: hp("2%"),
    marginBottom: hp("1%"),
  },
  paymentAmountSkeleton: {
    marginHorizontal: wp("1.5%"),
    width: wp("20%"),
    height: hp("2%"),
  },
  paymentDateSkeleton: {
    marginHorizontal: wp("1.5%"),
    width: wp("20%"),
    height: hp("2%"),
  },
  balanceLabelSkeleton: {
    marginTop: hp("1.5%"),
    width: wp("35%"),
    height: hp("2%"),
    marginHorizontal: wp("1.5%"),
  },
  balanceValueSkeleton: {
    marginTop: hp("1.5%"),
    marginHorizontal: wp("1.5%"),
    width: wp("25%"),
    height: hp("2%"),
  },
  recentTransactionsSkeleton: {
    width: wp("90%"),
    height: hp("30%"),
  },
  accountStatusContainer: {
    backgroundColor: "#D34A2A", 
    padding: 8,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: "stretch",
    marginHorizontal: wp("2%"),
  },
  accountStatusRed: {
    backgroundColor: "#D34A2A", // Orange background
  },
  accountStatus: {
    backgroundColor: "#D34A2A", // Orange background
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col3: {
    flex: 1,
  },
  col6: {
    flex: 2,
  },
  typography: {
    fontSize: 10, 
    color: "#fff", // White text color
    fontWeight: '900'
  },
  icon: {
    color: "#fff", // White icon color
  },
  iconRed: {
    color: "#fff", // White icon color
  },
});

export default styles;
