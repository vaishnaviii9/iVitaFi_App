import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rowLight: {
    backgroundColor: '#f9f9f9',
  },
  rowDark: {
    backgroundColor: '#e9e9e9',
  },
  transactionDetailsContainer: {
    flex: 2,
  },
  transactionDetails: {
    fontSize: wp(3.5),
  },
  textBold: {
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: wp(3),
  },
  textSecondary: {
    color: '#666',
    fontSize: wp(3),
  },
  amountText: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    flex: 1,
    right: 1,
    textAlign: 'right',
    paddingHorizontal: wp(2),
  },
  icon: {
    width: wp(5),
    height: wp(5),
    marginHorizontal: wp(1),
  },
  trashIconRed: {
    color: '#FF0000',
  },
  trashIconDisabled: {
    color: '#D3D3D3',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: wp('80%'),
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#27446F',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#27446F',
    padding: 12,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    elevation: 2,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTextStyle: {
    bottom: hp(1.5),
    marginTop: hp(0),
    marginBottom: hp(0.5),
    textAlign: "center",
    fontSize: wp(6),
    fontWeight: "bold",
    color: '#27446F',
  },
  modalMessageStyle: {
    marginBottom: hp(1),
    textAlign: "center",
    fontSize: wp(4),
    color: '#555555',
  },
  modalButtonStyle: {
    backgroundColor: "#27446F",
    padding: hp(1.5),
    borderRadius: wp(2.5),
    alignItems: "center",
    width: wp(50),
    marginTop: hp(1),
  },
  modalButtonTextStyle: {
    color: "white",
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    left: wp(27),
    top: hp(-2),
    padding: wp(1.2),
  },
});

export default styles;
