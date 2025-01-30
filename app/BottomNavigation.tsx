import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const BottomNavigation = () => {
  return (
    <View style={styles.container}>
      <View style={styles.bottomNavigation}>
        <View style={[styles.navItem,]}>
          <Entypo name="home" size={26} />
          <Text style={[styles.label,]}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="document-text-outline" size={26} color="#5e5f60" />
          <Text style={styles.label}>Statements</Text>
        </View>
        <View style={styles.navItem}>
          <FontAwesome6 name="folder-closed" size={24} color="#5e5f60" />
          <Text style={styles.label}>Documents</Text>
        </View>
        <View style={styles.navItem}>
          <FontAwesome6 name="arrow-right-arrow-left" size={24} color="#5e5f60" />
          <Text style={styles.label}>Transactions</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    bottom: 10,
    backgroundColor: "#fff",
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: .5,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#5e5f60",
    marginTop: 4,
    fontFamily: "Figtree-Regular",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  activeLabel: {
    color: "black",
    fontWeight: "bold",
  },
});

export default BottomNavigation;
