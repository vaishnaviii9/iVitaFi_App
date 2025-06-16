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
  backButton: {
    padding: wp(1),
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: wp(5),
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
    padding: wp(5),
  },
  content: {
    flex: 1,
    paddingBottom: hp(3),
  },
  formContainer: {
    marginTop: hp(2),
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(1.5),
    marginBottom: hp(1.5),
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
        height: hp(30),
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
    height: hp(8),
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
    fontSize: wp(4),
  },
  nonEditableInput: {
    height: hp(5),
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: hp(1),
    paddingHorizontal: wp(2.5),
    backgroundColor: "#E9ECEF",
    color: "#838383",
  },
  specificInput: {
    height: hp(6),
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: hp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: "#fff",
    color: "black",
    fontSize: wp(4),
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: hp(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: wp(1.2),
    paddingHorizontal: wp(3),
    marginBottom: hp(1.5),
    backgroundColor: "#ffffff",
  },
  dateText: {
    color: "#000000",
    fontSize: wp(4),
  },
  submitButton: {
    alignSelf: "center",
    width: wp(50),
    backgroundColor: "#27446F",
    padding: hp(1.5),
    borderRadius: wp(5),
    alignItems: "center",
    marginTop: hp(2),
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
    width:wp(90), 
    margin: wp(1),
    backgroundColor: "white",
    borderRadius: wp(5),
    padding: wp(8),
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
    borderColor: 'green',
  },
  modalText: {
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
    textAlign: "center",
    fontSize: wp(6),
    fontWeight: "bold",
    color: 'green',
  },
  modalMessage: {
    marginBottom: hp(2),
    textAlign: "center",
    fontSize: wp(4),
    color: '#555555',
  },
  modalButton: {
    backgroundColor: "green",
    padding: hp(1.5),
    borderRadius: wp(2.5),
    alignItems: "center",
    width: wp(35),
    marginTop: hp(1),
  },
  modalButtonText: {
    color: "white",
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    left: wp(32.5),
    top: hp(-3),
    padding: wp(1.2),
  },
  agreementText: {
    marginTop: hp(2),
    textAlign: "center",
    color: "black",
    fontSize: wp(3.5),
    marginBottom: hp(2),
  },
   submitButtonDisabled: {
    opacity: 0.6, // This makes the button appear faint
  },
});
