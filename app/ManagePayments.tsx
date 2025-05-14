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
  Pressable,
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
import { deletePaymentMethod } from "./services/paymentMethodService";
import { updateCreditAccountPaymentMethodWithDefaultPaymentMethodAsync } from "./services/creditAccountPaymentService";
import { ErrorCode } from "../utils/ErrorCodeUtil";

const ManagePayments = () => {
  const token = useSelector((state: any) => state.auth.token);

  // State Initialization
  const creditAccountId = useSelector(
    (state: any) => state.creditAccount.creditAccountId
  );

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
  const [accountVerificationError, setAccountVerificationError] = useState<
    string | null
  >(null);
  const [routingNumberError, setRoutingNumberError] = useState<string | null>(
    null
  );
  const [accountNumberError, setAccountNumberError] = useState<string | null>(
    null
  );
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Function to check if the card is expired
  const isCardExpired = (expMonth: string, expYear: string): boolean => {
    const currentDate = new Date();
    const expirationDate = new Date(Number(expYear), Number(expMonth) - 1);

    expirationDate.setMonth(expirationDate.getMonth() + 1, 0);
    expirationDate.setHours(23, 59, 59, 999);

    return currentDate > expirationDate;
  };

  // Define fetchData function outside of useEffect
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

  // Use fetchData in useEffect
  useEffect(() => {
    fetchData();
  }, [token]);

  // Lifecycle Hook
  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  // Navigation Function
  const handleBackPress = () => {
    router.push("/(tabs)/Home");
  };

  // Modal Management Functions
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
      const success = await deletePaymentMethod(token, methodToDelete);
      if (success) {
        setSavedMethods((prev) => prev.filter((m) => m.id !== methodToDelete));
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Customer Payment Method has been deleted successfully.",
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

  // Form Handling Functions
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
    setIsSubmitted(false);
  };

  const handleRoutingNumberChange = (text: string) => {
    setActiveField("routingNumber");
    setRoutingNumber(text);
    setPaymentVerified(null);
    setRoutingNumberError(null); // Clear error when user updates the field
    if (!/^[0-9]{9}$/.test(text)) {
      setRoutingNumberError("Please enter your bank's 9 digit routing number.");
    }
  };

  const handleAccountNumberChange = (text: string) => {
    setActiveField("accountNumber");
    setAccountNumber(text);
    setPaymentVerified(null);
    setAccountNumberError(null); // Clear error when user updates the field
    if (!/^[0-9]{5,17}$/.test(text)) {
      setAccountNumberError("Please enter your bank account number.");
    }
  };

  const handleButtonPress = async () => {
    setIsSubmitting(true);
    setIsSubmitted(true);

    const paymentMethodData = {
      accountNumber: null as string | null,
      routingNumber: null as string | null,
      truncatedAccountNumber: null as string | null,
      truncatedCardNumber: null as string | null,
      truncatedRoutingNumber: null as string | null,
      expirationDate: null as Date | null,
      cardNumber: null as string | null,
      securityCode: null as string | null,
      firstName: null as string | null,
      lastName: null as string | null,
      zipCode: null as string | null,
      paymentMethodType: null as number | null,
    };

    if (selectedMethod === "Add Checking Account") {
      const duplicateMethod = savedMethods.find(
        (method) => method.accountNumber === accountNumber && !method.isDisabled
      );

      if (duplicateMethod) {
        setAccountVerificationError("Account Number Already exists.");
        setIsSubmitting(false);
        return;
      }

      if (routingNumberError || accountNumberError) {
        setIsSubmitting(false);
        return;
      }

      paymentMethodData.accountNumber = accountNumber;
      paymentMethodData.routingNumber = routingNumber;
      paymentMethodData.paymentMethodType = 1;

      paymentMethodData.cardNumber = null;
      paymentMethodData.securityCode = null;
      paymentMethodData.firstName = null;
      paymentMethodData.lastName = null;
      paymentMethodData.zipCode = null;
      paymentMethodData.expirationDate = null;

      try {
        const paymentMethResp =
          await updateCreditAccountPaymentMethodWithDefaultPaymentMethodAsync(
            creditAccountId,
            paymentMethodData,
            0,
            isDefault,
            token
          );

        if (paymentMethResp.type === "data") {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Payment method added successfully.",
          });
          resetFormInputs();
          await fetchData();
        } else if (
          paymentMethResp.response &&
          typeof paymentMethResp.response === "object" &&
          paymentMethResp.response.errorCode ===
            ErrorCode.AdminPaymentMethodVerificationFailed
        ) {
          setAccountVerificationError(
            paymentMethResp.response.errorMessage ||
              "Please enter a valid routing number and account number."
          );
          setPaymentVerified(false);
          setRoutingNumberError("Invalid routing number.");
          setAccountNumberError("Invalid account number.");
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please enter a valid routing number and account number.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "There was an error while adding the payment method.",
          });
        }
      } catch (error) {
        console.error("Error adding payment method:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (selectedMethod === "Add Debit Card") {
      const { firstName, lastName, cardNumber, expMonth, expYear } =
        debitCardInputs;

      if (firstName.length < 2 || lastName.length < 2) {
        Alert.alert(
          "Validation Error",
          "First name and last name must have at least 2 characters."
        );
        setIsSubmitting(false);
        return;
      }
      if (cardNumber.length !== 16) {
        Alert.alert("Validation Error", "Card number must be 16 digits.");
        setIsSubmitting(false);
        return;
      }
      if (!expMonth || !expYear) {
        Alert.alert(
          "Validation Error",
          "Please select expiration month and year."
        );
        setIsSubmitting(false);
        return;
      }

      const debitExpirationMonthError = isCardExpired(expMonth, expYear);

      if (debitExpirationMonthError) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            "The debit card you entered has expired. Please update your payment details.",
        });
        setIsSubmitting(false);
        return;
      }

      paymentMethodData.cardNumber = cardNumber;
      paymentMethodData.securityCode = debitCardInputs.cvv;
      paymentMethodData.firstName = firstName;
      paymentMethodData.lastName = lastName;
      paymentMethodData.zipCode = debitCardInputs.zip;
      paymentMethodData.expirationDate = new Date(
        Number(expYear),
        Number(expMonth) - 1
      );
      paymentMethodData.paymentMethodType = 3;

      paymentMethodData.accountNumber = null;
      paymentMethodData.routingNumber = null;

      var duplicateMethod = savedMethods.find(
        (method) => method.cardNumber === cardNumber && !method.isDisabled
      );

      if (duplicateMethod) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Card Number Already exists.",
        });
        setIsSubmitting(false);
        return;
      }

      try {
        const paymentMethResp =
          await updateCreditAccountPaymentMethodWithDefaultPaymentMethodAsync(
            creditAccountId,
            paymentMethodData,
            0,
            isDefault,
            token
          );

        if (paymentMethResp.type === "data") {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Payment method added successfully.",
          });
          resetFormInputs();
          await fetchData();
        } else if (
          paymentMethResp.response &&
          typeof paymentMethResp.response === "object" &&
          paymentMethResp.response.errorCode ===
            ErrorCode.AdminPaymentMethodVerificationFailed
        ) {
          const errorMessage = paymentMethResp.response.errorMessage;
          const formattedMessage = errorMessage.split(".").join("\n");

          Toast.show({
            type: "error",
            text1: "Error",
            text2: formattedMessage,
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "There was an error while adding the payment method.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
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
    setAccountVerificationError(null);
    setRoutingNumberError(null);
    setAccountNumberError(null);
    setPaymentVerified(null);
    setActiveField(null);
    setIsSubmitted(false);
  };

  const getLast4Digits = (val: string | null) => (val ? val.slice(-4) : "");

  const formatCardExpiryStatus = (expirationDateStr: string): string => {
    if (!expirationDateStr) return "";

    const today = new Date();
    const expirationDate = new Date(expirationDateStr);

    const formattedMonth = expirationDate.getMonth() + 1;
    const formattedYear = expirationDate.getFullYear().toString().slice(-2);
    const formattedDate = `${formattedMonth
      .toString()
      .padStart(2, "0")}/${formattedYear}`;

    return expirationDate < today
      ? `Expired - ${formattedDate}`
      : `Valid Thru - ${formattedDate}`;
  };
  const handleMonthChange = (value: string) => {
    setDebitCardInputs((prev) => ({ ...prev, expMonth: value }));
    if (Platform.OS === "ios") {
      setShowMonthPicker(false);
    }
  };

  const handleYearChange = (value: string) => {
    setDebitCardInputs((prev) => ({ ...prev, expYear: value }));
    if (Platform.OS === "ios") {
      setShowYearPicker(false);
    }
  };

  const showMonthPickerHandler = () => {
    if (Platform.OS === "ios") {
      setShowMonthPicker(true);
      setShowYearPicker(false);
    }
  };

  const showYearPickerHandler = () => {
    if (Platform.OS === "ios") {
      setShowYearPicker(true);
      setShowMonthPicker(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
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
                        Checking Account -{" "}
                        {getLast4Digits(method.accountNumber)}
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
                  onChangeText={handleRoutingNumberChange}
                  style={[
                    styles.inputField,
                    isSubmitted && routingNumberError && styles.inputFieldError,
                  ]}
                  keyboardType="numeric"
                  placeholderTextColor={"#707073"}
                  onFocus={() => setActiveField("routingNumber")}
                />
                {routingNumberError && (
                  <Text style={styles.errorText}>{routingNumberError}</Text>
                )}
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Account Number</Text>
                <TextInput
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChangeText={handleAccountNumberChange}
                  style={[
                    styles.inputField,
                    isSubmitted && accountNumberError && styles.inputFieldError,
                  ]}
                  keyboardType="numeric"
                  placeholderTextColor={"#707073"}
                  onFocus={() => setActiveField("accountNumber")}
                />
                {accountNumberError && (
                  <Text style={styles.errorText}>{accountNumberError}</Text>
                )}
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
                    setDebitCardInputs((prev) => ({
                      ...prev,
                      cardNumber: text,
                    }))
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
                {Platform.OS === "ios" ? (
                  <>
                    <Pressable
                      style={styles.pickerWrapper}
                      onPress={showMonthPickerHandler}
                    >
                      <View style={styles.pickerContainer}>
                        <Text style={styles.pickerText}>
                          {debitCardInputs.expMonth || "Select Month"}
                        </Text>
                        <FontAwesome name="caret-down" size={16} color="#000" />
                      </View>
                    </Pressable>
                    {showMonthPicker && (
                      <Picker
                        selectedValue={debitCardInputs.expMonth}
                        onValueChange={handleMonthChange}
                        style={styles.iosPicker}
                        itemStyle={styles.pickerItem}
                      >
                        {months.map((month) => (
                          <Picker.Item
                            key={month.value}
                            label={month.label}
                            value={month.value}
                            style={styles.pickerItem}
                          />
                        ))}
                      </Picker>
                    )}
                  </>
                ) : (
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={debitCardInputs.expMonth}
                      onValueChange={handleMonthChange}
                      style={styles.androidPicker}
                      dropdownIconColor="#000000"
                    >
                      {months.map((month) => (
                        <Picker.Item
                          key={month.value}
                          label={month.label}
                          value={month.value}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>

              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldLabel}>Expiration Year</Text>
                {Platform.OS === "ios" ? (
                  <>
                    <Pressable
                      style={styles.pickerWrapper}
                      onPress={showYearPickerHandler}
                    >
                      <View style={styles.pickerContainer}>
                        <Text style={styles.pickerText}>
                          {debitCardInputs.expYear || "Select Year"}
                        </Text>
                        <FontAwesome name="caret-down" size={16} color="#000" />
                      </View>
                    </Pressable>
                    {showYearPicker && (
                      <Picker
                        selectedValue={debitCardInputs.expYear}
                        onValueChange={handleYearChange}
                        style={styles.iosPicker}
                        itemStyle={styles.pickerItem}
                      >
                        {years.map((year) => (
                          <Picker.Item
                            key={year}
                            label={String(year)}
                            value={String(year)}
                            style={styles.pickerItem}
                          />
                        ))}
                      </Picker>
                    )}
                  </>
                ) : (
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={debitCardInputs.expYear}
                      onValueChange={handleYearChange}
                      style={styles.androidPicker}
                      dropdownIconColor="#000000"
                    >
                      {years.map((year) => (
                        <Picker.Item
                          key={year}
                          label={String(year)}
                          value={String(year)}
                        />
                      ))}
                    </Picker>
                  </View>
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
                  maxLength={5}
                />
                {debitCardInputs.zip.length > 0 &&
                  debitCardInputs.zip.length < 5 && (
                    <Text style={styles.errorText}>
                      Zip code must be 5 digits.
                    </Text>
                  )}
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
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Toast />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ManagePayments;
