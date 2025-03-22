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
import { ThemedText } from '@/components/ThemedText';
import styles from '../../components/styles/IndexStyles'; // Import the styles from the new file

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  // Shared values for animations
  const logoScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate the logo scale
    logoScale.value = withSpring(1, { damping: 8, stiffness: 90 });
    // Animate the button opacity
    buttonOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
  }, []);

  // Animated styles for the images
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  // Animated style for the button
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  // Handle continue button press
  const handleContinue = () => {
    router.push('../(auth)/Login');
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@/assets/images/Doctor.png')} // Add the Doctor.png image
        style={[styles.doctorImage, imageStyle]} // Apply shared animation style
      />
      <Animated.Image
        source={require('@/assets/images/ivitafi_logo.png')} // Existing logo
        style={[styles.landingImage, imageStyle]} // Apply shared animation style
      />
      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <ThemedText style={styles.continueText}>Let’s Get Started</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.footerText}>
          Powered by iVitaFinancial and Ameris Bank
        </ThemedText>
      </Animated.View>
    </View>
  );
}
