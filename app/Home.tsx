import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  Home: {
    firstName: string;
    lastName: string;
  };
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { firstName, lastName } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.nameText}>{firstName} {lastName}</Text>
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