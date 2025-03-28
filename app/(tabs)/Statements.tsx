import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert, StyleSheet, Share } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../components/styles/StatementsStyles";
import { fetchStatements } from "../services/statementService";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';
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
        console.log("Fetched Statements:", response);
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
      console.log("Token:", token); // Log the token for debugging
  
      // Step 1: Fetch the pre-signed URL
      const response = await fetch(`https://dev.ivitafi.com/api/creditaccount/${creditAccountId}/statements/${fileName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Check your token and permissions.');
        }
        throw new Error('Network response was not ok');
      }
  
      // Assuming the pre-signed URL is returned in the response body as text
      let preSignedUrl = await response.text();
      console.log("Pre-signed URL:", preSignedUrl);
  
      // Remove any extraneous double quotes from the pre-signed URL
      preSignedUrl = preSignedUrl.replace(/^"|"$/g, '');
  
      // Step 2: Download the PDF using the pre-signed URL
      const fileUri = FileSystem.documentDirectory + fileName;
      console.log("File URI:", fileUri);
  
      await FileSystem.downloadAsync(preSignedUrl, fileUri);
      return fileUri;
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  };
  

  
  const handleViewPress = async (item: any) => {
    try {
      const fileUri = await downloadPDF(item.fileName);
      setPdfUri(fileUri);
    } catch (error) {
      Alert.alert("Error", "Failed to download the PDF.");
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

        {statements.length > 0 ? (
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
        ) : (
          <Text style={styles.noStatementsText}>No statements available.</Text>
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
