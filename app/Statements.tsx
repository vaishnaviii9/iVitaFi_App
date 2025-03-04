import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import BottomNavigation from './BottomNavigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const Statements = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Statements Screen</Text>
      <View style={styles.BottomNavigationContainer}>
    <BottomNavigation activeTab='Statements'/>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
         flex: 1,
         alignItems: "center",
         backgroundColor: "#fff",
         paddingTop: hp('2.5%'),
       },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  BottomNavigationContainer: {
    width: wp('90%'),
    flex: 1, // Prevent unintended stretching
    marginBottom: hp('1%'),
  },
});

export default Statements;
