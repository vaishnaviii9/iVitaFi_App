import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  Image,
  LogBox,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { fetchSavedPaymentMethods } from "./services/savedPaymentMethodService";
import { useSelector } from "react-redux";
import { fetchCustomerData } from "./services/customerService";
import { fetchCreditSummariesWithId } from "./services/creditAccountService";
import { ErrorCode } from "../utils/ErrorCodeUtil";
import Toast from "react-native-toast-message";
import { styles } from "../components/styles/MakeAPaymentStyles";
interface PaymentMethod {
  id: string;
  expirationDate: string | number | Date;
  cardNumber: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
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
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creditAccountId, setCreditAccountId] = useState<string | null>(null);
  const token = useSelector((state: any) => state.auth.token);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true); // Set loading to true when starting to fetch data
          const customerResponse = await fetchCustomerData(token, () => {});
          if (customerResponse) {
            const { creditSummaries } = await fetchCreditSummariesWithId(
              customerResponse,
              token
            );

            if (creditSummaries && creditSummaries.length > 0) {
              const customerId =
                creditSummaries[0]?.detail?.creditAccount?.customerId;

              const creditAccountId =
                creditSummaries[0]?.detail?.creditAccountId;

              setCreditAccountId(creditAccountId);

              if (customerId) {
                const methods = await fetchSavedPaymentMethods(
                  token,
                  customerId
                );
                if (methods && methods.length > 0) {
                  const validMethods = methods.filter(
                    (method: PaymentMethod) =>
                      method.cardNumber !== null ||
                      method.accountNumber !== null
                  );
                  setSavedMethods(validMethods);

                  const defaultPaymentMethod =
                    creditSummaries[0]?.paymentMethod;
                  if (defaultPaymentMethod) {
                    if (defaultPaymentMethod.cardNumber) {
                      const formattedCardNumber =
                        "x".repeat(defaultPaymentMethod.cardNumber.length - 4) +
                        defaultPaymentMethod.cardNumber.slice(-4);
                      setCardNumber(formattedCardNumber);
                      setPaymentMethod(
                        `Debit Card - ${defaultPaymentMethod.cardNumber.slice(
                          -4
                        )}`
                      );

                      const expirationDate = new Date(
                        defaultPaymentMethod.expirationDate
                      );
                      const expirationMonth = expirationDate.getMonth() + 1;
                      const expirationYear = expirationDate.getFullYear();

                      const monthNames = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];
                      const formattedExpirationMonth = `${expirationMonth
                        .toString()
                        .padStart(2, "0")} - ${
                        monthNames[expirationMonth - 1]
                      }`;

                      setExpirationMonth(formattedExpirationMonth);
                      setExpirationYear(expirationYear.toString());
                    } else if (defaultPaymentMethod.accountNumber) {
                      setAccountNumber(defaultPaymentMethod.accountNumber);
                      setRoutingNumber(
                        defaultPaymentMethod.routingNumber || ""
                      );
                      setPaymentMethod(
                        `Checking Account - ${defaultPaymentMethod.accountNumber.slice(
                          -4
                        )}`
                      );
                    }
                  }
                }
              }

             
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false); // Set loading to false after data is fetched
        }
      };

      if (token) {
        fetchData();
      }
    }, [token])
  );

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);

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
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const formattedExpirationMonth = `${expirationMonth
          .toString()
          .padStart(2, "0")} - ${monthNames[expirationMonth - 1]}`;

        setExpirationMonth(formattedExpirationMonth);
        setExpirationYear(expirationYear.toString());
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

              {paymentMethod && paymentMethod.startsWith("Debit Card -") ? (
                <>
                  <Text style={styles.helpText}>Card Number</Text>
                  <TextInput
                    style={styles.specificInput}
                    placeholder="Enter card number"
                    placeholderTextColor="black"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    editable={paymentMethod === "Add Debit Card"}
                  />

                  <Text style={styles.helpText}>Expiration Month</Text>
                  <TextInput
                    style={styles.specificInput}
                    placeholder="Enter expiration month"
                    placeholderTextColor="black"
                    value={expirationMonth}
                    onChangeText={setExpirationMonth}
                    keyboardType="numeric"
                    editable={paymentMethod === "Add Debit Card"}
                  />

                  <Text style={styles.helpText}>Expiration Year</Text>
                  <TextInput
                    style={styles.specificInput}
                    placeholder="Enter expiration year"
                    placeholderTextColor="black"
                    value={expirationYear}
                    onChangeText={setExpirationYear}
                    keyboardType="numeric"
                    editable={paymentMethod === "Add Debit Card"}
                  />
                </>
              ) : (
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
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MakeAPayment;
