import React, { useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc', // Soft background for aesthetic
  },
  doctorImage: {
    width: width * 0.9, // Set width to 90% of screen width
    height: undefined, // Maintain aspect ratio
    aspectRatio: 1, // Ensure proper scaling
    resizeMode: 'contain', // Keep the image contained
    marginBottom: -90, // Move closer to the logo
  },
  landingImage: {
    width: width * 0.8, // Set the width to 80% of the screen width
    height: undefined, // Let the height adjust based on the aspect ratio
    aspectRatio: 1, // Match your image's aspect ratio
    marginBottom: 1, // Slightly reduced spacing for tighter grouping
    resizeMode: 'contain', // Ensure the entire image is visible
  },
  buttonContainer: {
    marginTop: -60, // Shifted up closer to the images
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#1F3644',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 7, // For Android shadow effect
  },
  continueText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  footerText: {
    marginTop: 30, // Reduced spacing below the button
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});
