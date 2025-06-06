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
  headerText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    paddingBottom: 25,
  },
  formContainer: {
    marginTop: 20,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    ...Platform.select({
      ios: {
        height: 40,
        justifyContent: "center",
        backgroundColor: "#fff",
      },
    }),
  },
  iosPicker: {
    ...Platform.select({
      ios: {
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
    }),
  },
  androidPicker: {
    height: 50,
    width: "100%",
    color: "#000000",
  },
  pickerDisplayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 40,
  },
  pickerDisplayText: {
    fontSize: 16,
    color: "#000000",
  },
  helpText: {
    color: "#27446F",
    marginBottom: 5,
  },
  specificInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
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
