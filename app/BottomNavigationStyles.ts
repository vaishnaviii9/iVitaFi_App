import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    bottom: hp('1.2%'),
    backgroundColor: "#fff",
    borderRadius: wp('2.5%'),
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: hp('1.5%'),
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -9 },
    shadowOpacity: 0.2,
    shadowRadius: wp('2.5%'),
    elevation: 40,
    borderRadius: wp('7.5%'),
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: wp('3%'),
    color: "#5e5f60",
    marginTop: hp('0.5%'),
    fontFamily: "Figtree-Regular",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  activeLabel: {
    color: "black",
    fontWeight: "bold",
  },
});

export default styles;