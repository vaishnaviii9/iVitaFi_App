import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: wp('5%'),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp('1%'),
    marginTop: hp('5%'),
  },
  backButton: {
    position: "absolute",
    left: wp('2%'),
    fontWeight: "bold",
  },
  title: {
    fontSize: wp('8%'),
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  titleSkeleton: {
    width: wp('30%'),
    height: hp('4%'),
    marginLeft: wp('35%'),
  },
  recordsContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    padding: wp('4%'),
    flex: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    marginBottom: hp('5%'),
    marginTop: hp('5%'),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp('2%'),
    marginBottom: hp('2%'),
  },
  headerText: {
    fontSize: wp('5%'),
    fontWeight: "600",
    color: "#333333",
  },
  headerTextSkeleton: {
    width: wp('20%'),
    height: hp('3%'),
  },
  list: {
    paddingBottom: hp('3%'),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: wp('3%'),
    borderRadius: 15,
    marginBottom: hp('1.5%'),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dateText: {
    fontSize: wp('3.9%'),
    color: "#333333",
  },
  dateTextSkeleton: {
    width: wp('40%'),
    height: hp('2%'),
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: wp('1.5%'),
    backgroundColor: "#003566",
    padding: wp('1.6%'),
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonSkeleton: {
    width: wp('10%'),
    margin: wp('1%'),
    height: wp('10%'),
    borderRadius: 9,
  },
  noAccountText: {
    fontSize: wp('5%'),
    color: "#FFCDD2",
    textAlign: "center",
    marginTop: hp('2%'),
    fontWeight: "600",
  },
  noStatementsText: {
    fontSize: wp('5%'),
    color: "#9E9E9E",
    textAlign: "center",
    marginTop: hp('2%'),
    fontWeight: "600",
  },
});

export default styles;
