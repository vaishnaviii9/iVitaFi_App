import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    backgroundColor: "#27446F",
    paddingVertical: 60,
    paddingHorizontal: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    position: "relative",
  },
  headerContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  savedMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#CACBCC",
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
  },
  savedMethodImage: {
    marginRight: 20,
  },
  savedMethodTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  savedMethodLabel: {
    color: "#1C1C1D",
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 3,
  },
  defaultLabel: {
    backgroundColor: "#4CAF50",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginTop: 0.2,
    alignSelf: "flex-start",
  },
  defaultLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  deleteButton: {
    padding: 10,
  },
  addNewPayHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 30,
  },
  addMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addMethodButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#27446F",
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  addMethodButtonText: {
    textAlign: "center",
    color: "#27446F",
    fontSize: 16,
  },
  selectedMethodButton: {
    backgroundColor: "#27446F",
    borderColor: "#27446F",
    borderWidth: 2,
  },
  selectedMethodButtonText: {
    color: "#FFFFFF",
  },
  inputFieldContainer: {
    marginBottom: 15,
  },
  inputFieldLabel: {
    fontSize: 16,
    color: "#1C1C1D",
    marginBottom: 5,
  },
  inputField: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#707073",
  },
  inputFieldError: {
    borderColor: "red",
  },
  defaultPaymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  defaultPaymentMethodText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  submitButtonContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: "#27446F",
    paddingVertical: 15,
    paddingHorizontal: 30,
   borderRadius: wp("2.5%"),
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
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
  okButton: {
    marginTop: 20,
    backgroundColor: "#27446F",
   borderRadius: wp("2.5%"),
    paddingVertical: 10,
    alignItems: "center",
  },
  okButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    marginVertical: 10,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#27446F",
    padding: 10,
    borderRadius: wp("2.5%"),
    width: "40%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    
  },
  expirationLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFF",
    marginTop: 2,
  },
  skeletonLoaderContainer: {
    marginBottom: 20,
  },
  skeletonLoaderItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
  },
  skeletonLoaderImage: {
    width: 28,
    height: 28,
    backgroundColor: "#CCC",
    marginRight: 20,
    borderRadius: 5,
  },
  skeletonLoaderTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  skeletonLoaderText: {
    height: 15,
    backgroundColor: "#CCC",
    borderRadius: 5,
    marginBottom: 5,
  },
  inputFieldText: {
    color: "#000000",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    height: 40,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  pickerText: {
    fontSize: 16,
    color: "#707073",
  },
  iosPicker: {
    height: 200,
    marginTop: 8,
    width: "100%",
    color: "#000000",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    zIndex: 1000,
    position: "relative",
  },
  androidPicker: {
    height: 50,
    width: "100%",
    color: "#000000",
  },
  pickerItem: {
    color: "#000000",
    fontSize: 20,
  },
  editButton: {
    marginRight: 10,
  },
  modalCloseIcon: {
    color: "#FFFFFF",
  },
  modalCloseIconContainer: {
    padding: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  helpTextContainer: {
    marginTop: 1,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  helpText: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginVertical: 10,
  },
});

export default styles;
