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
    width: wp('90%'),
    alignSelf: 'center'
  },
  headerText: {
    fontSize: wp('5%'),
    fontWeight: "600",
    color: "#333333",
  },
  documentButton: {
    backgroundColor: "#27446F",
    borderRadius: 15,
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentButtonDark: {
    backgroundColor: "#1F3644",
    borderRadius: 15,
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    textAlign: "center",
  },
  documentList: {
    marginTop: hp('7%'),
  }
});

export default styles;
