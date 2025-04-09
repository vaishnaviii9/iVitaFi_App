import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, StyleSheet, Pressable, Linking, Alert } from "react-native";
import { useNavigation } from "expo-router";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const navigation = useNavigation();

  const handleCallPress = () => {
    Linking.openURL('tel:8003412316')
      .catch(() => Alert.alert('Error', 'Unable to open dialer. Please try again later.'));
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:customercare@amerisbank.ivitafi.com')
      .catch(() => Alert.alert('Error', 'Unable to open email client. Please try again later.'));
  };

  const handleFaqPress = () => {
    Linking.openURL('https://ivitafinancial.com/faq/#faq')
      .catch(() => Alert.alert('Error', 'Unable to open FAQ page. Please try again later.'));
  };

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

        {/* Profile */}
        <DrawerItem
          label="Profile"
          icon={({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate("Profile")}
        />

        {/* Manage Payments */}
        <DrawerItem
          label="Manage Payments"
          icon={({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="payments" size={24} color="black" />
          )}
          onPress={() => navigation.navigate("ManagePayments")}
        />

        {/* Make Payment */}
        <DrawerItem
          label="Make Payment"
          icon={({ color, size }: { color: string; size: number }) => (
            <FontAwesome6 name="credit-card" size={24} color="black" />
          )}
          onPress={() => navigation.navigate("MakePayment")}
        />

        {/* Configure Autopay */}
        <DrawerItem
          label="Configure Autopay"
          icon={({ color, size }: { color: string; size: number }) => (
            <AntDesign name="checkcircleo" size={24} color="black" />
          )}
          onPress={() => navigation.navigate("ConfigureAutopay")}
        />

        {/* Call Us */}
        <DrawerItem
          label="Call Us"
          icon={({ color, size }: { color: string; size: number }) => (
            <FontAwesome name="phone" size={size} color={color} />
          )}
          onPress={handleCallPress}
        />

        {/* Email Us */}
        <DrawerItem
          label="Email Us"
          icon={({ color, size }: { color: string; size: number }) => (
            <Feather name="mail" size={size} color={color} />
          )}
          onPress={handleEmailPress}
        />

        {/* FAQ */}
        <DrawerItem
          label="FAQ"
          icon={({ color, size }: { color: string; size: number }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          )}
          onPress={handleFaqPress}
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
