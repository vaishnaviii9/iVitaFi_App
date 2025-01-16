import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
        console.log(customerResponseData);

        if (customerResponseData.creditAccounts) {
          const accountNumbers = customerResponseData.creditAccounts.map((application: CreditApplication) => application.accountNumber);
          setAccountNumbers(accountNumbers);
          console.log(accountNumbers);
          
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
      <View style={styles.topContainer}>
        <Text style={styles.nameText}>Welcome {firstName} {lastName}!</Text>
        {accountNumbers.map((accountNumber, index) => (
          <Text key={index} style={styles.accountNumberText}>Account Number: {accountNumber}</Text>
        ))}
      </View>
      <View style={styles.centerContainer}>
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
    justifyContent: 'flex-start', // Move content to the top
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20, // Add some padding at the top if needed
  },
  topContainer: {
    width: 378,
    height: 299,
    backgroundColor: '#2D4768',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 30, // Add margin at the top to move it down
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  accountNumberText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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