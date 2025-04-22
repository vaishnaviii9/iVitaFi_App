import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    padding: 25,
  },
  header: {
    backgroundColor: "#27446F",
    paddingVertical: 30,
    paddingHorizontal: 10,
    left: 0.5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    // paddingHorizontal: 10,
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
    color: "green",
    fontSize: 13,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 10,
  },

  addNewPayHeader:{
    fontSize: 18,
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
    backgroundColor: "#27446F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  addMethodButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
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
  },
  submitButton: {
    backgroundColor: "#27446F",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
