import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 25,
  },
  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  hamburgerIcon: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
  infoContainer: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
  },
  welcomeText: {
    fontSize: 16,
    color: "#757575",
  },
  boxContainer: {
    width: "90%",
    backgroundColor: "#2D4768",
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    justifyContent: "space-between",
  },

  accountDetails: {
    marginBottom: 15,
  },

  accountNumberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  accountNumberText: {
    color: "white",
    fontSize: 16, // Slightly larger font size for emphasis
    fontWeight: "bold",
  },

  autoPayParent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#1E3553", // Subtle background color for the AutoPay section
  },

  autoPay: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    color: "#fff",
    marginRight: 5, // Space between text and icon
  },

  autopayIcon: {
    width: 20,
    height: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  noAccountText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  loaderStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000",
  },

  paymentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  paymentLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  paymentAmount: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5,
  },
  paymentDate: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5,
  },
    balanceContainer: {
      width: "90%",
      padding: 10,
      marginTop: 20,
      height: 90,
      justifyContent: "center",
    },
    balanceRow: {
      flexDirection: "row",
      justifyContent: "space-between", // Space between the label and amount
      alignItems: "center", // Align items vertically centered
      marginBottom: 10, // Spacing between rows
    },
    myBalance: {
      fontWeight: "600",
      fontSize: 20,
      color: "#000",
      fontFamily: "Poppins-Medium",
    },
    availableCredit: {
      fontWeight: "600",
      fontSize: 20,
      color: "#000",
      fontFamily: "Poppins-Medium",
    },
    text: {
      fontWeight: "700",
      fontSize: 25,
      color: "#000",
      fontFamily: "Poppins-Bold",
      textAlign: "right",
    },
    text1: {
      fontWeight: "700",
      fontSize: 25,
      color: "#000",
      fontFamily: "Poppins-Bold",
      textAlign: "right",
    },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2D4768",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  additionalPaymentText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  RecentTransactionsContainer:{
    marginTop: 30,
    width: "90%",
  }
});

export default styles;
