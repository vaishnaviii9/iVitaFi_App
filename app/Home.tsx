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

const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { firstName, lastName, token } = route.params;

  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);

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
        setCustomerData(customerResponse.data);
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
        <Text style={styles.nameText}>
          Welcome, {firstName} {lastName}
        </Text>
        
      </View>
      <View style={styles.centerContainer}>
        {customerData && (
          <Text style={styles.infoText}>
            Customer Info: {JSON.stringify(customerData)}
          </Text>
        )}
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
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
