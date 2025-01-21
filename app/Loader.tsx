import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const Loader: React.FC = () => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  const animatedStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
      },
    ],
    backgroundColor: animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fff', '#fff2'],
    }),
  };

  return <Animated.View style={[styles.loader, animatedStyle]} />;
};

const styles = StyleSheet.create({
  loader: {
    width: 15,
    aspectRatio: 1,
    borderRadius: 50,
  },
});

export default Loader;