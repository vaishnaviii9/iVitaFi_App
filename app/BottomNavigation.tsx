import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import styles from "./BottomNavigationStyles";
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



export default BottomNavigation;
