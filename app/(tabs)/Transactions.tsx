import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import Pending from '../PendingTransactions'; // Import the Pending component
import Posted from '../PostedTransactions'; // Import the Posted component
import styles from '../../components/styles/TransactionStyles';

const Tab = createMaterialTopTabNavigator();

const AnimatedTabLabel: React.FC<{ focused: boolean; title: string }> = ({ focused, title }) => {
  const colorAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: focused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const colorInterpolation = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['black', 'white']
  });

  return (
    <Animated.Text style={{ fontSize: 14, fontWeight: 'bold', color: colorInterpolation }}>
      {title}
    </Animated.Text>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } } & MaterialTopTabNavigationOptions) => ({
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
        tabBarIndicatorStyle: {
          backgroundColor: '#37474F',
          height: '100%',
          borderRadius: 20,
        },
        tabBarLabel: ({ focused }: { focused: boolean }) => <AnimatedTabLabel focused={focused} title={route.name} />,
      })}
    >
      <Tab.Screen name="Pending" component={Pending} />
      <Tab.Screen name="Posted" component={Posted} />
    </Tab.Navigator>
  );
}

const Transactions = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#37474F" />
        </Pressable>
        <Text style={styles.title}>Transactions</Text>
      </View>
      <View style={styles.recordsContainer}>
        <MyTabs />
      </View>
    </View>
  );
};

export default Transactions;
