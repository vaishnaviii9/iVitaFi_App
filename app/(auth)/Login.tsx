import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('https://dev.ivitafi.com/api/User/authenticate', {
        email,
        password,
      });
  
      if (response.data.token) {
        const { firstName, lastName } = response.data.user;
        navigation.navigate('Home', { firstName, lastName, token: response.data.token }); // Pass the token to Home
      } else {
        Alert.alert('Error', response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Redirect to password recovery page.');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://ivitafinancial.com/terms-of-service/');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://ivitafinancial.com/privacy-policy/');
  };

  const handleFAQ = () => {
    Linking.openURL('https://ivitafinancial.com/faq/#faq');
  };

  return (
    <View style={styles.outerContainer}>
      <Image
        style={styles.logo}
        source={require('../../assets/images/Ameris_bank_text_logo.png')}
      />
      <Text style={styles.title}>Ameris Bank Healthcare Financing</Text>
      <TextInput
        style={styles.input}
        placeholder="Email ID"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="#aaa" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
      )}
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={handleTermsOfService}>
          <Text style={styles.footerText}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}> | </Text>
        <TouchableOpacity onPress={handlePrivacyPolicy}>
          <Text style={styles.footerText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}> | </Text>
        <TouchableOpacity onPress={handleFAQ}>
          <Text style={styles.footerText}>FAQ</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.poweredBy}>Powered by</Text>
      <Image
        style={styles.poweredByLogo}
        source={require('../../assets/images/ivitafi_logo.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFFFF',
    padding: 16,
  },
  logo: {
    width: 91,
    height: 95,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    color: '#141218',
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: 0.20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#FEFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute', // Use absolute positioning to place the icon
    right: 10, // Adjust this value based on your layout
    top: '40%', // Center vertically within the parent container
    transform: [{ translateY: -12 }], // Offset by half the icon's height to align vertically
    zIndex: 1, // Ensure it's above other elements if overlapping occurs
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#232126',
    fontSize: 15,
    fontFamily: 'Montserrat',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.20,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#1F3644',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: 0.20,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#151616',
    fontSize: 15,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: 0.20,
  },
  poweredBy: {
    textAlign: 'center',
    color: 'black',
    fontSize: 15,
    fontFamily: 'Montserrat',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.20,
    marginBottom: 10,
  },
  poweredByLogo: {
    width: 102,
    height: 37,
  },
});

export default LoginScreen;