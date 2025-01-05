import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

export default function LandingPage() {
  const router = useRouter();

  const handleGestureEvent = ({ nativeEvent }: { nativeEvent: { translationY: number, state: number } }) => {
    if (nativeEvent.translationY < -50 && nativeEvent.state === 4) {
      router.push('../(auth)/Login');
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <PanGestureHandler onHandlerStateChange={handleGestureEvent}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/landing-image.png')}
            style={styles.landingImage}
          />
          <TouchableOpacity onPress={() => router.push('../(auth)/login')}>
            <ThemedText style={styles.swipeText}>Swipe up to login</ThemedText>
          </TouchableOpacity>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  landingImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  swipeText: {
    fontSize: 18,
    color: '#000',
  },
});