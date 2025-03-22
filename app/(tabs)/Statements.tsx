import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../components/styles/StatementsStyles";
import { fetchStatements } from "../services/statementService";
import { useSelector } from "react-redux";

const Statements: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  const creditAccountId = useSelector((state: any) => state.creditAccount.creditAccountId);

  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation();

  useEffect(() => {
    const loadStatements = async () => {
      if (!creditAccountId) {
        console.warn("No Credit Account ID available.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchStatements(token, creditAccountId);
        setStatements(response || []);
        console.log("Fetched Statements:", response);
      } catch (error) {
        console.error("Error fetching statements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStatements();
  }, [token, creditAccountId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!creditAccountId) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAccountText}>No Credit Account ID available.</Text>
      </View>
    );
  }

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

        {statements.length > 0 ? (
          <FlatList
            data={statements}
            keyExtractor={(item) => item.id.toString()}
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
        ) : (
          <Text style={styles.noStatementsText}>No statements available.</Text>
        )}
      </View>
    </View>
  );
};

export default Statements;
