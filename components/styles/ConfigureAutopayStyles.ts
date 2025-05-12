import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  headerContainer: {
    backgroundColor: "#27446F",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: 130,
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
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderRadius: 15,
    height: 180,
    width: '100%',
    backgroundColor: '#c5c5c8',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 180,
    color: '#fff',
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
    }),
  },
  pickerItem: {
    color: '#000000',
    fontSize: 20,
  },
  helpText: {
    color: '#27446F',
    marginBottom: 5,
  },
  helpLink: {
    color: '#27446F',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#27446F',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#27446F',
    fontSize: 16,
  },
});
