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
import styles from "../components/styles/ManagePaymentsStyles";

const ManagePayments = () => {
  // State variables to manage form inputs
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [debitCardInputs, setDebitCardInputs] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    zip: "",
  });

  // State variables to manage UI state
  const [isDefault, setIsDefault] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("Add Checking Account"); // Set default method

  // Show modal every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  // Handle back button press to navigate to the home screen
  const handleBackPress = () => {
    router.push("/(tabs)/Home");
  };

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Handle method selection and reset form data
  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setRoutingNumber("");
    setAccountNumber("");
    setDebitCardInputs({
      firstName: "",
      lastName: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      zip: "",
    });
  };

  // Handle form submission
  const handleButtonPress = () => {
    alert("Form submitted!");
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Payments</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Saved Payment Methods Section */}
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

        {/* Add New Payment Method Section */}
        <Text style={styles.addNewPayHeader}>Add New Payment Method</Text>
        <View style={styles.addMethodContainer}>
          {["Add Checking Account", "Add Debit Card"].map((label) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.addMethodButton,
                selectedMethod === label && styles.selectedMethodButton,
              ]}
              onPress={() => handleMethodSelect(label)}
            >
              <Text
                style={[
                  styles.addMethodButtonText,
                  selectedMethod === label && styles.selectedMethodButtonText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conditional Rendering of Input Fields Based on Selected Method */}
        {selectedMethod === "Add Checking Account" && (
          <>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Routing Number</Text>
              <TextInput
                placeholder="Enter routing number"
                value={routingNumber}
                onChangeText={setRoutingNumber}
                style={styles.inputField}
              />
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Account Number</Text>
              <TextInput
                placeholder="Enter account number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                style={styles.inputField}
              />
            </View>
          </>
        )}

        {selectedMethod === "Add Debit Card" && (
          <>
            {[
              ["First Name", "firstName"],
              ["Last Name", "lastName"],
              ["Card Number", "cardNumber"],
              ["Expiration Month", "expMonth"],
              ["Expiration Year", "expYear"],
              ["Security Code", "cvv"],
              ["Zip Code", "zip"],
            ].map(([label, key]) => (
              <View key={key} style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>{label}</Text>
                <TextInput
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={debitCardInputs[key as keyof typeof debitCardInputs]}
                  onChangeText={(text) =>
                    setDebitCardInputs((prev) => ({
                      ...prev,
                      [key]: text,
                    }))
                  }
                  style={styles.inputField}
                />
              </View>
            ))}
          </>
        )}

        {/* Default Payment Method Checkbox */}
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

        {/* Submit Button */}
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
