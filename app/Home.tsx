import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import axios from "axios";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';


type RootStackParamList = {
  Home: {
    firstName: string;
    lastName: string;
    token: string;
  };
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

interface CreditApplication {
  accountNumber: string;
}

const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { firstName, lastName, token } = route.params;

  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          "https://dev.ivitafi.com/api/User/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      }
    };

    const fetchCustomerData = async () => {
      try {
        const customerResponse = await axios.get(
          "https://dev.ivitafi.com/api/customer/current/true",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const customerResponseData = customerResponse.data;
        setCustomerData(customerResponseData);

        if (customerResponseData.creditAccounts) {
          const accountNumbers = customerResponseData.creditAccounts.map(
            (application: CreditApplication) => application.accountNumber
          );
          setAccountNumbers(accountNumbers);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        Alert.alert("Error", "Failed to fetch customer data.");
      }
    };

    fetchUserData();
    fetchCustomerData();
  }, [token]);



  return (
    <View style={styles.container}>
      
      
      
      {/* Updated Avatar Container */}
      <View style={styles.headerContainer}>

       <View style={styles.iconandTextContainer}>
  <Animated.Image
    source={require('@/assets/images/profile.png')} // Add the avatar.png image
    style={styles.avatarIcon} // Apply shared animation style
  />
  <View style={styles.infoContainer}>
  <Text style={styles.userName}>{firstName}</Text>
  <Text style={styles.welcomeText}>Welcome to IvitaFi</Text>
</View>
</View> 
  
  <Animated.Image
    source={require('@/assets/images/menus.png')} // Add the hamburger.png image
    style={styles.hamBurgerIcon} // Apply shared animation style
  />
</View>


      {/* Box Container */}
      <View style={styles.boxContainer}>
        {accountNumbers.map((accountNumber, index) => (
          <Text key={index} style={styles.accountNumberText}>
            Account Number: {accountNumber}
          </Text>
        ))}
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.additionalPaymentText}>Make Additional Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    height: 60,
    marginTop: 25,
    
  },

iconandTextContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap:8
},  
  hamBurgerIcon: {
    width: 50,
    position: 'relative',
    maxWidth: '10%',
    overflow: 'hidden',
    height:27,
    objectFit:'cover',
  },
  avatarIcon: {
    width:50,
    position: 'relative',
    height:50,
    objectFit:'cover',
  },
  infoContainer: {
    width:169,
    height:40,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent:"flex-start",
    gap: 6,
  },
  userName: {
    width:180,
    position: 'relative',
    lineHeight: 20,
    fontWeight: "600",
    display:'flex',
    fontSize: 18,
    alignItems:'center',
    marginTop: 5,
  },
  welcomeText: {
    fontWeight: "500",
    fontSize: 17,
    color: "#757575",
    fontFamily: "Inter-Regular",
  },
  boxContainer: {
    width: 378,
    height: 200,
    backgroundColor: "#2D4768",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  accountNumberText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: 294,
    height: 64,
    backgroundColor: "#2D4768",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  additionalPaymentText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default HomeScreen;
