import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from '../../components/styles/LoginStyles'; // Import the styles
import { authenticateUser } from '../services/authService'; // Authentication service
import { resetPasswordService } from '../services/resetPasswordService'; // Reset password service
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/login/loginSlice'; // Redux action for login success
import { router } from 'expo-router'; // Use expo-router for navigation

const LoginScreen = () => {
  // State variables for form inputs and UI behavior
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle forgot password flow
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('Enter your email to receive a reset password link.');

  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();

  // Handle login button press
  const handleLogin = async () => {
    setErrorMessage(''); // Clear error message before login attempt

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const data = await authenticateUser(email, password); // Authenticate user

      if (data.token) {
        const { firstName, lastName } = data.user;
        dispatch(loginSuccess({ firstName, lastName, token: data.token })); // Dispatch login success action
        router.push('/(tabs)/Home'); // Navigate to Home screen
      } else {
        setErrorMessage('Email or password incorrect.'); // Fallback error message
      }
    } catch (error) {
      console.error('Login error:', error);

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setErrorMessage('Email or password incorrect.');
        } else {
          setErrorMessage('Email or password incorrect.');
        }
      } else {
        setErrorMessage('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handle forgot password button press
  const handleForgotPassword = () => {
    setIsForgotPassword(true); // Switch to forgot password flow
  };

  // Handle forgot password form submission
  const handleForgotPasswordSubmit = async () => {
    if (!email) {
      setForgotPasswordMessage('Please enter your email address.');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      await resetPasswordService(email); // Call reset password service
      setForgotPasswordMessage(`An email has been sent to ${email} if the account exists.`);
      setEmail(''); // Clear email input
    } catch (error) {
      console.error('Forgot password error:', error);
      setForgotPasswordMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handle Terms of Service link press
  const handleTermsOfService = () => {
    Linking.openURL('https://ivitafinancial.com/terms-of-service/');
  };

  // Handle Privacy Policy link press
  const handlePrivacyPolicy = () => {
    Linking.openURL('https://ivitafinancial.com/privacy-policy/');
  };

  // Handle FAQ link press
  const handleFAQ = () => {
    Linking.openURL('https://ivitafinancial.com/faq/#faq');
  };

  return (
    <View style={styles.outerContainer}>
      {/* App logo */}
      <Image
        style={styles.logo}
        source={require('../../assets/images/Ameris_bank_text_logo.png')}
      />
      <Text style={styles.title}>Ameris Bank Healthcare Financing</Text>

      {isForgotPassword ? (
        // Forgot Password UI
        <>
          <Text style={styles.forgotPassword}>{forgotPasswordMessage}</Text>
          <TextInput
            style={styles.input}
            placeholder="Email ID"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleForgotPasswordSubmit}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsForgotPassword(false)}>
            <Text style={styles.forgotPassword}>Back to Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Login UI
        <>
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
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Footer links */}
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