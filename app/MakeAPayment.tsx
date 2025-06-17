import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { fetchSavedPaymentMethods } from "./services/savedPaymentMethodService";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerData } from "./services/customerService";
import { fetchCreditSummariesWithId } from "./services/creditAccountService";
import { ErrorCode } from "../utils/ErrorCodeUtil";
import Toast from "react-native-toast-message";
import { styles } from "../components/styles/MakeAPaymentStyles";
import { postCreditAccountTransactionsNew } from "./services/postCreditAccountTransactionsNew";
import { setCreditSummaries } from "../features/creditAccount/creditAccountSlice";
import SkeletonLoader from "../components/SkeletonLoader";

interface PaymentMethod {
  id: string;
  expirationDate: string | number | Date;
  cardNumber: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
}

interface CreditAccount {
  creditApplication: {
    status: string;
  };
  paymentSchedule: {
    autoPayEnabled: boolean;
    paymentAmount: number;
  };
}

interface ValidSummary {
  paymentMethod: {
    autoPayEnabled: boolean;
  };
  detail: {
    creditAccount: CreditAccount;
  };
  totalAmountDue: number;
  currentAmountDue: number;
  currentBalance: number;
  daysDelinquent: number;
  nextPaymentDate: Date;
  isBankrupt: boolean;
}

const handleBackPress = () => {
  router.push("/(tabs)/Home");
};

const MakeAPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [cardNumber, setCardNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creditAccountId, setCreditAccountId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentSchedule, setPaymentSchedule] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [firstNameOnCard, setFirstNameOnCard] = useState("");
  const [lastNameOnCard, setLastNameOnCard] = useState("");
  const [debitZipMake, setDebitZipMake] = useState("");
  const [securityCode1, setSecurityCode1] = useState("");
  const [validSummaries, setValidSummaries] = useState<ValidSummary[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [enableAutoPay, setEnableAutoPay] = useState<boolean | null>(null);
  const obj2Ref = useRef<any>(null);

  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 90);

  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();

  const formatPaymentAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleTestModal = () => {
    setIsModalVisible(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const customerResponse = await fetchCustomerData(token, () => {});

          if (customerResponse) {
            const { creditSummaries } = await fetchCreditSummariesWithId(
              customerResponse,
              token
            );
            console.log("Fetched credit summaries:", creditSummaries);
            dispatch(setCreditSummaries(creditSummaries));

            if (creditSummaries && creditSummaries.length > 0) {
              setValidSummaries(creditSummaries);

              const customerId = creditSummaries[0]?.detail?.creditAccount?.customerId;
              const creditAccountId = creditSummaries[0]?.detail?.creditAccountId;
              setCreditAccountId(creditAccountId);

              if (customerId) {
                const methods = await fetchSavedPaymentMethods(token, customerId);
                console.log("Fetched payment methods:", methods);
                if (methods && methods.length > 0) {
                  const validMethods = methods.filter(
                    (method: PaymentMethod) =>
                      method.cardNumber !== null || method.accountNumber !== null
                  );
                  setSavedMethods(validMethods);

                  const defaultPaymentMethod = creditSummaries[0]?.paymentMethod;
                  if (defaultPaymentMethod) {
                    if (defaultPaymentMethod.cardNumber) {
                      const formattedCardNumber =
                        "x".repeat(defaultPaymentMethod.cardNumber.length - 4) +
                        defaultPaymentMethod.cardNumber.slice(-4);
                      setCardNumber(formattedCardNumber);
                      setPaymentMethod(
                        `Debit Card - ${defaultPaymentMethod.cardNumber.slice(-4)}`
                      );

                      const expirationDate = new Date(
                        defaultPaymentMethod.expirationDate
                      );
                      const expirationMonth = expirationDate.getMonth() + 1;
                      const expirationYear = expirationDate.getFullYear();

                      const monthNames = [
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                      ];
                      const formattedExpirationMonth = `${expirationMonth
                        .toString()
                        .padStart(2, "0")} - ${monthNames[expirationMonth - 1]}`;

                      setExpirationMonth(formattedExpirationMonth);
                      setExpirationYear(expirationYear.toString());
                    } else if (defaultPaymentMethod.accountNumber) {
                      setAccountNumber(defaultPaymentMethod.accountNumber);
                      setRoutingNumber(defaultPaymentMethod.routingNumber || "");
                      setPaymentMethod(
                        `Checking Account - ${defaultPaymentMethod.accountNumber.slice(-4)}`
                      );
                    }
                  }
                }
              }

              const autoPayEnabled = creditSummaries[0]?.detail?.creditAccount?.paymentSchedule?.autoPayEnabled;
              setEnableAutoPay(autoPayEnabled);

              const paymentSchedule = creditSummaries[0]?.detail?.creditAccount?.paymentSchedule;
              if (paymentSchedule) {
                setPaymentSchedule(paymentSchedule);
                setPaymentAmount(formatPaymentAmount(paymentSchedule.paymentAmount));
              }
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          return { type: "error", error: { errorCode: ErrorCode.Unknown } };
        } finally {
          setIsLoading(false);
          console.log("Data fetch completed.");
        }
      };

      if (token) {
        fetchData();
      }
    }, [creditAccountId, token, dispatch])
  );

  const toggleDatePicker = () => {
    if (Platform.OS === "android") {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(!showDatePicker);
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    setShowPaymentMethodPicker(false);
    if (value.startsWith("Debit Card -")) {
      const cardNumberFromValue = value.split(" - ")[1];
      const selectedMethod = savedMethods.find(
        (method) =>
          method.cardNumber && method.cardNumber.endsWith(cardNumberFromValue)
      );

      if (selectedMethod && selectedMethod.cardNumber) {
        const formattedCardNumber =
          "x".repeat(selectedMethod.cardNumber.length - 4) +
          selectedMethod.cardNumber.slice(-4);
        setCardNumber(formattedCardNumber);

        const expirationDate = new Date(selectedMethod.expirationDate);
        const expirationMonth = expirationDate.getMonth() + 1;
        const expirationYear = expirationDate.getFullYear();

        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const formattedExpirationMonth = `${expirationMonth
          .toString()
          .padStart(2, "0")} - ${monthNames[expirationMonth - 1]}`;

        setExpirationMonth(formattedExpirationMonth);
        setExpirationYear(expirationYear.toString());

        obj2Ref.current = {
          firstName: firstNameOnCard,
          lastName: lastNameOnCard,
          zipCode: debitZipMake,
          accountNumber: null,
          routingNumber: null,
          truncatedAccountNumber: null,
          truncatedCardNumber: null,
          truncatedRoutingNumber: null,
          expirationDate: new Date(expirationYear, expirationMonth - 1),
          cardNumber: selectedMethod.cardNumber,
          securityCode: securityCode1,
          paymentMethodType: 3,
        };
      }
    } else if (value.startsWith("Checking Account -")) {
      const accountNumberFromValue = value.split(" - ")[1];
      const selectedMethod = savedMethods.find(
        (method) =>
          method.accountNumber &&
          method.accountNumber.endsWith(accountNumberFromValue)
      );

      if (selectedMethod) {
        setAccountNumber(selectedMethod.accountNumber || "");
        setRoutingNumber(selectedMethod.routingNumber || "");

        obj2Ref.current = {
          accountNumber: selectedMethod.accountNumber,
          routingNumber: selectedMethod.routingNumber,
          truncatedAccountNumber: null,
          truncatedCardNumber: null,
          truncatedRoutingNumber: null,
          expirationDate: null,
          cardNumber: null,
          securityCode: null,
          paymentMethodType: 1,
        };
      }
    }

    if (value !== "Add Debit Card" && value !== "Add Checking Account") {
      const selectedMethodId = savedMethods.find(
        (method) =>
          (method.cardNumber && value.endsWith(method.cardNumber.slice(-4))) ||
          (method.accountNumber &&
            value.endsWith(method.accountNumber.slice(-4)))
      )?.id;
      setSelectedPaymentMethodId(selectedMethodId ?? null);
    }

    if (value === "Add Debit Card" || value === "Add Checking Account") {
      router.push("/ManagePayments");
    }
  };

  const openPaymentMethodPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(!showPaymentMethodPicker);
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate >= currentDate && selectedDate <= maxDate) {
        setDate(selectedDate);
        setShowDatePicker(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid Date",
          text2: "Please select a date within the next 30 days from today.",
          visibilityTime: 5000,
          autoHide: true,
          topOffset: 60,
          bottomOffset: 100,
        });
      }
    }
  };

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const convertedYear = Number(expirationYear);
    const convertedMonth = Number(expirationMonth.split(" - ")[0]) - 1;

    const expirationDate = new Date(convertedYear, convertedMonth);
    const currentDate = new Date();

    if (paymentMethod.startsWith("Debit Card -")) {
      if (expirationDate < currentDate) {
        Toast.show({
          type: "error",
          text1: "Card Expired",
          text2:
            "The debit card you entered has expired. Please update your payment details.",
          visibilityTime: 5000,
          autoHide: true,
          topOffset: 60,
          bottomOffset: 100,
        });
        setIsSubmitting(false);
        return;
      }
    }

    const formattedExpirationDate = new Date(
      convertedYear,
      convertedMonth
    ).toISOString();
    const formattedTransactionDate = date.toISOString();

    const transactionPost = {
      transactionAmount: Number(paymentAmount.replace(/[^0-9.-]+/g, "")),
      transactionDate: formattedTransactionDate,
      customAmount: null,
      useSavedPaymentMethod: true,
      enableAutoPay: enableAutoPay !== null ? enableAutoPay : false,
      paymentMethodType: obj2Ref.current
        ? obj2Ref.current.paymentMethodType
        : null,
    };

    if (!obj2Ref.current || !creditAccountId || !selectedPaymentMethodId) {
      Toast.show({
        type: "error",
        text1: "Submission Error",
        text2: "Required data is missing. Please check your inputs.",
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 100,
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...transactionPost,
      expirationDate: formattedExpirationDate,
    };

    try {
      const result = await postCreditAccountTransactionsNew(
        Number(creditAccountId),
        Number(selectedPaymentMethodId),
        payload,
        token
      );

      if (result.type === "error") {
        Toast.show({
          type: "error",
          text1: "Payment Failed",
          visibilityTime: 5000,
          autoHide: true,
          topOffset: 60,
          bottomOffset: 100,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Payment Successful",
          text2: "Your payment has been processed successfully.",
          visibilityTime: 5000,
          autoHide: true,
          topOffset: 60,
          bottomOffset: 100,
        });

        setIsModalVisible(true);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: "There was an error processing your payment. Please try again.",
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 100,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOKPress = () => {
    setIsModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Make a Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <>
              <SkeletonLoader style={styles.helpText} type="text" />
              <SkeletonLoader style={styles.pickerWrapper} type="input" />
              <SkeletonLoader style={styles.helpText} type="text" />
              <SkeletonLoader style={styles.specificInput} type="input" />
              <SkeletonLoader style={styles.helpText} type="text" />
              <SkeletonLoader style={styles.specificInput} type="input" />
              <SkeletonLoader style={styles.helpText} type="text" />
              <SkeletonLoader style={styles.specificInput} type="input" />
              <SkeletonLoader style={styles.helpText} type="text" />
              <SkeletonLoader style={styles.datePickerButton} type="input" />
              <SkeletonLoader style={styles.agreementText} type="text" />
              <SkeletonLoader style={styles.submitButton} type="input" />
            </>
          ) : (
            <View style={styles.content}>
              <View style={styles.formContainer}>
                <Text style={styles.helpText}>Payment Method</Text>
                {Platform.OS === "ios" ? (
                  <>
                    <Pressable onPress={openPaymentMethodPicker}>
                      <View style={styles.pickerWrapper}>
                        <View style={styles.pickerDisplayContainer}>
                          <Text style={styles.pickerDisplayText}>
                            {paymentMethod || "Select a payment method"}
                          </Text>
                          <FontAwesome
                            name="chevron-down"
                            size={14}
                            color="#27446F"
                          />
                        </View>
                      </View>
                    </Pressable>
                    {showPaymentMethodPicker && (
                      <View style={{ zIndex: 1000, position: "relative" }}>
                        <Picker
                          selectedValue={paymentMethod}
                          onValueChange={handlePaymentMethodChange}
                          style={styles.iosPicker}
                          itemStyle={{ color: "black" }}
                        >
                          <Picker.Item
                            label="Add Debit Card"
                            value="Add Debit Card"
                          />
                          <Picker.Item
                            label="Add Checking Account"
                            value="Add Checking Account"
                          />
                          {savedMethods.map((method, index) => (
                            <Picker.Item
                              key={index}
                              label={
                                method.cardNumber
                                  ? `Debit Card - ${method.cardNumber.slice(
                                      -4
                                    )}`
                                  : `Checking Account - ${method.accountNumber?.slice(
                                      -4
                                    )}`
                              }
                              value={
                                method.cardNumber
                                  ? `Debit Card - ${method.cardNumber.slice(
                                      -4
                                    )}`
                                  : `Checking Account - ${method.accountNumber?.slice(
                                      -4
                                    )}`
                              }
                            />
                          ))}
                        </Picker>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={paymentMethod}
                      onValueChange={handlePaymentMethodChange}
                      style={styles.androidPicker}
                      dropdownIconColor="#000000"
                    >
                      <Picker.Item
                        label="Add Debit Card"
                        value="Add Debit Card"
                      />
                      <Picker.Item
                        label="Add Checking Account"
                        value="Add Checking Account"
                      />
                      {savedMethods.map((method, index) => (
                        <Picker.Item
                          key={index}
                          label={
                            method.cardNumber
                              ? `Debit Card - ${method.cardNumber.slice(-4)}`
                              : `Checking Account - ${method.accountNumber?.slice(
                                  -4
                                )}`
                          }
                          value={
                            method.cardNumber
                              ? `Debit Card - ${method.cardNumber.slice(-4)}`
                              : `Checking Account - ${method.accountNumber?.slice(
                                  -4
                                )}`
                          }
                        />
                      ))}
                    </Picker>
                  </View>
                )}

                {paymentMethod && paymentMethod.startsWith("Debit Card -") && (
                  <>
                    <Text style={styles.helpText}>Card Number</Text>
                    <TextInput
                      style={styles.nonEditableInput}
                      placeholder="Enter card number"
                      placeholderTextColor="black"
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      keyboardType="numeric"
                      editable={paymentMethod === "Add Debit Card"}
                    />

                    <Text style={styles.helpText}>Expiration Month</Text>
                    <TextInput
                      style={styles.nonEditableInput}
                      placeholder="Enter expiration month"
                      placeholderTextColor="black"
                      value={expirationMonth}
                      onChangeText={setExpirationMonth}
                      keyboardType="numeric"
                      editable={paymentMethod === "Add Debit Card"}
                    />

                    <Text style={styles.helpText}>Expiration Year</Text>
                    <TextInput
                      style={styles.nonEditableInput}
                      placeholder="Enter expiration year"
                      placeholderTextColor="black"
                      value={expirationYear}
                      onChangeText={setExpirationYear}
                      keyboardType="numeric"
                      editable={paymentMethod === "Add Debit Card"}
                    />
                  </>
                )}

                {paymentMethod && !paymentMethod.startsWith("Debit Card -") && (
                  <>
                    <Text style={styles.helpText}>Routing Number</Text>
                    <TextInput
                      style={styles.specificInput}
                      placeholder="Enter routing number"
                      placeholderTextColor="black"
                      value={routingNumber}
                      onChangeText={setRoutingNumber}
                      keyboardType="numeric"
                      editable={paymentMethod === "Add Checking Account"}
                    />

                    <Text style={styles.helpText}>Account Number</Text>
                    <TextInput
                      style={styles.specificInput}
                      placeholder="Enter account number"
                      placeholderTextColor="black"
                      value={accountNumber}
                      onChangeText={setAccountNumber}
                      keyboardType="numeric"
                      editable={paymentMethod === "Add Checking Account"}
                    />
                  </>
                )}

                <Text style={styles.helpText}>Payment Amount</Text>
                <TextInput
                  style={styles.specificInput}
                  placeholder="Enter payment amount"
                  placeholderTextColor="black"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  keyboardType="numeric"
                />

                <Text style={styles.helpText}>Payment Start Date</Text>
                <Pressable onPress={toggleDatePicker}>
                  <View style={styles.datePickerButton}>
                    <Text style={styles.dateText}>
                      {date ? formatDate(date) : "MM/DD/YYYY"}
                    </Text>
                    <FontAwesome name="calendar" size={16} color="#27446F" />
                  </View>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    value={date}
                    onChange={onChange}
                    textColor="black"
                  />
                )}
              </View>
              {paymentMethod && (
                <Text style={styles.agreementText}>
                  {paymentMethod.startsWith("Debit Card -")
                    ? `You agree to pay a one-time payment of ${paymentAmount} on ${formatDate(
                        date
                      )} using your Debit Card.`
                    : `You agree to pay a one-time payment of ${paymentAmount} on ${formatDate(
                        date
                      )} from your Checking Account.`}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Submitting..." : "SUBMIT"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        <Toast />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Ionicons name="close" size={34} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>Your payment was successful</Text>
              <Text style={styles.modalMessage}>
                Thank You! Your payment has been scheduled. Your account balance
                will be updated when your payment is processed.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setIsModalVisible(!isModalVisible);
                  router.push("/(tabs)/Home");
                }}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MakeAPayment;
