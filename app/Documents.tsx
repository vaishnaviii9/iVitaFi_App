import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import BottomNavigation from './BottomNavigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const documents = [
  { id: '1', title: 'Document 1' },
  { id: '2', title: 'Document 2' },
  { id: '3', title: 'Document 3' },
];

const Documents = () => {
  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.BottomNavigationContainer}>
    <BottomNavigation activeTab='Documents'/>
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    fontSize: 18,
  },
   BottomNavigationContainer: {
      width: wp('90%'),
      flex: 1, // Prevent unintended stretching
      marginBottom: hp('1%'),
    },
});


export default Documents;
