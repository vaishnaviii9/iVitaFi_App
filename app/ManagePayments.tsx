import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { fetchSavedPaymentMethods } from "./services/savedPaymentMethodService";
import { fetchCreditSummariesWithId } from "./services/creditAccountService";
import { fetchCustomerData } from "./services/customerService";
import { Picker } from "@react-native-picker/picker";
import styles from "../components/styles/ManagePaymentsStyles";
 
const ManagePayments = () => {
  const token = useSelector((state: any) => state.auth.token);
  const colorScheme = useColorScheme();
 
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
  const [isConfirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("Add Checking Account");
  const [isLoading, setIsLoading] = useState(true);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  const months = [
    { label: "1 - Jan", value: "01" },
    { label: "2 - Feb", value: "02" },
    { label: "3 - Mar", value: "03" },
    { label: "4 - Apr", value: "04" },
    { label: "5 - May", value: "05" },
    { label: "6 - Jun", value: "06" },
    { label: "7 - Jul", value: "07" },
    { label: "8 - Aug", value: "08" },
    { label: "9 - Sep", value: "09" },
    { label: "10 - Oct", value: "10" },
    { label: "11 - Nov", value: "11" },
    { label: "12 - Dec", value: "12" },
  ];
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await fetchCustomerData(token, (data) => {});
        if (customerResponse) {
          const { creditSummaries } = await fetchCreditSummariesWithId(
            customerResponse,
            token
          );
          if (creditSummaries && creditSummaries.length > 0) {
            const customerId =
              creditSummaries[0]?.detail?.creditAccount?.customerId;
            if (customerId) {
              const methods = await fetchSavedPaymentMethods(token, customerId);
              if (methods && methods.length > 0) {
                const validMethods = methods.filter(
                  (method: {
                    cardNumber: string | null;
                    accountNumber: string | null;
                  }) =>
                    method.cardNumber !== null || method.accountNumber !== null
                );
                setSavedMethods(validMethods);
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
      } finally {
        setIsLoading(false);
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
          type: "success",
          text1: "Success",
          text2: "Customer Payment Method has been deleted successfully.",
        });
      } else {
        const errorText = await response.text();
        Toast.show({
          type: "error",
          text1: "Deletion Failed",
          text2: `Failed to delete payment method: ${errorText}`,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Deletion Failed",
        text2: "An unexpected error occurred. Please try again.",
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
    if (selectedMethod === "Add Checking Account") {
      logCheckingAccountInputs();
    } else if (selectedMethod === "Add Debit Card") {
      logDebitCardInputs();
      const { firstName, lastName, cardNumber, expMonth, expYear } =
        debitCardInputs;
      if (firstName.length < 2 || lastName.length < 2) {
        Alert.alert(
          "Validation Error",
          "First name and last name must have at least 2 characters."
        );
        return;
      }
      if (cardNumber.length !== 16) {
        Alert.alert("Validation Error", "Card number must be 16 digits.");
        return;
      }
      if (!expMonth || !expYear) {
        Alert.alert(
          "Validation Error",
          "Please select expiration month and year."
        );
        return;
      }
    }
    alert("Form submitted!");
    resetFormInputs();
  };
 
  const logCheckingAccountInputs = () => {
    console.log("Checking Account Inputs:", {
      routingNumber,
      accountNumber,
      isDefault,
    });
  };
 
  const logDebitCardInputs = () => {
    console.log("Debit Card Inputs:", {
      debitCardInputs,
      isDefault,
    });
  };
 
  const resetFormInputs = () => {
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
    setIsDefault(false);
  };
 
  const getLast4Digits = (val: string | null) => (val ? val.slice(-4) : "");
 
  const formatCardExpiryStatus = (expirationDateStr: string): string => {
    if (!expirationDateStr) return "";
 
    const today = new Date();
    const expirationDate = new Date(expirationDateStr);
    expirationDate.setDate(expirationDate.getDate() + 1);
    expirationDate.setHours(23, 59, 59, 999);
 
    const formattedDate = expirationDate.toLocaleDateString("en-US", {
      month: "2-digit",
      year: "2-digit",
    });
 
    return expirationDate < today
      ? `Expired - ${formattedDate}`
      : `Valid Thru - ${formattedDate}`;
  };
 
  const handleMonthChange = (value: string) => {
    setDebitCardInputs((prev) => ({ ...prev, expMonth: value }));
    setShowMonthPicker(false);
  };
 
  const handleYearChange = (value: string) => {
    setDebitCardInputs((prev) => ({ ...prev, expYear: value }));
    setShowYearPicker(false);
  };
 
  const showMonthPickerHandler = () => {
    setShowMonthPicker(true);
    setShowYearPicker(false);
  };
 
  const showYearPickerHandler = () => {
    setShowYearPicker(true);
    setShowMonthPicker(false);
  };
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
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
 
        <Modal
          isVisible={isConfirmDeleteModalVisible}
          onBackdropPress={closeConfirmDeleteModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Payment Method</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this payment method?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={closeConfirmDeleteModal}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteMethod}
                style={styles.modalButton}
              >
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
 
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
          {isLoading ? (
            <View style={styles.skeletonLoaderContainer}>
              {[...Array(3)].map((_, index) => (
                <View key={index} style={styles.skeletonLoaderItem}>
                  <View style={styles.skeletonLoaderImage} />
                  <View style={styles.skeletonLoaderTextContainer}>
                    <View style={styles.skeletonLoaderText} />
                    <View style={styles.skeletonLoaderText} />
                  </View>
                </View>
              ))}
            </View>
          ) : errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            savedMethods.map((method, index) => (
              <View key={method.id} style={styles.savedMethodContainer}>
                <FontAwesome
                  name="credit-card"
                  size={28}
                  color="#27446F"
                  style={styles.savedMethodImage}
                />
                <View style={styles.savedMethodTextContainer}>
                  {index === 0 && (
                    <View style={styles.defaultLabelContainer}>
                      <Text style={styles.defaultLabel}>Default</Text>
                    </View>
                  )}
                  <Text style={styles.savedMethodLabel}>
                    {method.cardNumber && (
                      <Text style={styles.savedMethodLabel}>
                        Debit Card - {getLast4Digits(method.cardNumber)}
                      </Text>
                    )}
                    {!method.cardNumber && method.accountNumber && (
                      <Text style={styles.savedMethodLabel}>
                        Checking Account - {getLast4Digits(method.accountNumber)}
                      </Text>
                    )}
                  </Text>
                  {method.cardNumber && method.expirationDate && (
                    <Text style={styles.expirationLabel}>
                      {formatCardExpiryStatus(method.expirationDate)}
                    </Text>
                  )}
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
 
          {selectedMethod === "Add Checking Account" && (
            <>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Routing Number</Text>
                <TextInput
                  placeholder="Enter routing number"
                  value={routingNumber}
                  onChangeText={setRoutingNumber}
                  style={styles.inputField}
                  placeholderTextColor={"#707073"}
                />
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Account Number</Text>
                <TextInput
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  style={styles.inputField}
                  placeholderTextColor={"#707073"}
                />
              </View>
            </>
          )}
          {selectedMethod === "Add Debit Card" && (
            <>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>First Name</Text>
                <TextInput
                  placeholder="Enter first name"
                  value={debitCardInputs.firstName}
                  onChangeText={(text) =>
                    setDebitCardInputs((prev) => ({ ...prev, firstName: text }))
                  }
                  style={styles.inputField}
                  placeholderTextColor={"#707073"}
                />
                {debitCardInputs.firstName.length < 2 &&
                  debitCardInputs.firstName.length > 0 && (
                    <Text style={styles.errorText}>
                      First name must be at least 2 characters.
                    </Text>
                  )}
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Last Name</Text>
                <TextInput
                  placeholder="Enter last name"
                  value={debitCardInputs.lastName}
                  onChangeText={(text) =>
                    setDebitCardInputs((prev) => ({ ...prev, lastName: text }))
                  }
                  style={styles.inputField}
                  placeholderTextColor={"#707073"}
                />
                {debitCardInputs.lastName.length < 2 &&
                  debitCardInputs.lastName.length > 0 && (
                    <Text style={styles.errorText}>
                      Last name must be at least 2 characters.
                    </Text>
                  )}
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Card Number</Text>
                <TextInput
                  placeholder="Enter card number"
                  value={debitCardInputs.cardNumber}
                  onChangeText={(text) =>
                    setDebitCardInputs((prev) => ({ ...prev, cardNumber: text }))
                  }
                  placeholderTextColor={"#707073"}
                  style={styles.inputField}
                  keyboardType="numeric"
                  maxLength={16}
                />
                {debitCardInputs.cardNumber.length > 0 &&
                  debitCardInputs.cardNumber.length < 16 && (
                    <Text style={styles.errorText}>
                      Card number must be 16 digits.
                    </Text>
                  )}
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Expiration Month</Text>
                <TouchableOpacity
                  style={styles.pickerWrapper}
                  onPress={showMonthPickerHandler}
                >
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerText}>
                      {debitCardInputs.expMonth || "Select Month"}
                    </Text>
                    <FontAwesome name="caret-down" size={16} color="#000" />
                  </View>
                </TouchableOpacity>
                {showMonthPicker && (
                  <Picker
                    selectedValue={debitCardInputs.expMonth}
                    onValueChange={handleMonthChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem} // Apply item style here
                  >
                    {months.map((month) => (
                      <Picker.Item
                        key={month.value}
                        label={month.label}
                        value={month.value}
                        style={styles.pickerItem} // Ensure each item has the correct style
                      />
                    ))}
                  </Picker>
                )}
              </View>
 
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Expiration Year</Text>
                <TouchableOpacity
                  style={styles.pickerWrapper}
                  onPress={showYearPickerHandler}
                >
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerText}>
                      {debitCardInputs.expYear || "Select Year"}
                    </Text>
                    <FontAwesome name="caret-down" size={16} color="#000" />
                  </View>
                </TouchableOpacity>
                {showYearPicker && (
                  <Picker
                    selectedValue={debitCardInputs.expYear}
                    onValueChange={handleYearChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem} // Apply item style here
                  >
                    {years.map((year) => (
                      <Picker.Item
                        key={year}
                        label={String(year)}
                        value={String(year)}
                        style={styles.pickerItem} // Ensure each item has the correct style
                      />
                    ))}
                  </Picker>
                )}
              </View>
 
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Security Code</Text>
                <TextInput
                  placeholder="Enter security code"
                  value={debitCardInputs.cvv}
                  onChangeText={(text) =>
                    setDebitCardInputs((prev) => ({ ...prev, cvv: text }))
                  }
                  style={styles.inputField}
                  placeholderTextColor={"#707073"}
                  keyboardType="numeric"
                  maxLength={3}
                />
                {debitCardInputs.cvv.length > 0 &&
                  debitCardInputs.cvv.length < 3 && (
                    <Text style={styles.errorText}>
                      CVV must be between 3 and 4 digits.
                    </Text>
                  )}
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Zip Code</Text>
                <TextInput
                  placeholder="Enter zip code"
                  value={debitCardInputs.zip}
                  onChangeText={(text) =>
                    setDebitCardInputs((prev) => ({ ...prev, zip: text }))
                  }
                  style={styles.inputField}
                  placeholderTextColor={"#707073"}
                  keyboardType="numeric"
                />
              </View>
            </>
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
    </KeyboardAvoidingView>
  );
};
 
export default ManagePayments;
 