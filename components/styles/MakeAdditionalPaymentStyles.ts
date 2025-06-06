import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
     backgroundColor: "#27446F",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: Platform.OS === "ios" ? 150 : 130,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTextContainer: {
    flex: 1, // This will allow the container to take up available space
    alignItems: 'center', // Center the items horizontally
    justifyContent: 'center', // Center the items vertically

  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    // other styles for headerText
  },
  subHeaderText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5, // Add some margin to separate the header and subheader
    // other styles for subHeaderText
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerDisplayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  pickerDisplayText: {
    color: "black",
  },
  iosPicker: {
    position: "absolute",
    top: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  androidPicker: {
    width: "100%",
    height: 50,
  },
  helpText: {
    marginBottom: 5,
    color: "#000",
  },
  specificInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    color: "black",
  }, 
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
   dateText: {
    color: "#000000",
    fontSize: 15,
  },
   submitButton: {
    alignSelf: "center",
    width: "50%",
    backgroundColor: "#27446F",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});