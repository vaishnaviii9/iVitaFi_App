import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SkeletonLoader = ({
  style,
  type = "container",
  ...props
}: {
  style?: any;
  type?: string;
  [key: string]: any;
}) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: type === "container" ? ['#e0e0e0', '#f0f0f0'] : ['#b0b0b0', '#d3d3d3'],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        style,
        { backgroundColor },
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default SkeletonLoader;
