import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "expo-router";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* 🔙 Back Button to Home */}
        <Pressable
          onPress={() => navigation.navigate("(tabs)")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#37474F" />
        </Pressable>

        {/* Header Text */}
       

        {/* Profile */}
        <DrawerItem
          label="Profile"
          icon={({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate("Profile")}
        />

        {/* Settings */}
        <DrawerItem
          label="Settings"
          icon={({ color, size }: { color: string; size: number }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate("Settings")}
        />

        {/* Logout */}
        <DrawerItem
          label="Logout"
          icon={({ color, size }: { color: string; size: number }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate("(auth)/login")}
        />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
    alignSelf: "flex-start",
  },
  header: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
 