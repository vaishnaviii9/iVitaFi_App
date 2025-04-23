import React, { useEffect } from 'react';
import { Image, TouchableOpacity, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import styles from '../../components/styles/IndexStyles'; // Import the styles from the new file

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export default function LandingPage() {
  const router = useRouter(); // Router for navigation

  // Shared values for animations
  const logoScale = useSharedValue(0); // Initial scale for logo animation
  const buttonOpacity = useSharedValue(0); // Initial opacity for button animation

  useEffect(() => {
    // Animate the logo scale
    logoScale.value = withSpring(1, { damping: 8, stiffness: 90 });
    // Animate the button opacity
    buttonOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
  }, []); // Run animation on component mount

  // Animated styles for the images
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }], // Scale animation
  }));

  // Animated style for the button
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value, // Opacity animation
  }));

  // Handle continue button press
  const handleContinue = () => {
    router.push('../(auth)/Login'); // Navigate to Login screen
  };

  return (
    <View style={styles.container}>
      {/* Animated doctor image */}
      <Animated.Image
        source={require('../../assets/images/Doctor.png')} // Add the Doctor.png image
        style={[styles.doctorImage, imageStyle]} // Apply shared animation style
      />
      {/* Animated logo image */}
      <Animated.Image
        source={require('../../assets/images/ivitafi_logo.png')} // Existing logo
        style={[styles.landingImage, imageStyle]} // Apply shared animation style
      />
      {/* Animated button container */}
      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        {/* Continue button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <ThemedText style={styles.continueText}>Let’s Get Started</ThemedText>
        </TouchableOpacity>
        {/* Footer text */}
        <ThemedText style={styles.footerText}>
          Powered by iVitaFinancial and Ameris Bank
        </ThemedText>
      </Animated.View>
    </View>
  );
}
