import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCreditAccountId,
  clearCreditSummaries,
  clearAutopay,
} from "../features/creditAccount/creditAccountSlice";
import { logout as authLogout } from "../features/login/loginSlice";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, StyleSheet, Pressable, Linking, Alert } from "react-native";
import { router } from "expo-router";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const dispatch = useDispatch();
const { showMakePayment, showMakeAdditionalPayment } = useSelector((state: { buttonVisibility: { showMakePayment: boolean; showMakeAdditionalPayment: boolean } }) => state.buttonVisibility);

  const handleLogout = () => {
    dispatch(clearCreditAccountId());
    dispatch(clearCreditSummaries());
    dispatch(clearAutopay());
    dispatch(authLogout());
    router.push("/(auth)/Login");
  };

  const handleCallPress = () => {
    Linking.openURL("tel:8003412316").catch(() =>
      Alert.alert("Error", "Unable to open dialer. Please try again later.")
    );
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:customercare@amerisbank.ivitafi.com").catch(() =>
      Alert.alert("Error", "Unable to open email client. Please try again later.")
    );
  };

  const handleFaqPress = () => {
    Linking.openURL("https://ivitafinancial.com/faq/#faq").catch(() =>
      Alert.alert("Error", "Unable to open FAQ page. Please try again later.")
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <Pressable onPress={() => router.push("/(tabs)/Home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#37474F" />
        </Pressable>

        <DrawerItem
          label="Profile"
          icon={({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/Profile")}
        />

        <DrawerItem
          label="Manage Payments"
          icon={({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="payments" size={24} color="black" />
          )}
          onPress={() => router.push("/ManagePayments")}
        />

        {showMakePayment && (
          <DrawerItem
            label="Make A Payment"
           icon={({ color, size }: { color: string; size: number }) => (
              <FontAwesome6 name="credit-card" size={24} color="black" />
            )}
            onPress={() => router.push("/MakeAPayment")}
          />
        )}

        {showMakeAdditionalPayment && (
          <DrawerItem
            label="Make Additional Payment"
             icon={({ color, size }: { color: string; size: number }) => (
              <FontAwesome6 name="credit-card" size={24} color="black" />
            )}
            onPress={() => router.push("/MakeAdditionalPayment")}
          />
        )}

        <DrawerItem
          label="Configure Autopay"
          icon={({ color, size }: { color: string; size: number }) => (
            <AntDesign name="checkcircleo" size={24} color="black" />
          )}
          onPress={() => router.push("/ConfigureAutopay")}
        />

        <DrawerItem
          label="Call Us"
          icon={({ color, size }: { color: string; size: number }) => (
            <FontAwesome name="phone" size={size} color={color} />
          )}
          onPress={handleCallPress}
        />

        <DrawerItem
          label="Email Us"
          icon={({ color, size }: { color: string; size: number }) => (
            <Feather name="mail" size={size} color={color} />
          )}
          onPress={handleEmailPress}
        />

        <DrawerItem
          label="FAQ"
          icon={({ color, size }: { color: string; size: number }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          )}
          onPress={handleFaqPress}
        />

        <DrawerItem
          label="Logout"
          icon={({ color, size }: { color: string; size: number }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={handleLogout}
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
