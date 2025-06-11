import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, Share } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "../../components/styles/StatementsStyles";
import { fetchStatements } from "../services/statementService";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system";
import { WebView } from "react-native-webview";
import SkeletonLoader from "../../components/SkeletonLoader";
import { ErrorCode } from "../../utils/ErrorCodeUtil";

const Statements: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  const creditAccountId = useSelector(
    (state: any) => state.creditAccount.creditAccountId
  );

  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const navigation = useNavigation();

  const loadStatements = useCallback(async () => {
    if (!creditAccountId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchStatements(token, creditAccountId);
      setStatements(response || []);
    } catch (error) {
      
      return { type: "error", error: { errorCode: ErrorCode.Unknown } };
    } finally {
      setLoading(false);
    }
  }, [token, creditAccountId]);

  useFocusEffect(
    useCallback(() => {
      loadStatements();
    }, [loadStatements])
  );

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), "MMM dd yyyy");
    const end = format(new Date(endDate), "MMM dd yyyy");
    return `${start} - ${end}`;
  };

  const downloadPDF = async (fileName: string) => {
    try {
      const response = await fetch(
        `https://dev.ivitafi.com/api/creditaccount/${creditAccountId}/statements/${fileName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      let preSignedUrl = await response.text();
      preSignedUrl = preSignedUrl.replace(/^"|"$/g, "");

      const downloadDest = `${FileSystem.documentDirectory}${fileName}`;
      const downloadResult = await FileSystem.downloadAsync(
        preSignedUrl,
        downloadDest
      );

      return downloadDest;
    } catch (error) {
     
      return { type: "error", error: { errorCode: ErrorCode.Unknown } };
    }
  };

  const handleViewPress = async (item: any) => {
    try {
      const fileUri = await downloadPDF(item.fileName);
      setPdfUri(fileUri);
    } catch (error) {
     
      return { type: "error", error: { errorCode: ErrorCode.Unknown } };
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
      
      return { type: "error", error: { errorCode: ErrorCode.Unknown } };
    }
  };

  if (!creditAccountId) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAccountText}>
          No Credit Account ID available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#37474F" />
        </Pressable>
        <Text style={styles.title}>Statements</Text>
      </View>

      <View style={styles.recordsContainer}>
        <View style={styles.header}>
          <>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>Actions</Text>
          </>
        </View>

        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <View style={styles.row} key={index}>
              <SkeletonLoader style={styles.dateTextSkeleton} type="text" />
              <View style={styles.actions}>
                <SkeletonLoader
                  style={styles.actionButtonSkeleton}
                  type="container"
                />
                <SkeletonLoader
                  style={styles.actionButtonSkeleton}
                  type="container"
                />
              </View>
            </View>
          ))
        ) : statements.length > 0 ? (
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
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleViewPress(item)}
                  >
                    <Ionicons name="eye-outline" size={24} color="#FFFFFF" />
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleDownloadPress(item)}
                  >
                    <FontAwesome name="download" size={24} color="#FFFFFF" />
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
          source={{
            uri: `https://docs.google.com/viewer?url=${encodeURIComponent(
              pdfUri
            )}`,
          }}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};

export default Statements;
