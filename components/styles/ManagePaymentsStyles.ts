import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    headerContainer: {
      backgroundColor: '#27446F',
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 60,
      borderBottomRightRadius: 60,
      height: 130,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      padding: 4,
    },
    headerText: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: '#fff',
      padding: 25,
      borderRadius: 20,
      elevation: 10,
      shadowColor: '#000',
    },
    modalCloseButton: {
      alignSelf: 'flex-end',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#333',
    },
    modalText: {
      fontSize: 16,
      color: '#555',
      marginBottom: 10,
    },
    okButton: {
      marginTop: 20,
      backgroundColor: '#27446F',
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: 'center',
    },
    okButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

export default styles;