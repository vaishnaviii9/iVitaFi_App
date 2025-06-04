import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
 const handleBackPress = () => {
    router.push("/(tabs)/Home");
  };
const MakePayment = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
       <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                   <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                 </TouchableOpacity>
        <Text style={styles.headerText}>Make Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text>MakePayment Screen</Text>
      </View>
    </View>
  )
}

export default MakePayment

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  headerContainer: {
    backgroundColor: "#27446F",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: 130,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  }
})
