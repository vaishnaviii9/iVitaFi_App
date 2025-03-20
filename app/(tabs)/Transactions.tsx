import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Transactions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Transactions Screen</Text>
   
   
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

});

export default Transactions;
