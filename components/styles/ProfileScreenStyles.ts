
// ProfileScreen.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    backgroundColor: "#27446F",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: 250,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
    top: 35,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    top: 35,
  },
  headerItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 45,
  },
  icon: {
    marginRight: 40,
    width: 80,
    alignItems: "center",
  },
  label: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "600",
  },
  value: {
    color: "#333333",
    fontSize: 18,
  },
  input: {
    fontSize: 18,
    color: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingVertical: 4,
    minWidth: 200,
  },
  avatarIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#27446F",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default styles;
