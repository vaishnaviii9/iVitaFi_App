import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from '../../components/styles/DocumentStyles'; // Import the styles

const Documents = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#37474F" />
        </Pressable>
        <Text style={styles.title}>Documents</Text>
      </View>

      <View style={styles.recordsContainer}>
        <View style={styles.documentList}>
          <TouchableOpacity style={styles.documentButton} onPress={() => alert('Pressed!')}>
            <Text style={styles.buttonText}>Healthcare Credit Agreement & Disclosures</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButtonDark} onPress={() => alert('Pressed!')}>
            <Text style={styles.buttonText}>MLA Disclosures</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButton} onPress={() => alert('Pressed!')}>
            <Text style={styles.buttonText}>TCPA Disclosures</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButtonDark} onPress={() => alert('Pressed!')}>
            <Text style={styles.buttonText}>Consent to Electronic Communications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Documents;
