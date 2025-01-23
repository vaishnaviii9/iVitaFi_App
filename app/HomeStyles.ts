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
    height: 150,
    justifyContent: "center",
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
  accountDetails: {
    marginBottom: 15,
  },
  accountNumberContainer: {
    alignContent: "flex-start",
  },
  accountNumberText: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
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
    marginTop: 10,
    height: 100,
    justifyContent: "center",
  },
  myBalanceTypo: {
    textAlign: "left",
    color: "#000",
    fontWeight: "600",
    fontSize: 20,
    left: 10,
    position: "absolute"
  },
  textTypo: {
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    fontSize: 30,
    textAlign: "left",
    color: "#000",
    position: "absolute"
  },
  myBalance: {
    top: 6,
  },
  availableCredit: {
    top: 53
  },
  text: {
    top: 0,
    left: 200,
    width: "100%",
    height: 42
  },
  text1: {
    top: 49,
    left: 200
  },
  myBalanceParent: {
    flex: 1,
    width: "100%",
    height: 94
  },
  buttonContainer: {
    marginTop: 20,
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
});

export default styles;
