import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  return (
    <View style={styles.screenContainer}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000000", // Darker black for the active tab
          tabBarInactiveTintColor: "#808080", // Dark gray for inactive tabs
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }: { color: string }) => (
              <Entypo name="home" size={26} color={color} />
            ),
          }}
        />

        {/* Documents Tab */}
        <Tabs.Screen
          name="Documents"
          options={{
            title: "Documents",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome6 name="folder-closed" size={24} color={color} />
            ),
          }}
        />

        {/* Statements Tab */}
        <Tabs.Screen
          name="Statements"
          options={{
            title: "Statements",
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="document-text-outline" size={26} color={color} />
            ),
          }}
        />

        {/* Transactions Tab */}
        <Tabs.Screen
          name="Transactions"
          options={{
            title: "Transactions",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome6 name="arrow-right-arrow-left" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff", // Set a consistent background color for light mode
  },
  tabBar: {
    position: "fixed", // Ensure proper alignment at the bottom
    width: "95%",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#fff", // White tab bar background
    borderRadius: 40,
    height: 69,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 55,
    borderTopWidth: 0, // Remove the default border line
  },
  tabBarItem: {
    flex: 1,
    marginTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
