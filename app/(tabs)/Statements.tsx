import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../assets/styles/StatementsStyles";  // Import the new styles file

const Statements = () => {
  const navigation = useNavigation();

  const data = [
    { id: "1", date: "12/18/2024 - 01/31/2025" },
    { id: "2", date: "02/01/2025 - 03/31/2025" },
    { id: "3", date: "04/01/2025 - 05/31/2025" },
    { id: "4", date: "06/01/2025 - 07/31/2025" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#37474F" />
        </Pressable>
        <Text style={styles.title}>Statements</Text>
      </View>
      <View style={styles.recordsContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Actions</Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.dateText}>{item.date}</Text>
              <View style={styles.actions}>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={24} color="#6200EA" />
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <FontAwesome name="download" size={24} color="#00C853" />
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Statements;
