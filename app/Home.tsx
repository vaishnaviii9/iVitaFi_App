import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';


type RootStackParamList = {
  Home: {
    firstName: string;
    lastName: string;
    token: string;
  };
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

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
        const userResponse = await axios.get('https://dev.ivitafi.com/api/User/current-user', {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
        });
        setUserData(userResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    const fetchCustomerData = async () => {
      try {
        const customerResponse = await axios.get('https://dev.ivitafi.com/api/customer/current/true', {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
        });
        const customerResponseData = customerResponse.data;
        setCustomerData(customerResponseData);
        // console.log(customerResponseData);

        if (customerResponseData.creditAccounts) {
          const accountNumbers = customerResponseData.creditAccounts.map((application: CreditApplication) => application.accountNumber);
          setAccountNumbers(accountNumbers);
          // console.log(accountNumbers);
          
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        Alert.alert('Error', 'Failed to fetch customer data.');
      }
    };

    fetchUserData();
    fetchCustomerData();
  }, [token]);

  return (
    <View style={styles.container}>
      {/* Avatar Container */}
      <View style={styles.avatarContainer}>
        <Avatar
          size="medium"          
          rounded
          title={`${firstName[0]}${lastName[0]}`} // Initials as avatar title
          containerStyle={styles.avatar}
          titleStyle={{ color: 'white' }}
        />
        <Text style={styles.nameText}>
          Welcome, {firstName} {lastName}
        </Text>
      </View>

      {/* Box Container */}
      <View style={styles.boxContainer}>
     
        {accountNumbers.map((accountNumber, index) => (
          <Text key={index} style={styles.accountNumberText}>Account Number: {accountNumber}</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop:30, // Add spacing below avatar
    paddingHorizontal: 20, // Horizontal padding for better alignment
  },
  avatar: {
    backgroundColor: '#517fa4', // Background color for the avatar
    marginRight: 10, // Space between avatar and text
  },
  nameText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },  
  accountNumberText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  boxContainer: {
    width: 377,
    height: 153,
    backgroundColor: '#2D4768',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: 294,
    height: 64,
    backgroundColor: '#2D4768',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  additionalPaymentText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '600',
    textAlign: 'center',
  },
  
});

export default HomeScreen;