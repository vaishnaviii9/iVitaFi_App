import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../Profile"; // Adjust the import path as necessary
import SettingsScreen from "../Settings"; // Adjust the import path as necessary
import CustomDrawerContent from "../../components/CustomDrawerContent";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 250,
        },
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#888",
        drawerPosition: "right",
      }}
    >
    
    <Drawer.Screen name="(tabs)" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="Profile" options={{ title: "My Profile" }} />
      <Drawer.Screen name="Settings" options={{ title: "Settings" }} />
    </Drawer.Navigator>
  );
}
