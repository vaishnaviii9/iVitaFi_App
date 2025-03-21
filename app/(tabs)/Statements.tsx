import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 24,
    marginTop: 40,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#37474F",
    textAlign: "center",
  },
  recordsContainer: {
    backgroundColor: "#E0E0E0", // Gray container
    borderRadius: 26,
    padding: 16,
    flex: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: '55%',
    marginTop: '20%'
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#78909C",
  },
  list: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Row color
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 18,
    color: "#263238",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 16,
  },
});

export default Statements;
