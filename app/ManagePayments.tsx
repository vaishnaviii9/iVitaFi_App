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

interface PaymentMethod {
  id: string;
  cardNumber: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  expirationDate: string | null;
  zipCode: string | null;
  hasPaymentToken: boolean;
  isDisabled: boolean;
}

interface DebitCardInfoDto {
  firstName: string;
  lastName: string;
  cardNumber: string;
  securityCode: string;
  expirationDateTime: Date;
  zipCode: string;
  customerPaymentMethodId: number;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  email?: string | null;
  phone?: string | null;
  state?: string | null;
}

const ManagePayments = () => {
  const token = useSelector((state: any) => state.auth.token);
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

  const [editDebitCardInputs, setEditDebitCardInputs] = useState({
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
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
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
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );
  const [customerResponse, setCustomerResponse] = useState<any>(null);

  const isCardExpired = (expMonth: string, expYear: string): boolean => {
    const currentDate = new Date();
    const expirationDate = new Date(Number(expYear), Number(expMonth) - 1);

    expirationDate.setMonth(expirationDate.getMonth() + 1, 0);
    expirationDate.setHours(23, 59, 59, 999);

    return currentDate > expirationDate;
  };

  const fetchData = async () => {
    try {
      const customerResponse = await fetchCustomerData(token, (data) => {});

      setCustomerResponse(customerResponse);
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
    
      setErrorMessage("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    setRoutingNumberError(null);
    if (!/^[0-9]{9}$/.test(text)) {
      setRoutingNumberError("Please enter your bank's 9 digit routing number.");
    }
  };

  const handleAccountNumberChange = (text: string) => {
    setActiveField("accountNumber");
    setAccountNumber(text);
    setPaymentVerified(null);
    setAccountNumberError(null);
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

  const fetchDebitCardInfo = async (customerPaymentMethodId: string) => {
    try {
      const response = await fetch(
        `https://dev.ivitafi.com/api/CreditAccount/${customerPaymentMethodId}/debitcard-info`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch debit card information");
      }

      const data = await response.json();

      return data;
    } catch (error) {
           return { type: "error", error: { errorCode: ErrorCode.Unknown } };

    }
  };

  const handleEditMethod = async (method: PaymentMethod) => {
    resetFormInputs(); // Reset the add payment form state

    if (method.cardNumber) {
      try {
        const debitCardInfo = await fetchDebitCardInfo(method.id);

        // Extract month and year from expirationDate
        const expMonth = debitCardInfo.expirationDate.substring(0, 2);
        const expYearTwoDigits = debitCardInfo.expirationDate.substring(2, 4);

        // Convert two-digit year to full year
        const expirationYearTwoDigits = parseInt(expYearTwoDigits, 10);
        const currentYear = new Date().getFullYear();
        const currentCentury = Math.floor(currentYear / 100) * 100;
        const currentYearTwoDigits = currentYear % 100;

        let fullYear: number;
        if (expirationYearTwoDigits < currentYearTwoDigits) {
          // Year has already passed in this century — assume next century
          fullYear = currentCentury + 100 + expirationYearTwoDigits;
        } else {
          // Same century
          fullYear = currentCentury + expirationYearTwoDigits;
        }

        setSelectedMethod("Add Debit Card");
        setEditDebitCardInputs({
          firstName:
            debitCardInfo.firstName || customerResponse?.user?.firstName || "",
          lastName:
            debitCardInfo.lastName || customerResponse?.user?.lastName || "",
          cardNumber: debitCardInfo.cardNumber || "",
          expMonth: expMonth,
          expYear: fullYear.toString(), // Use the full year
          cvv: "",
          zip: debitCardInfo.zipCode || "",
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1:
            "There was an error while fetching debit card payment information.",
          text2: "Error",
        });
      }
    } else if (method.accountNumber) {
      setSelectedMethod("Add Checking Account");
      setRoutingNumber(method.routingNumber || "");
      setAccountNumber(method.accountNumber || "");
    }
    setIsDefault(true);
    setEditingMethod(method);
    setEditModalVisible(true);
  };

  const updateDebitCardInfo = async (
    paymentMethodInfo: DebitCardInfoDto,
    customerPaymentMethodId: number
  ) => {
    try {
      const response = await fetch(
        `https://dev.ivitafi.com/api/creditaccount/update-debitcard-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...paymentMethodInfo,
            customerPaymentMethodId: customerPaymentMethodId,
          }),
        }
      );
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorData = contentType?.includes("application/json")
          ? await response.json()
          : { errorMessage: await response.text() };

        return { type: "error", response: errorData };
      }

      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      return { type: "data", data };
    } catch (error) {
      
      return { type: "error", error: { errorCode: ErrorCode.Unknown } };
    }
  };

  const handleUpdateButtonPress = async () => {
    setIsSubmitting(true);

    if (selectedMethod === "Add Debit Card" && editingMethod?.id) {
      const { firstName, lastName, cardNumber, expMonth, expYear, cvv } =
        editDebitCardInputs;

      const month = Number(expMonth);
      const year = Number(expYear);

      // Get last day of the correct month
      const lastDay = new Date(year, month, 0).getDate();

      // Create expiration date with last day
      const expirationDateWithTime = new Date(
        year,
        month - 1,
        lastDay,
        0,
        0,
        0
      );

      const paymentMethodInfo: DebitCardInfoDto = {
        firstName,
        lastName,
        cardNumber,
        securityCode: cvv,
        expirationDateTime: expirationDateWithTime,
        zipCode: editDebitCardInputs.zip,
        customerPaymentMethodId: Number(editingMethod.id),
        // Additional fields
        address1: null,
        address2: null,
        city: null,
        email: null,
        phone: null,
        state: null,
      };

      const isSecurityCodeEntered = !!cvv;
      const isSecurityCodeValid = /^[0-9]{3,4}$/.test(cvv || "");

      if (isSecurityCodeEntered && !isSecurityCodeValid) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid security code. It must be 3 or 4 digits.",
        });
        setIsSubmitting(false);
        return;
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (
        month > 0 &&
        year > 0 &&
        year === currentYear &&
        month < currentMonth
      ) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            "The debit card you entered has expired. Please update your payment details.",
        });
        setIsSubmitting(false);
        return;
      }

      try {
        const result = await updateDebitCardInfo(
          paymentMethodInfo,
          Number(editingMethod.id)
        );

        if (result?.type === "data") {
          setEditModalVisible(false);

          await fetchData();
          Toast.show({
            type: "success",
            text1: "Success",
            text2:
              "The payment method information has been updated successfully.",
          });
          resetFormInputs();
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              "Failed to update the payment method information. Please try again.",
          });
        }
      } catch (error) {
        
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
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

        <Modal
          isVisible={isEditModalVisible}
          onBackdropPress={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons
                name="close"
                size={24}
                color="#FFFFFF"
                style={styles.modalCloseIcon}
              />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Update Payment Method Details
              </Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCloseIconContainer}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {editingMethod && (
              <>
                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputFieldLabel}>First Name</Text>
                  <TextInput
                    value={editDebitCardInputs.firstName}
                    onChangeText={(text) =>
                      setEditDebitCardInputs((prev) => ({
                        ...prev,
                        firstName: text,
                      }))
                    }
                    style={styles.inputField}
                    placeholderTextColor={"#707073"}
                    editable={false} // Make this field read-only
                  />
                </View>

                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputFieldLabel}>Last Name</Text>
                  <TextInput
                    value={editDebitCardInputs.lastName}
                    onChangeText={(text) =>
                      setEditDebitCardInputs((prev) => ({
                        ...prev,
                        lastName: text,
                      }))
                    }
                    style={styles.inputField}
                    placeholderTextColor={"#707073"}
                    editable={false} // Make this field read-only
                  />
                </View>

                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputFieldLabel}>Card Number</Text>
                  <TextInput
                    value={editDebitCardInputs.cardNumber}
                    onChangeText={(text) =>
                      setEditDebitCardInputs((prev) => ({
                        ...prev,
                        cardNumber: text,
                      }))
                    }
                    style={styles.inputField}
                    placeholderTextColor={"#707073"}
                    keyboardType="numeric"
                    maxLength={16}
                    editable={false} // Make this field read-only
                  />
                </View>
                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputFieldLabel}>Zip Code</Text>
                  <TextInput
                    value={editDebitCardInputs.zip}
                    onChangeText={(text) =>
                      setEditDebitCardInputs((prev) => ({ ...prev, zip: text }))
                    }
                    style={styles.inputField}
                    placeholderTextColor={"#707073"}
                    keyboardType="numeric"
                    maxLength={5}
                    editable={false}
                  />
                </View>
                <View style={styles.inputFieldContainer}>
                  <Text style={styles.inputFieldLabel}>Expiration Month *</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable
                        style={styles.pickerWrapper}
                        onPress={showMonthPickerHandler}
                      >
                        <View style={styles.pickerContainer}>
                          <Text style={styles.pickerText}>
                            {editDebitCardInputs.expMonth || "Select Month"}
                          </Text>
                          <FontAwesome
                            name="caret-down"
                            size={16}
                            color="#000"
                          />
                        </View>
                      </Pressable>
                      {showMonthPicker && (
                        <Picker
                          selectedValue={editDebitCardInputs.expMonth}
                          onValueChange={(value) => {
                            setEditDebitCardInputs((prev) => ({
                              ...prev,
                              expMonth: value,
                            }));
                            setShowMonthPicker(false); // Close the month picker after selection
                          }}
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
                        selectedValue={editDebitCardInputs.expMonth}
                        onValueChange={(value) => {
                          setEditDebitCardInputs((prev) => ({
                            ...prev,
                            expMonth: value,
                          }));
                          setShowMonthPicker(false); // Close the month picker after selection
                        }}
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
                  <Text style={styles.inputFieldLabel}>Expiration Year *</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable
                        style={styles.pickerWrapper}
                        onPress={showYearPickerHandler}
                      >
                        <View style={styles.pickerContainer}>
                          <Text style={styles.pickerText}>
                            {editDebitCardInputs.expYear || "Select Year"}
                          </Text>
                          <FontAwesome
                            name="caret-down"
                            size={16}
                            color="#000"
                          />
                        </View>
                      </Pressable>
                      {showYearPicker && (
                        <Picker
                          selectedValue={editDebitCardInputs.expYear}
                          onValueChange={(value) => {
                            setEditDebitCardInputs((prev) => ({
                              ...prev,
                              expYear: value,
                            }));
                            setShowYearPicker(false); // Close the year picker after selection
                          }}
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
                        selectedValue={editDebitCardInputs.expYear}
                        onValueChange={(value) => {
                          setEditDebitCardInputs((prev) => ({
                            ...prev,
                            expYear: value,
                          }));
                          setShowYearPicker(false); // Close the year picker after selection
                        }}
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
                    value={editDebitCardInputs.cvv}
                    onChangeText={(text) =>
                      setEditDebitCardInputs((prev) => ({ ...prev, cvv: text }))
                    }
                    style={styles.inputField}
                    placeholderTextColor={"#707073"}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>

                <View style={styles.submitButtonContainer}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleUpdateButtonPress}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? "Updating..." : "Update"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
                {method.hasPaymentToken && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditMethod(method)}
                  >
                    <Ionicons name="create" size={30} color="#27446F" />
                  </TouchableOpacity>
                )}
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

          {selectedMethod === "Add Checking Account" && !isEditModalVisible && (
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

          {selectedMethod === "Add Debit Card" && !isEditModalVisible && (
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
