import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
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
});

export default styles;
