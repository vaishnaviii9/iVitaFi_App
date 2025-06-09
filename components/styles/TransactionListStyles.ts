import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
    textAlign: 'right',
    paddingHorizontal: wp(2),
  },
  icon: {
    width: wp(5),
    height: wp(5),
    marginHorizontal: wp(1),
  },
  trashIconRed: {
    color: 'red',
  },
  trashIconDisabled: {
    color: '#D3D3D3',
  },
 modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#27446F",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default styles;
