import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import styles from "../components/styles/ManagePaymentsStyles";
import { useSelector } from "react-redux";
import { fetchSavedPaymentMethods } from "./services/savedPaymentMethodService";
import { fetchCreditSummariesWithId } from "./services/creditAccountService";
import { fetchCustomerData } from "./services/customerService";

const ManagePayments = () => {
  const token = useSelector((state: any) => state.auth.token);

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

  const [isDefault, setIsDefault] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [savedMethods, setSavedMethods] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("Add Checking Account");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await fetchCustomerData(token, (data) => {
          // Set customer data in the state
          // No need to dispatch credit summaries to CreditAccountSlice
        });

        if (customerResponse) {
          const { creditSummaries } = await fetchCreditSummariesWithId(customerResponse, token);
          if (creditSummaries && creditSummaries.length > 0) {
            const customerId = creditSummaries[0]?.detail?.creditAccount?.customerId;
            if (customerId) {
              const methods = await fetchSavedPaymentMethods(token, customerId);
              if (methods && methods.length > 0) {
                setSavedMethods(methods);
                setErrorMessage(null);
              } else {
                setErrorMessage("No saved payment methods found.");
              }
            } else {
              setErrorMessage("No customer ID found.");
            }
          } else {
            setErrorMessage("No credit summaries found.");
          }
        } else {
          setErrorMessage("No customer response found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to fetch data.");
      }
    };
    fetchData();
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const handleBackPress = () => {
    router.push("/(tabs)/Home");
  };

  const openConfirmDeleteModal = (id: string) => {
    setMethodToDelete(id);
    setConfirmDeleteModalVisible(true);
  };

  const closeConfirmDeleteModal = () => {
    setMethodToDelete(null);
    setConfirmDeleteModalVisible(false);
  };

  const confirmDeleteMethod = async () => {
    if (!methodToDelete) return;
    try {
      const response = await fetch(
        `https://dev.ivitafi.com/api/admin/credit-account/${methodToDelete}/delete-payment-method`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setSavedMethods((prev) => prev.filter((m) => m.id !== methodToDelete));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Customer Payment Method has been deleted successfully.',
        });
      } else {
        const errorText = await response.text();
      
      Toast.show({
        type: 'error',
        text1: 'Deletion Failed',
        text2: `Failed to delete payment method: ${errorText}`,
      });

      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Deletion Failed',
        text2: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setConfirmDeleteModalVisible(false);
      setMethodToDelete(null);
    }
  };

  const closeModal = () => setModalVisible(false);

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

  const handleButtonPress = () => {
    alert("Form submitted!");
  };

  const getLast4Digits = (cardNumber: string | null) => cardNumber ? cardNumber.slice(-4) : "";

  return (
    <View style={styles.container}>
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Update Payment Method</Text>
          <Text style={styles.modalText}>1. Locate your expired payment method and delete it.</Text>
          <Text style={styles.modalText}>2. Add your new payment method information.</Text>
          <TouchableOpacity onPress={closeModal} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isConfirmDeleteModalVisible} onBackdropPress={closeConfirmDeleteModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Delete Payment Method</Text>
          <Text style={styles.modalText}>Are you sure you want to delete this payment method?</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={closeConfirmDeleteModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDeleteMethod} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={34} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Manage Payments</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : (
          savedMethods.map((method, index) => (
            <View key={index} style={styles.savedMethodContainer}>
              <FontAwesome name="credit-card" size={28} color="#27446F" style={styles.savedMethodImage} />
              <View style={styles.savedMethodTextContainer}>
                <Text style={styles.savedMethodLabel}>
                  {method.cardNumber 
                    ? `Debit Card - ${getLast4Digits(method.cardNumber)}`
                    : method.accountNumber 
                      ? `Checking Account - ${getLast4Digits(method.accountNumber)}`
                      : "Unknown Payment Method"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => openConfirmDeleteModal(method.id)}
              >
                <Ionicons name="trash" size={30} color="#FF0000" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.addNewPayHeader}>Add New Payment Method</Text>
        <View style={styles.addMethodContainer}>
          {["Add Checking Account", "Add Debit Card"].map((label) => (
            <TouchableOpacity
              key={label}
              style={[styles.addMethodButton, selectedMethod === label && styles.selectedMethodButton]}
              onPress={() => handleMethodSelect(label)}
            >
              <Text style={[styles.addMethodButtonText, selectedMethod === label && styles.selectedMethodButtonText]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
          [
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
                  setDebitCardInputs((prev) => ({ ...prev, [key]: text }))
                }
                style={styles.inputField}
              />
            </View>
          ))
        )}

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

      <Toast />
    </View>
  );
};

export default ManagePayments;
