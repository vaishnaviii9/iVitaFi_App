// components/CustomDrawerContent.tsx
import React from "react";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import type { DrawerNavigationProp } from '@react-navigation/drawer';


export default function CustomDrawerContent(props: any) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View
    style={{flex:1
    }}>
<DrawerContentScrollView {...props}>
<DrawerItem label="Dashboard" onPress={() => navigation.navigate('(tabs)')} />
<DrawerItem label="Profile" onPress={() => navigation.navigate('Profile')} />
<DrawerItem label="Settings" onPress={() => navigation.navigate('Settings')} />
<DrawerItem label="Logout" onPress={() => navigation.navigate('(auth)/login')} />

</DrawerContentScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
