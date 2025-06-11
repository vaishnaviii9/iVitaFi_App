import { StyleSheet, Platform, Dimensions } from "react-native";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Function to calculate width percentage
const wp = (percentage: number) => {
  return (screenWidth * percentage) / 100;
};

// Function to calculate height percentage
const hp = (percentage: number) => {
  return (screenHeight * percentage) / 100;
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    backgroundColor: "#27446F",
    paddingTop: Platform.OS === "ios" ? hp(5) : hp(3),
    paddingBottom: hp(3),
    paddingHorizontal: wp(5),
    borderBottomLeftRadius: wp(15),
    borderBottomRightRadius: wp(15),
    height: Platform.OS === "ios" ? hp(15) : hp(13),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    padding: wp(1),
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: wp(5.5),
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
    padding: wp(4),
  },
  content: {
    flex: 1,
    paddingBottom: hp(3),
  },
  formContainer: {
    marginTop: hp(0.1),
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(1.5),
    marginBottom: hp(2),
    backgroundColor: "#f9f9f9",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    ...Platform.select({
      ios: {
        height: hp(5),
        justifyContent: "center",
        backgroundColor: "#fff",
      },
    }),
  },
  iosPicker: {
    ...Platform.select({
      ios: {
        height: hp(25),
        marginTop: hp(1),
        width: wp(100),
        color: "#000000",
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp(1.5),
        zIndex: 1000,
        position: "relative",
      },
    }),
  },
  androidPicker: {
    height: hp(6),
    width: wp(100),
    color: "#000000",
  },
  pickerDisplayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
    height: hp(5),
  },
  pickerDisplayText: {
    fontSize: wp(4),
    color: "#000000",
  },
  helpText: {
    color: "#27446F",
    marginBottom: hp(0.5),
  },
  specificInput: {
    height: hp(5),
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: hp(1),
    paddingHorizontal: wp(2.5),
    backgroundColor: "#f0f0f0",
    color: "black",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: hp(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(2.5),
    marginBottom: hp(2),
    backgroundColor: "#ffffff",
  },
  dateText: {
    color: "#000000",
    fontSize: wp(3.7),
  },
  submitButton: {
    alignSelf: "center",
    width: wp(50),
    backgroundColor: "#27446F",
    padding: hp(2),
    borderRadius: wp(5),
    alignItems: "center",
    marginTop: hp(0),
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: wp(4.5),
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: wp(5),
    backgroundColor: "white",
    borderRadius: wp(5),
    padding: wp(9),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: hp(0.2),
    },
    shadowOpacity: 0.25,
    shadowRadius: wp(1),
    elevation: 5,
    borderWidth: wp(0.5),
    borderColor: '#4CAF50',
  },
  modalText: {
    marginBottom: hp(2),
    textAlign: "center",
    fontSize: wp(6),
    fontWeight: "bold",
    color: '#4CAF50',
  },
  modalMessage: {
    marginBottom: hp(2.5),
    textAlign: "center",
    fontSize: wp(4),
    color: '#555555',
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    padding: hp(2),
    borderRadius: wp(2.5),
    alignItems: "center",
    width: wp(80),
    marginTop: hp(1.2),
  },
  modalButtonText: {
    color: "white",
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    right: wp(35.5),
    top: hp(-3),
    padding: wp(1.2),
  },
  subHeaderText: {
    color: "#000000",
    fontSize: wp(3.7),
    textAlign: "center",
    marginTop: hp(0.1),
    marginBottom: hp(2.5),
  },
  agreementText: {
    marginTop: hp(0),
    textAlign: "center",
    color: "black",
    fontSize: wp(3.5),
    marginBottom: hp(2.5),
  },
});
