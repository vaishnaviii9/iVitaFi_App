import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../Profile";
import CustomDrawerContent from "../../components/CustomDrawerContent";
import HomeScreen from "../(tabs)/Home"; // Ensure this is correctly imported
import ManagePayments from '../ManagePayments';
import MakePayment from "../MakeAPayment";
import ConfigureAutopay from "../ConfigureAutopay";
// import CallUs from '../CallUs'; // Import the new CallUs screen
// import EmailUs from '../EmailUs'; // Import the new EmailUs screen
// import FAQ from '../FAQ'; // Import the new FAQ screen

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  const navigation = useNavigation();

  const handleBackPress = () => {
    Alert.alert("Navigating to Home");
    navigation.navigate("Home"); // Ensure this is the correct navigation action
  };

  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        headerShown: true,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 250,
        },
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#888",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={28} color="#37474F" />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: "My Profile" }} />
      <Drawer.Screen name="Manage Payments" component={ManagePayments} options={{ title: "Manage Payments" }} />
      <Drawer.Screen name="Make A Payment" component={MakePayment} options={{ title: "Make A Payment" }} />
      <Drawer.Screen name="Configure Autopay" component={ConfigureAutopay} options={{ title: "Configure Autopay" }} />

    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: 10, // Adjust as needed
    fontWeight: "bold",
  },
});
