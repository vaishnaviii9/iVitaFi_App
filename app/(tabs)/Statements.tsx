import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert, Share, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../components/styles/StatementsStyles";
import { fetchStatements } from "../services/statementService";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

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

  const downloadPDF = async (fileName: string) => {
    try {
      const url = `https://dev.ivitafi.com/api/creditaccount/${creditAccountId}/statements/${fileName}`;
      
      // Check the response headers first
      const headResponse = await fetch(url, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = headResponse.headers.get("content-type");

      // Ensure it's a PDF before proceeding
      if (!contentType || !contentType.includes("pdf")) {
        throw new Error("Invalid file type. Only PDFs are allowed.");
      }

      // Proceed with the download
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const downloadResponse = await FileSystem.downloadAsync(url, fileUri);

      if (downloadResponse.status !== 200) {
        throw new Error("Failed to download PDF.");
      }

      return fileUri;
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Alert.alert("Error", "Failed to download the PDF.");
      throw error;
    }
  };

  const handleViewPress = async (item: any) => {
    try {
      const fileUri = await downloadPDF(item.fileName);
      setPdfUri(fileUri);
    } catch (error) {
      Alert.alert("Error", "Failed to view the PDF.");
    }
  };

  const handleDownloadPress = async (item: any) => {
    try {
      const fileUri = await downloadPDF(item.fileName);
      await Share.share({
        message: `Here is your PDF: ${fileUri}`,
        url: fileUri,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to download the PDF.");
    }
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
          <Ionicons name="arrow-back" size={28} color="#37474F" />
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
                    <Ionicons name="eye-outline" size={24} color="#6200EA" />
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={() => handleDownloadPress(item)}>
                    <FontAwesome name="download" size={24} color="#00C853" />
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
