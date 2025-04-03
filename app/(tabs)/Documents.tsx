import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { fetchDocuments } from "../services/documentService"; // Import the document service
import styles from "../../components/styles/DocumentStyles"; // Import the styles

const Documents: React.FC = () => {
  const navigation = useNavigation();

  interface Document {
    id: string;
    documentName: string;
    // Add other properties if needed
  }

  const [documents, setDocuments] = useState<Document[]>([]);

  // Retrieve creditAccountId and token from Redux store
  const token = useSelector((state: any) => state.auth.token);
  const creditAccountId = useSelector(
    (state: any) => state.creditAccount.creditAccountId
  );

  useEffect(() => {
    const fetchDocumentsData = async () => {
      try {
        if (!creditAccountId || !token) return; // Prevent API call if values are missing

        const docsResp = await fetchDocuments(creditAccountId, token);
        // console.log(docsResp);
    
        setDocuments(docsResp || []); // Ensure it's always an array
      } catch (error) {
        console.log("Error fetching documents:", error);
      }
    };

    fetchDocumentsData();
  }, [creditAccountId, token]); // Depend on creditAccountId & token

  const handleDocumentPress = (document: Document) => {
    console.log("Document clicked:", document);
    // You can add more logic here, such as navigating to a detailed view
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#37474F" />
        </Pressable>
        <Text style={styles.title}>Documents</Text>
      </View>

      <View style={styles.recordsContainer}>
        <View style={styles.documentList}>
          {documents.length > 0 ? (
            documents
              .slice()
              .reverse()
              .map((doc, index) => (
                <TouchableOpacity
                  key={doc.id || index} // Ensure unique key
                  style={
                    index % 2 === 0
                      ? styles.documentFolder
                      : styles.documentFolderDark
                  }
                  onPress={() => handleDocumentPress(doc)} // Handle document press
                >
                  <FontAwesome
                    name="folder-open"
                    size={30}
                    color="#FFFFFF"
                    style={styles.folderIcon}
                  />
                  <Text style={styles.folderText}>{doc.documentName}</Text>
                </TouchableOpacity>
              ))
          ) : (
            <Text style={styles.noDocumentsText}>No documents available</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Documents;
