import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert, Share, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchStatements } from "../services/statementService";
import styles from "../../components/styles/StatementsStyles"; // Ensure this path is correct
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Statements: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  const creditAccountId = useSelector((state: any) => state.creditAccount.creditAccountId);

  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

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
      } catch (error) {
        console.error("Error fetching statements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStatements();
  }, [token, creditAccountId]);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), "MMM dd yyyy");
    const end = format(new Date(endDate), "MMM dd yyyy");
    return `${start} - ${end}`;
  };

  const handleViewPress = (item: any) => {
    Alert.alert("View Statement", `Viewing statement for ${formatDateRange(item.statementStartDate, item.statementDate)}`);
  };

  const handleDownloadPress = (item: any) => {
    Alert.alert("Download Statement", `Downloading statement for ${formatDateRange(item.statementStartDate, item.statementDate)}`);
  };

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
          <Ionicons name="arrow-back" size={wp('7%')} color="black" />
        </Pressable>
        <Text style={styles.title}>Statements</Text>
      </View>

      <View style={styles.recordsContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Actions</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6200EA" />
        ) : (
          <FlatList
            data={statements}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.dateText}>
                  {formatDateRange(item.statementStartDate, item.statementDate)}
                </Text>
                <View style={styles.actions}>
                  <Pressable style={styles.actionButton} onPress={() => handleViewPress(item)}>
                    <Ionicons name="eye-outline" size={wp('6%')} color="#FFFFFF" />
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={() => handleDownloadPress(item)}>
                    <FontAwesome name="download" size={wp('6%')} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {pdfUri && (
        <WebView
          source={{ uri: `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUri)}` }}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};

export default Statements;
