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

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  const logoScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate the logo
    logoScale.value = withSpring(1, { damping: 8, stiffness: 90 });
    // Animate the button
    buttonOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleContinue = () => {
    router.push('../(auth)/Login');
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@/assets/images/ivitafi_logo.png')}
        style={[styles.landingImage, logoStyle]}
      />
      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <ThemedText style={styles.continueText}>Let’s Get Started</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  landingImage: {
    width: width * 0.8, // Set the width to 80% of the screen width
    height: undefined, // Let the height adjust based on the aspect ratio
    aspectRatio: 1, // Adjust the aspect ratio to match your image
    marginBottom: 20,
    resizeMode: 'contain', // Ensure the entire image is visible
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#1F3644',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  continueText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
