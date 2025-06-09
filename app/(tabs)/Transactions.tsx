import React, { useEffect, useRef,useCallback, useState } from 'react';
import { View, Text, Pressable, Animated, } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import Pending from '../../features/transactions/PendingTransactions'; // Import the Pending component
import Posted from '../../features/transactions/PostedTransactions'; // Import the Posted component
import styles from '../../components/styles/TransactionStyles';
import { useFocusEffect } from '@react-navigation/native';
// Create a material top tab navigatimport { useFocusEffect } 
const Tab = createMaterialTopTabNavigator();

/**
 * AnimatedTabLabel: A functional component to animate the tab label color based on focus.
 * @param {boolean} focused - Indicates if the tab is focused.
 * @param {string} title - The title of the tab.
 */
const AnimatedTabLabel: React.FC<{ focused: boolean; title: string }> = ({ focused, title }) => {
  // Ref to hold the animated value for color interpolation
  const colorAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  // Effect to animate the color when focus changes
  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: focused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  // Interpolate the color based on the animated value
  const colorInterpolation = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['black', 'white']
  });

  // Return the animated text
  return (
    <Animated.Text style={{ fontSize: 14, fontWeight: 'bold', color: colorInterpolation }}>
      {title}
    </Animated.Text>
  );
};

/**
 * MyTabs: A functional component to render the tab navigator with animated labels.
 */
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } } & MaterialTopTabNavigationOptions) => ({
        // Style for the tab bar
        tabBarStyle: {
          backgroundColor: '#fff',
          borderRadius: 20,
          marginHorizontal: 5,
          marginTop: 10,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        // Style for the tab indicator
        tabBarIndicatorStyle: {
          backgroundColor: '#37474F',
          height: '100%',
          borderRadius: 20,
        },
        // Custom tab label with animation
        tabBarLabel: ({ focused }: { focused: boolean }) => <AnimatedTabLabel focused={focused} title={route.name} />,
      })}
    >
      {/* Define the tabs and their respective components */}
      <Tab.Screen name="Pending" component={Pending} />
      <Tab.Screen name="Posted" component={Posted} />
    </Tab.Navigator>
  );
}

/**
 * Transactions: The main component to render the Transactions screen with a header and tabs.
 */
const Transactions = () => {
  const navigation = useNavigation(); // Hook to access navigation
  const [refresh, setRefresh] = useState(false);
useFocusEffect(
    useCallback(() => {
      // This function will be called whenever the screen comes into focus
      setRefresh(prev => !prev); // Toggle the refresh state to trigger a re-render
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#37474F" />
        </Pressable>
        <Text style={styles.title}>Transactions</Text>
      </View>
      {/* Container for the tab navigator */}
      <View style={styles.recordsContainer}>
       <MyTabs key={refresh.toString()} />
      </View>
    </View>
  );
};

export default Transactions;
