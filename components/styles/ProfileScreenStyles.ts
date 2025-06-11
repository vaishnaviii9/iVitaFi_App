// ProfileScreen.styles.ts
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    backgroundColor: "#27446F",
    paddingVertical: hp("4%"),
    paddingHorizontal: wp("5%"),
    borderBottomLeftRadius: wp("15%"),
    borderBottomRightRadius: wp("15%"),
    height: hp("30%"),
    flexDirection: "column",
    justifyContent: "space-between",
  },
  backButton: {
    padding: wp("1%"),
    top: hp("2%"),
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: wp("7%"),
    fontWeight: "bold",
    top: hp("2%"),
  },
  headerItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
    marginTop: hp("2%"),
    paddingHorizontal: wp("2.5%"),
  },
  scrollViewContent: {
    paddingBottom: hp("2%"),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  icon: {
    marginRight: wp("2%"),
    width: wp("15%"),
    alignItems: "center",
  },
  label: {
    color: "#000000",
    fontSize: wp("5%"),
    fontWeight: "600",
  },
  value: {
    color: "#333333",
    fontSize: wp("4.5%"),
  },
  input: {
    fontSize: wp("4.5%"),
    color: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingVertical: hp("0.5%"),
    minWidth: wp("50%"),
  },
  avatarIcon: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonContainer: {
    alignItems: "center",
    marginBottom: hp("2%"),
    marginTop: hp("1%"),
  },
  saveButton: {
    marginBottom: hp("3%"),
    backgroundColor: "#27446F",
    paddingVertical: hp("1.5%"),  
    paddingHorizontal: wp("15%"),
    borderRadius: wp("7%"),
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: wp("4.5%"),
    fontWeight: "bold",
  },
});

export default styles;
