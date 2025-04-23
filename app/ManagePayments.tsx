import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import Modal from "react-native-modal";
import styles from "../components/styles/ManagePaymentsStyles"; // Import the styles

const ManagePayments = () => {
  const [textInput2, onChangeTextInput2] = useState("");
  const [textInput3, onChangeTextInput3] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // Show modal every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const handleBackPress = () => {
    router.push("/(tabs)/Home");
  };

  const handleButtonPress = () => {
    alert("Pressed!");
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal Dialog */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closeModal}
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Update Payment Method</Text>
          <Text style={styles.modalText}>
            1. Locate your expired payment method under the Saved Payment
            Methods section and click the delete icon to remove it.
          </Text>
          <Text style={styles.modalText}>
            2. Add your new payment method information.
          </Text>
          <TouchableOpacity onPress={closeModal} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Payments</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
        {[
          "Debit Card +●●· 4589",
          "Debit Card +●●· 4589",
          "Debit Card +●●· 4589",
        ].map((label, index) => (
          <View key={index} style={styles.savedMethodContainer}>
            <FontAwesome
              name="credit-card"
              size={28}
              color="#27446F"
              style={styles.savedMethodImage}
            />
            <View style={styles.savedMethodTextContainer}>
              <Text style={styles.savedMethodLabel}>{label}</Text>
              {index === 0 && (
                <Text style={styles.defaultLabel}>{"(Default)"}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.deleteButton}>
              <Ionicons name="trash" size={30} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))}
        <Text style={styles.addNewPayHeader}>Add New Payment Method</Text>
        <View style={styles.addMethodContainer}>
          {["Add Checking Account", "Add Debit Card"].map((label, index) => (
            <TouchableOpacity key={index} style={styles.addMethodButton}>
              <Text style={styles.addMethodButtonText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {["Routing Number", "Account Number"].map((label, index) => (
          <View key={index} style={styles.inputFieldContainer}>
            <Text style={styles.inputFieldLabel}>{label}</Text>
            <TextInput
              placeholder={
                label === "Routing Number"
                  ? "Enter routing number"
                  : "Enter account number"
              }
              value={label === "Routing Number" ? textInput2 : textInput3}
              onChangeText={
                label === "Routing Number"
                  ? onChangeTextInput2
                  : onChangeTextInput3
              }
              style={styles.inputField}
            />
          </View>
        ))}
        <View style={styles.defaultPaymentMethodContainer}>
          <TouchableOpacity onPress={() => setIsDefault(!isDefault)}>
            <Ionicons
              name={isDefault ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={isDefault ? "#27446F" : "#CCC"}
            />
          </TouchableOpacity>
          <Text style={styles.defaultPaymentMethodText}>
            Set as Default Payment Method
          </Text>
        </View>
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleButtonPress}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManagePayments;
