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
        borderRadius: wp('5%'),
        padding: wp('4%'),
        flex: 1,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: hp('0.5%') },
        shadowRadius: wp('1%'),
        marginBottom: hp('5%'),
        marginTop: hp('5%'),
        width: wp('90%'),
        alignSelf: 'center',
      },
      tabContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        
      },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Add other styles as needed
});

export default styles;
