import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
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
          <TouchableOpacity style={styles.documentFolder} onPress={() => alert('Pressed!')}>
            <FontAwesome name="folder-open" size={30} color="#FFFFFF" style={styles.folderIcon} />
            <Text style={styles.folderText}>Healthcare Credit Agreement & Disclosures</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentFolderDark} onPress={() => alert('Pressed!')}>
            <FontAwesome name="folder-open" size={30} color="#FFFFFF" style={styles.folderIcon} />
            <Text style={styles.folderText}>MLA Disclosures</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentFolder} onPress={() => alert('Pressed!')}>
            <FontAwesome name="folder-open" size={30} color="#FFFFFF" style={styles.folderIcon} />
            <Text style={styles.folderText}>TCPA Disclosures</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentFolderDark} onPress={() => alert('Pressed!')}>
            <FontAwesome name="folder-open" size={30} color="#FFFFFF" style={styles.folderIcon} />
            <Text style={styles.folderText}>Consent to Electronic Communications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Documents;
