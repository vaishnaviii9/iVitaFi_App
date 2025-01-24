import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './LoginStyles'; // Import the styles

const LoginScreen = () => {
  // State variables for email, password, loading, and password visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation<any>();

  // Handle login button press
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

  // Handle forgot password link press
  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Redirect to password recovery page.');
  };

  // Handle terms of service link press
  const handleTermsOfService = () => {
    Linking.openURL('https://ivitafinancial.com/terms-of-service/');
  };

  // Handle privacy policy link press
  const handlePrivacyPolicy = () => {
    Linking.openURL('https://ivitafinancial.com/privacy-policy/');
  };

  // Handle FAQ link press
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginButtonText}>Sign In</Text>
      </TouchableOpacity>
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

export default LoginScreen;