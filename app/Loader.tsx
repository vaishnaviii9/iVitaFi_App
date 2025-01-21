import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const Loader: React.FC = () => {
  const animations = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    animations.forEach((animation, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            delay: index * 200, // Delay for sequential effect
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [animations]);

  return (
    <View style={styles.container}>
      {animations.map((animation, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10], // Bouncing effect
                  }),
                },
              ],
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  dot: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#3498db',
  },
});

export default Loader;
