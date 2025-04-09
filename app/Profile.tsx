import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

const ProfileScreen = () => {
  const handleBackPress = () => {
    router.push("/(tabs)/Home");
  };

  const handleEditPress = () => {
    // Implement your edit functionality here
    console.log("Edit pressed");
  };

  const detailItems = [
    { label: "First Name", value: "Amy", icon: <FontAwesome name="user" size={24} color="#000" /> },
    { label: "Last Name", value: "Young", icon: <FontAwesome name="user" size={24} color="#000" /> },
    { label: "Date of Birth", value: "January 1, 1990", icon: <FontAwesome name="calendar" size={24} color="#000" /> },
    { label: "SSN", value: "123-45-6789", icon: <Feather name="hash" size={24} color="#000" /> },
    { label: "Mobile Phone", value: "+98 1245560090", icon: <Feather name="phone" size={24} color="#000" /> },
    { label: "Home Phone", value: "+98 1234567890", icon: <Feather name="phone-call" size={24} color="#000" /> },
    { label: "Physical Address", value: "123 Main St", icon: <Entypo name="address" size={24} color="#000" /> },
    { label: "Mailing Address", value: "456 Elm St", icon: <Entypo name="mail" size={24} color="#000" /> },
    { label: "City", value: "Springfield", icon: <MaterialIcons name="location-city" size={24} color="#000" /> },
    { label: "State", value: "IL", icon: <MaterialIcons name="map" size={24} color="#000" /> },
    { label: "Zip", value: "62701", icon: <FontAwesome name="envelope" size={24} color="#000" /> },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerItems }>
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
    // alignItems: "center",
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

  headerItems:{
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
  avatar:{
    alignItems: "center",
    justifyContent: "center",
  }
  

});

export default ProfileScreen;
 