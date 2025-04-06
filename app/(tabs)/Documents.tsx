import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { fetchCreditSummariesWithId } from "../services/creditAccountService";
import { setCreditSummaries } from "../features/creditAccount/creditAccountSlice";
import { fetchDocuments } from "../services/documentService";
import styles from "../../components/styles/DocumentStyles";

const Documents: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  interface Document {
    id: string;
    documentName: string;
    content: string;
  }

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bankruptcyMessage, setBankruptcyMessage] = useState<string | null>(null);
  const [titleHeader, setTitleHeader] = useState("Document Viewer");

  const token = useSelector((state: any) => state.auth.token);
  const creditAccountId = useSelector(
    (state: any) => state.creditAccount.creditAccountId
  );

  useEffect(() => {
    const fetchDocumentsData = async () => {
      try {
        if (!creditAccountId || !token) return;

        const { creditSummaries } = await fetchCreditSummariesWithId(creditAccountId, token);
        dispatch(setCreditSummaries(creditSummaries));

        const data = await fetchDocuments(creditAccountId, token);
        console.log(data);

        if (data?.accountSummary?.isBankrupt) {
          setBankruptcyMessage("ACCOUNT IN BANKRUPTCY");
        } else {
          setBankruptcyMessage(null);
        }

        setDocuments(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocumentsData();
  }, [creditAccountId, token, dispatch]);

  const openDocumentPopup = (doc: Document) => {
    setSelectedDocument(doc);
    setTitleHeader(doc.documentName);
    setModalVisible(true);
  };

  const closeDocumentPopup = () => {
    setSelectedDocument(null);
    setModalVisible(false);
  };

  const adjustContentWidth = (content: string) => {
    const screenWidth = Dimensions.get("window").width;
    let adjustedContent = content;

    if (screenWidth <= 414) {
      adjustedContent = content.replace(/width="\d+"/g, 'width="200"');
    } else if (screenWidth <= 1060) {
      const newWidth = 800 - (1060 - screenWidth);
      adjustedContent = content.replace(/width="\d+"/g, `width="${newWidth}"`);
    }

    return adjustedContent;
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

      {bankruptcyMessage && (
        <View style={styles.bankruptcyMessageContainer}>
          <Text style={styles.bankruptcyMessageText}>{bankruptcyMessage}</Text>
        </View>
      )}

      <View style={styles.recordsContainer}>
        <View style={styles.documentList}>
          {documents.length > 0 ? (
            documents.slice().reverse().map((doc, index) => (
              <TouchableOpacity
                key={doc.id || index}
                style={
                  index % 2 === 0
                    ? styles.documentFolder
                    : styles.documentFolderDark
                }
                onPress={() => openDocumentPopup(doc)}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeDocumentPopup}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.headerTitle}>{titleHeader}</Text>
              <Pressable onPress={closeDocumentPopup}>
                <Ionicons name="close" size={24} color="#37474F" />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={modalStyles.modalContent}>
              <Text style={modalStyles.modalText}>
                {adjustContentWidth(selectedDocument?.content || "")}
              </Text>
            </ScrollView>
            <View style={modalStyles.footer}>
              <TouchableOpacity
                style={modalStyles.button}
                onPress={closeDocumentPopup}
              >
                <Text style={modalStyles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.button}
                onPress={() => console.log("Print functionality not implemented")}
              >
                <Text style={modalStyles.buttonText}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: Dimensions.get("window").width * 0.9,
    maxHeight: Dimensions.get("window").height * 0.7,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#37474F",
  },
  modalContent: {
    paddingVertical: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: "left",
    lineHeight: 24,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#37474F",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Documents;
