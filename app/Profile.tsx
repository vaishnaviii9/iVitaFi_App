import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { fetchUserData } from "./services/userService"; // Adjust the import path as necessary

const ProfileScreen = () => {
  interface UserData {
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    ssn: string | null;
    mobilePhone: string | null;
    homePhone: string | null;
    physicalAddress: string | null;
    mailingAddress: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    email: string | null; // Add email to the UserData interface
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(token, setUserData);
      if (data) {
        const mappedData: UserData = {
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          dateOfBirth: data.customer?.dateOfBirth ? new Date(data.customer.dateOfBirth).toLocaleDateString() : null,
          ssn: formatSSN(data.customer?.taxId) || null,
          mobilePhone: formatPhoneNumber(data.customer?.mobilePhone) || null,
          homePhone: data.customer?.homePhone || null,
          physicalAddress: data.customer?.streetAddress || null,
          mailingAddress: data.customer?.streetAddressOptional || null,
          city: data.customer?.city || null,
          state: formatState(data.customer?.state) || null,
          zip: data.customer?.zipCode || null,
          email: data.email || null, // Map the email from the fetched data
        };
        setUserData(mappedData);
        // console.log("Mapped user data:", mappedData);
      }
    };

    getUserData();
  }, [token]);

  const handleBackPress = () => {
    router.push("/(tabs)/Home");
  };

  const handleEditPress = () => {
    // Implement your edit functionality here
    console.log("Edit pressed");
  };

  const formatSSN = (ssn: string | null): string | null => {
    if (!ssn) return null;
    return `xxx-xx-${ssn.slice(-4)}`;
  };

  const formatPhoneNumber = (phone: string | null): string | null => {
    if (!phone) return null;
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return null;
  };

  const formatState = (state: string | null): string | null => {
    if (!state) return null;
    const stateAbbreviations: { [key: string]: string } = {
      OH: "Ohio",
      // Add other state abbreviations as needed
    };
    return stateAbbreviations[state] ? `${state} - ${stateAbbreviations[state]}` : state;
  };

  const detailItems = [
    { label: "First Name", value: userData?.firstName ?? "-", icon: <FontAwesome name="user" size={24} color="#000" /> },
    { label: "Last Name", value: userData?.lastName ?? "-", icon: <FontAwesome name="user" size={24} color="#000" /> },
    { label: "Date of Birth", value: userData?.dateOfBirth ?? "-", icon: <FontAwesome name="calendar" size={24} color="#000" /> },
    { label: "SSN", value: userData?.ssn ?? "-", icon: <Feather name="hash" size={24} color="#000" /> },
    { label: "Email", value: userData?.email ?? "-", icon: <MaterialIcons name="email" size={24} color="#000" /> },
    { label: "Mobile Phone", value: userData?.mobilePhone ?? "-", icon: <Feather name="phone" size={24} color="#000" /> },
    { label: "Home Phone", value: userData?.homePhone ?? "-", icon: <Feather name="phone-call" size={24} color="#000" /> },
    { label: "Physical Address", value: userData?.physicalAddress ?? "-", icon: <Entypo name="address" size={24} color="#000" /> },
    { label: "Mailing Address", value: userData?.mailingAddress ?? "-", icon: <Entypo name="mail" size={24} color="#000" /> },
    { label: "City", value: userData?.city ?? "-", icon: <MaterialIcons name="location-city" size={24} color="#000" /> },
    { label: "State", value: userData?.state ?? "-", icon: <MaterialIcons name="map" size={24} color="#000" /> },
    { label: "Zip", value: userData?.zip ?? "-", icon: <FontAwesome name="envelope" size={24} color="#000" /> },

  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerItems}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
          <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
            <Feather name="edit" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatar}>
          <Image source={require("../assets/images/profile.png")} style={styles.avatarIcon} />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {detailItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.icon}>{item.icon}</View>
              <View>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

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
  editButton: {
    padding: 4,
    top: 35,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    top: 35,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerItems: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
    marginTop: 30,
    marginBottom: 40,
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
  avatarIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  }
});

export default ProfileScreen;
