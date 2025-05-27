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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "../components/styles/ConfigureAutopayStyles";
import { fetchSavedPaymentMethods } from "./services/savedPaymentMethodService";
import { useSelector } from "react-redux";
import { fetchCustomerData } from "./services/customerService";
import { fetchCreditSummariesWithId } from "./services/creditAccountService";

// Define an interface for the payment method to ensure type safety
interface PaymentMethod {
  expirationDate: string | number | Date;
  cardNumber: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
}

// Enum for income frequencies
enum IncomeFrequency {
  Unknown = 0,
  Weekly = 1,
  BiWeekly = 2,
  SemiMonthly = 3,
  Monthly = 4,
}

// Enum for payment sub-frequencies
enum PaymentSubFrequency {
  Unknown = 0,
  SpecificDay = 1,
  SpecificWeekAndDay = 2,
  BusinessDaysAfterDay = 3,
}

// Arrays for date options
const dateOptions = [
  { name: "1st", value: 1 },
  { name: "2nd", value: 2 },
  { name: "3rd", value: 3 },
  { name: "4th", value: 4 },
  { name: "5th", value: 5 },
  { name: "6th", value: 6 },
  { name: "7th", value: 7 },
  { name: "8th", value: 8 },
  { name: "9th", value: 9 },
  { name: "10th", value: 10 },
  { name: "11th", value: 11 },
  { name: "12th", value: 12 },
  { name: "13th", value: 13 },
  { name: "14th", value: 14 },
  { name: "15th", value: 15 },
  { name: "16th", value: 16 },
  { name: "17th", value: 17 },
  { name: "18th", value: 18 },
  { name: "19th", value: 19 },
  { name: "20th", value: 20 },
  { name: "21st", value: 21 },
  { name: "22nd", value: 22 },
  { name: "23rd", value: 23 },
  { name: "24th", value: 24 },
  { name: "25th", value: 25 },
  { name: "26th", value: 26 },
  { name: "27th", value: 27 },
  { name: "28th", value: 28 },
  { name: "29th", value: 29 },
  { name: "30th", value: 30 },
  { name: "31st", value: 31 },
  { name: "End of the Month", value: 32 },
];

const date2 = [
  { name: "1st", value: 1 },
  { name: "2nd", value: 2 },
  { name: "3rd", value: 3 },
  { name: "4th", value: 4 },
  { name: "5th", value: 5 },
  { name: "6th", value: 6 },
  { name: "7th", value: 7 },
  { name: "8th", value: 8 },
  { name: "9th", value: 9 },
  { name: "10th", value: 10 },
  { name: "11th", value: 11 },
  { name: "12th", value: 12 },
  { name: "13th", value: 13 },
  { name: "14th", value: 14 },
  { name: "15th", value: 15 },
  { name: "16th", value: 16 },
  { name: "17th", value: 17 },
  { name: "18th", value: 18 },
];

const date3 = [
  { name: "15th", value: 15 },
  { name: "16th", value: 16 },
  { name: "17th", value: 17 },
  { name: "18th", value: 18 },
  { name: "19th", value: 19 },
  { name: "20th", value: 20 },
  { name: "21st", value: 21 },
  { name: "22nd", value: 22 },
  { name: "23rd", value: 23 },
  { name: "24th", value: 24 },
  { name: "25th", value: 25 },
  { name: "26th", value: 26 },
  { name: "27th", value: 27 },
  { name: "28th", value: 28 },
  { name: "29th", value: 29 },
  { name: "30th", value: 30 },
  { name: "31st", value: 31 },
  { name: "End of the Month", value: 32 },
];

const daysOfTheWeek = [
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
];

const expiryMonths = [
  { name: "01 - January", value: "0" },
  { name: "02 - February", value: "1" },
  { name: "03 - March", value: "2" },
  { name: "04 - April", value: "3" },
  { name: "05 - May", value: "4" },
  { name: "06 - June", value: "5" },
  { name: "07 - July", value: "6" },
  { name: "08 - August", value: "7" },
  { name: "09 - September", value: "8" },
  { name: "10 - October", value: "9" },
  { name: "11 - November", value: "10" },
  { name: "12 - December", value: "11" },
];

const incomeFrequencies = [
  { name: "Select", value: IncomeFrequency.Unknown },
  { name: "Weekly", value: IncomeFrequency.Weekly },
  { name: "Every Two Weeks", value: IncomeFrequency.BiWeekly },
  { name: "Twice per Month", value: IncomeFrequency.SemiMonthly },
  { name: "Monthly", value: IncomeFrequency.Monthly },
];
const whichDaysOptions = [{ name: "Two specific days", value: 1 }];
const monthlyPaymentOptions = [
  { name: "Specific Day", value: 1 },
  { name: "Specific Week And Day", value: 2 },
];
const paymentWeekOptions = [
  { name: "1st Week", value: 1 },
  { name: "2nd Week", value: 2 },
  { name: "3rd Week", value: 3 },
  { name: "4th Week", value: 4 },
];

// Function to handle back button press, navigating back to the Home screen
const handleBackPress = () => {
  router.push("/(tabs)/Home");
};

// Function to get the label for a given value
const getLabelForValue = (value: IncomeFrequency) => {
  const frequency = incomeFrequencies.find((freq) => freq.value === value);
  return frequency ? frequency.name : "Select";
};

const ConfigureAutopay = () => {
  // State variables for form fields
  const [paymentMethod, setPaymentMethod] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState<IncomeFrequency>(
    IncomeFrequency.Unknown
  );
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [lastPayDate, setLastPayDate] = useState(new Date());
  const [showLastPayDatePicker, setShowLastPayDatePicker] = useState(false);
  const [paydayOne, setPaydayOne] = useState("");
  const [paydayTwo, setPaydayTwo] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [showPaydayOnePicker, setShowPaydayOnePicker] = useState(false);
  const [showPaydayTwoPicker, setShowPaydayTwoPicker] = useState(false);
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);
  const [paymentWeek, setPaymentWeek] = useState("");
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [spDay, setSpDay] = useState(false);
  const [paymentSchedule, setPaymentSchedule] = useState<any>(null);
  const [amountDueMonthly, setAmountDueMonthly] = useState("");
  const [paymentSubFrequency, setPaymentSubFrequency] =
    useState<PaymentSubFrequency>(PaymentSubFrequency.Unknown);
  const [whichDays, setWhichDays] = useState("");
  const [showWhichDaysPicker, setShowWhichDaysPicker] = useState(false);
  const [selectedMonthlyPaymentOption, setSelectedMonthlyPaymentOption] =
    useState("");
  const [selectedDay, setSelectedDay] = useState("");

  // New state variables
  const [paymentDayOne, setPaymentDayOne] = useState<number | undefined>(
    undefined
  );
  const [paymentDayTwo, setPaymentDayTwo] = useState<number | undefined>(
    undefined
  );
  const [paymentWeekOne, setPaymentWeekOne] = useState<number | undefined>(
    undefined
  );
  const [paymentWeekTwo, setPaymentWeekTwo] = useState<number | undefined>(
    undefined
  );
  const [initialPaymentDate, setInitialPaymentDate] = useState<
    Date | undefined
  >(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [autoPayEnabled, setAutoPayEnabled] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<number | undefined>(undefined);
  const [nextPaymentDate, setNextPaymentDate] = useState<Date | undefined>(
    undefined
  );
  const [nextPaymentAmount, setNextPaymentAmount] = useState<
    number | undefined
  >(undefined);
  const [selectedPayDayOne, setSelectedPayDayOne] = useState("");
  const [selectedPayDayTwo, setSelectedPayDayTwo] = useState("");
  const [showPayDayOnePicker, setShowPayDayOnePicker] = useState(false);
  const [showPayDayTwoPicker, setShowPayDayTwoPicker] = useState(false);
  // States to control iOS picker visibility
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  // Retrieve token from Redux store to authenticate API requests
  const token = useSelector((state: any) => state.auth.token);

  // Map item values to names for the date options
  const date2Map = date2.reduce((acc, day) => {
    acc[day.value] = day.name;
    return acc;
  }, {} as { [key: number]: string });

  const date3Map = date3.reduce((acc, day) => {
    acc[day.value] = day.name;
    return acc;
  }, {} as { [key: number]: string });

  const isPayDayTwoValid = () => {
    if (paymentDayOne === undefined || paymentDayTwo === undefined) {
      return true; // No warning if either day is not set
    }
    return paymentDayTwo >= paymentDayOne + 7;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await fetchCustomerData(token, () => {});
        if (customerResponse) {
          const { creditSummaries } = await fetchCreditSummariesWithId(
            customerResponse,
            token
          );
          if (creditSummaries && creditSummaries.length > 0) {
            const customerId =
              creditSummaries[0]?.detail?.creditAccount?.customerId;
            const amountDue =
              creditSummaries[0]?.detail?.creditAccount?.amountDueMonthly;

            const paymentFrequency =
              creditSummaries[0]?.detail?.creditAccount?.paymentSchedule
                ?.paymentFrequency;

            setAmountDueMonthly(amountDue);

            const frequencyMap: Record<IncomeFrequency, string> = {
              [IncomeFrequency.Unknown]: "Select",
              [IncomeFrequency.Weekly]: "Weekly",
              [IncomeFrequency.BiWeekly]: "Every Two Weeks",
              [IncomeFrequency.SemiMonthly]: "Twice per Month",
              [IncomeFrequency.Monthly]: "Monthly",
            };

            const paymentFrequencyString =
              frequencyMap[paymentFrequency as IncomeFrequency] || "Select";
            setPaymentFrequency(paymentFrequency as IncomeFrequency);

            if (customerId) {
              const methods = await fetchSavedPaymentMethods(token, customerId);
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
                      .padStart(2, "0")} - ${monthNames[expirationMonth - 1]}`;

                    setExpirationMonth(formattedExpirationMonth);
                    setExpirationYear(expirationYear.toString());
                  } else if (defaultPaymentMethod.accountNumber) {
                    setAccountNumber(defaultPaymentMethod.accountNumber);
                    setRoutingNumber(defaultPaymentMethod.routingNumber || "");
                    setPaymentMethod(
                      `Checking Account - ${defaultPaymentMethod.accountNumber.slice(
                        -4
                      )}`
                    );
                  }
                }
              }
            }

            // Inside your useEffect or wherever you set these states
            const paymentSchedule =
              creditSummaries[0]?.detail?.creditAccount?.paymentSchedule;
            if (paymentSchedule) {
              setPaymentSchedule(paymentSchedule);
              updatePaymentSchedulePaymentAmount(
                paymentSchedule,
                Number(amountDue)
              );

              const initialPaymentDate = new Date(
                paymentSchedule.initialPaymentDate
              );
              setLastPayDate(initialPaymentDate);

              console.log(paymentSchedule);

              // Set and log state variables
              setPaymentDayOne(paymentSchedule.paymentDayOne);
              console.log("Payment Day One:", paymentSchedule.paymentDayOne);

              setPaymentDayTwo(paymentSchedule.paymentDayTwo);
              console.log("Payment Day Two:", paymentSchedule.paymentDayTwo);

              // Set initial values for the pickers using mapped names
              setSelectedPayDayOne(
                paymentSchedule.paymentDayOne
                  ? date2Map[paymentSchedule.paymentDayOne]
                  : ""
              );
              setSelectedPayDayTwo(
                paymentSchedule.paymentDayTwo
                  ? date3Map[paymentSchedule.paymentDayTwo]
                  : ""
              );

              setPaymentWeekOne(paymentSchedule.paymentWeekOne);
              console.log("Payment Week One:", paymentSchedule.paymentWeekOne);

              setPaymentWeekTwo(paymentSchedule.paymentWeekTwo);
              console.log("Payment Week Two:", paymentSchedule.paymentWeekTwo);

              setInitialPaymentDate(initialPaymentDate);
              console.log("Initial Payment Date:", initialPaymentDate);

              setStartDate(new Date(paymentSchedule.startDate));
              console.log("Start Date:", new Date(paymentSchedule.startDate));

              setAutoPayEnabled(paymentSchedule.autoPayEnabled);
              console.log("Auto Pay Enabled:", paymentSchedule.autoPayEnabled);

              setPaymentType(paymentSchedule.paymentType);
              console.log("Payment Type:", paymentSchedule.paymentType);

              setNextPaymentDate(new Date(paymentSchedule.nextPaymentDate));
              console.log(
                "Next Payment Date:",
                new Date(paymentSchedule.nextPaymentDate)
              );

              setNextPaymentAmount(paymentSchedule.nextPaymentAmount);
              console.log(
                "Next Payment Amount:",
                paymentSchedule.nextPaymentAmount
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Add a useEffect to update payment amount when paymentFrequency or amountDueMonthly changes
  useEffect(() => {
    if (paymentSchedule && amountDueMonthly) {
      const updatedPaymentSchedule = {
        ...paymentSchedule,
        paymentFrequency: paymentFrequency,
      };
      updatePaymentSchedulePaymentAmount(
        updatedPaymentSchedule,
        Number(amountDueMonthly)
      );
    }
  }, [paymentFrequency, amountDueMonthly]);

  // Function to format payment amount
  const formatPaymentAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Function to update payment amount based on payment schedule and amount due monthly
  const updatePaymentSchedulePaymentAmount = (
    paymentSchedule: {
      paymentFrequency: IncomeFrequency;
      paymentSubFrequency: PaymentSubFrequency | null;
      paymentAmount: number;
    },
    amountDueMonthly: number
  ) => {
    let amount = 0;

    if (paymentSchedule.paymentFrequency === IncomeFrequency.Monthly) {
      amount = amountDueMonthly;
    } else if (
      paymentSchedule.paymentFrequency === IncomeFrequency.SemiMonthly ||
      paymentSchedule.paymentFrequency === IncomeFrequency.BiWeekly
    ) {
      amount = amountDueMonthly / 2;
    } else if (paymentSchedule.paymentFrequency === IncomeFrequency.Weekly) {
      amount = amountDueMonthly / 4;
    }

    if (paymentSchedule.paymentSubFrequency !== null) {
      if (
        paymentSchedule.paymentFrequency === IncomeFrequency.SemiMonthly &&
        paymentSchedule.paymentSubFrequency === PaymentSubFrequency.SpecificDay
      ) {
        setSpDay(true);
      } else {
        setSpDay(false);
      }
    } else {
      setSpDay(false);
    }

    setPaymentAmount(formatPaymentAmount(amount));
    console.log("paymentAmount", paymentAmount);
  };

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
    }

    if (value.startsWith("Checking Account -")) {
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

    if (value === "Add Debit Card") {
      router.push("/ManagePayments");
    }

    setShowPaymentMethodPicker(false);
  };

  const openPaymentMethodPicker = () => {
    if (Platform.OS === "ios") {
      setShowFrequencyPicker(false);
      setShowDayPicker(false);
      setShowWeekPicker(false);
      setShowPaymentMethodPicker(!showPaymentMethodPicker);
    }
  };

  const openFrequencyPicker = () => {
    setShowFrequencyPicker(!showFrequencyPicker);
  };

  const openWhichDaysPicker = () => {
    setShowWhichDaysPicker(!showWhichDaysPicker);
  };
  const openPayDayOnePicker = () => {
    setShowPayDayOnePicker(!showPayDayOnePicker);
  };

  const openPayDayTwoPicker = () => {
    setShowPayDayTwoPicker(!showPayDayTwoPicker);
  };

  // Handle selection for Pay Day One
  const handlePayDayOneChange = (itemValue: string) => {
    const selectedValue = Number(itemValue);
    setSelectedPayDayOne(date2Map[selectedValue]);
    setPaymentDayOne(selectedValue); // Update the state for paymentDayOne
    setShowPayDayOnePicker(false);
  };

  // Handle selection for Pay Day Two
  const handlePayDayTwoChange = (itemValue: string) => {
    const selectedValue = Number(itemValue);
    setSelectedPayDayTwo(date3Map[selectedValue]);
    setPaymentDayTwo(selectedValue); // Update the state for paymentDayTwo
    setShowPayDayTwoPicker(false);
  };

  const getIncomeFrequencyFromString = (value: string): IncomeFrequency => {
    switch (value) {
      case "Weekly":
        return IncomeFrequency.Weekly;
      case "Every Two Weeks":
        return IncomeFrequency.BiWeekly;
      case "Twice per Month":
        return IncomeFrequency.SemiMonthly;
      case "Monthly":
        return IncomeFrequency.Monthly;
      default:
        return IncomeFrequency.Unknown;
    }
  };

  const toggleDatePicker = () => {
    if (Platform.OS === "android") {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(!showDatePicker);
    }
  };

  const onChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
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
          <Text style={styles.headerText}>Configure AutoPay</Text>
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
                    onValueChange={setPaymentMethod}
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
              {paymentMethod.startsWith("Debit Card -") ? (
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
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.helpLink}>
                  {paymentMethod.startsWith("Debit Card -")
                    ? "Help me find my card information"
                    : "Help me find my account information"}
                </Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                      {paymentMethod.startsWith("Debit Card -")
                        ? "Debit Card"
                        : "Checking Account"}
                    </Text>

                    {paymentMethod.startsWith("Debit Card -") ? (
                      <Image
                        source={require("../assets/images/debit-image.jpg")}
                        style={styles.modalImage}
                      />
                    ) : (
                      <Image
                        source={require("../assets/images/bank-account.jpg")}
                        style={styles.modalImage}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              {/* Payment Schedule */}
              <Text style={styles.helpText}>Payment will be</Text>
              {Platform.OS === "ios" ? (
                <>
                  <Pressable onPress={openFrequencyPicker}>
                    <View style={styles.pickerWrapper}>
                      <View style={styles.pickerDisplayContainer}>
                        <Text style={styles.pickerDisplayText}>
                          {getLabelForValue(paymentFrequency)}
                        </Text>
                        <FontAwesome
                          name="chevron-down"
                          size={14}
                          color="#27446F"
                        />
                      </View>
                    </View>
                  </Pressable>
                  {showFrequencyPicker && (
                    <View style={{ zIndex: 1000, position: "relative" }}>
                      <Picker
                        selectedValue={getLabelForValue(paymentFrequency)}
                        onValueChange={(itemValue) => {
                          const frequency =
                            getIncomeFrequencyFromString(itemValue);
                          console.log("Selected Frequency:", frequency); // Log the selected frequency
                          setPaymentFrequency(frequency);
                          setShowFrequencyPicker(false);
                        }}
                        style={styles.iosPicker}
                        itemStyle={{ color: "black" }}
                      >
                        {incomeFrequencies.map((frequency, index) => (
                          <Picker.Item
                            key={index}
                            label={frequency.name}
                            value={frequency.name}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={getLabelForValue(paymentFrequency)}
                    onValueChange={(itemValue) => {
                      const frequency = getIncomeFrequencyFromString(itemValue);
                      console.log("Selected Frequency:", frequency); // Log the selected frequency
                      setPaymentFrequency(frequency);
                    }}
                    style={styles.androidPicker}
                    dropdownIconColor="#000000"
                  >
                    {incomeFrequencies.map((frequency, index) => (
                      <Picker.Item
                        key={index}
                        label={frequency.name}
                        value={frequency.name}
                      />
                    ))}
                  </Picker>
                </View>
              )}
              {/* Conditionally render the "Day of Week" dropdown if payment frequency is "Weekly" */}
              {(paymentFrequency === IncomeFrequency.Weekly ||
                paymentFrequency === IncomeFrequency.BiWeekly) && (
                <>
                  <Text style={styles.helpText}>Day of Week</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable
                        onPress={() => setShowDayPicker(!showDayPicker)}
                      >
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {dayOfWeek || "Select a day"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showDayPicker && (
                        <View style={{ zIndex: 1000, position: "relative" }}>
                          <Picker
                            selectedValue={dayOfWeek}
                            onValueChange={(itemValue) => {
                              setDayOfWeek(itemValue);
                              setShowDayPicker(false);
                            }}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            {daysOfTheWeek.map((day, index) => (
                              <Picker.Item
                                key={index}
                                label={day.name}
                                value={day.name}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={dayOfWeek}
                        onValueChange={(itemValue) => setDayOfWeek(itemValue)}
                        style={styles.androidPicker}
                        dropdownIconColor="#000000"
                      >
                        {daysOfTheWeek.map((day, index) => (
                          <Picker.Item
                            key={index}
                            label={day.name}
                            value={day.name}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}
                </>
              )}

              {paymentFrequency === IncomeFrequency.Monthly && (
                <>
                  <Text style={styles.helpText}>Which days</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable
                        onPress={() =>
                          setShowWhichDaysPicker(!showWhichDaysPicker)
                        }
                      >
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {selectedMonthlyPaymentOption ||
                                "Select an option"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showWhichDaysPicker && (
                        <View style={{ zIndex: 1000, position: "relative" }}>
                          <Picker
                            selectedValue={selectedMonthlyPaymentOption}
                            onValueChange={(itemValue) => {
                              setSelectedMonthlyPaymentOption(itemValue);
                              setShowWhichDaysPicker(false);
                            }}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            {monthlyPaymentOptions.map((option, index) => (
                              <Picker.Item
                                key={index}
                                label={option.name}
                                value={option.name}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={selectedMonthlyPaymentOption}
                        onValueChange={(itemValue) =>
                          setSelectedMonthlyPaymentOption(itemValue)
                        }
                        style={styles.androidPicker}
                        dropdownIconColor="#000000"
                      >
                        {monthlyPaymentOptions.map((option, index) => (
                          <Picker.Item
                            key={index}
                            label={option.name}
                            value={option.name}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}

                  {selectedMonthlyPaymentOption === "Specific Week And Day" && (
                    <>
                      <Text style={styles.helpText}>Payment Week</Text>
                      {Platform.OS === "ios" ? (
                        <>
                          <Pressable
                            onPress={() => setShowWeekPicker(!showWeekPicker)}
                          >
                            <View style={styles.pickerWrapper}>
                              <View style={styles.pickerDisplayContainer}>
                                <Text style={styles.pickerDisplayText}>
                                  {paymentWeek || "Select a week"}
                                </Text>
                                <FontAwesome
                                  name="chevron-down"
                                  size={14}
                                  color="#27446F"
                                />
                              </View>
                            </View>
                          </Pressable>
                          {showWeekPicker && (
                            <View
                              style={{ zIndex: 1000, position: "relative" }}
                            >
                              <Picker
                                selectedValue={paymentWeek}
                                onValueChange={(itemValue) => {
                                  setPaymentWeek(itemValue);
                                  setShowWeekPicker(false);
                                }}
                                style={styles.iosPicker}
                                itemStyle={{ color: "black" }}
                              >
                                {paymentWeekOptions.map((week, index) => (
                                  <Picker.Item
                                    key={index}
                                    label={week.name}
                                    value={week.name}
                                  />
                                ))}
                              </Picker>
                            </View>
                          )}
                        </>
                      ) : (
                        <View style={styles.pickerWrapper}>
                          <Picker
                            selectedValue={paymentWeek}
                            onValueChange={(itemValue) =>
                              setPaymentWeek(itemValue)
                            }
                            style={styles.androidPicker}
                            dropdownIconColor="#000000"
                          >
                            {paymentWeekOptions.map((week, index) => (
                              <Picker.Item
                                key={index}
                                label={week.name}
                                value={week.name}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}

                      <Text style={styles.helpText}>Day of Week</Text>
                      {Platform.OS === "ios" ? (
                        <>
                          <Pressable
                            onPress={() => setShowDayPicker(!showDayPicker)}
                          >
                            <View style={styles.pickerWrapper}>
                              <View style={styles.pickerDisplayContainer}>
                                <Text style={styles.pickerDisplayText}>
                                  {dayOfWeek || "Select a day"}
                                </Text>
                                <FontAwesome
                                  name="chevron-down"
                                  size={14}
                                  color="#27446F"
                                />
                              </View>
                            </View>
                          </Pressable>
                          {showDayPicker && (
                            <View
                              style={{ zIndex: 1000, position: "relative" }}
                            >
                              <Picker
                                selectedValue={dayOfWeek}
                                onValueChange={(itemValue) => {
                                  setDayOfWeek(itemValue);
                                  setShowDayPicker(false);
                                }}
                                style={styles.iosPicker}
                                itemStyle={{ color: "black" }}
                              >
                                {daysOfTheWeek.map((day, index) => (
                                  <Picker.Item
                                    key={index}
                                    label={day.name}
                                    value={day.name}
                                  />
                                ))}
                              </Picker>
                            </View>
                          )}
                        </>
                      ) : (
                        <View style={styles.pickerWrapper}>
                          <Picker
                            selectedValue={dayOfWeek}
                            onValueChange={(itemValue) =>
                              setDayOfWeek(itemValue)
                            }
                            style={styles.androidPicker}
                            dropdownIconColor="#000000"
                          >
                            {daysOfTheWeek.map((day, index) => (
                              <Picker.Item
                                key={index}
                                label={day.name}
                                value={day.name}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </>
                  )}

                  {selectedMonthlyPaymentOption === "Specific Day" && (
                    <>
                      <Text style={styles.helpText}>Payment Date</Text>
                      {Platform.OS === "ios" ? (
                        <>
                          <Pressable
                            onPress={() =>
                              setShowPaymentDatePicker(!showPaymentDatePicker)
                            }
                          >
                            <View style={styles.pickerWrapper}>
                              <View style={styles.pickerDisplayContainer}>
                                <Text style={styles.pickerDisplayText}>
                                  {paymentDate || "Select a date"}
                                </Text>
                                <FontAwesome
                                  name="chevron-down"
                                  size={14}
                                  color="#27446F"
                                />
                              </View>
                            </View>
                          </Pressable>
                          {showPaymentDatePicker && (
                            <View
                              style={{ zIndex: 1000, position: "relative" }}
                            >
                              <Picker
                                selectedValue={paymentDate}
                                onValueChange={(itemValue) => {
                                  setPaymentDate(itemValue);
                                  setShowPaymentDatePicker(false);
                                }}
                                style={styles.iosPicker}
                                itemStyle={{ color: "black" }}
                              >
                                {dateOptions.map((day, index) => (
                                  <Picker.Item
                                    key={index}
                                    label={day.name}
                                    value={day.name}
                                  />
                                ))}
                              </Picker>
                            </View>
                          )}
                        </>
                      ) : (
                        <View style={styles.pickerWrapper}>
                          <Picker
                            selectedValue={paymentDate}
                            onValueChange={(itemValue) =>
                              setPaymentDate(itemValue)
                            }
                            style={styles.androidPicker}
                            dropdownIconColor="#000000"
                          >
                            {dateOptions.map((day, index) => (
                              <Picker.Item
                                key={index}
                                label={day.name}
                                value={day.name}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Conditionally render the "Last Pay Date" section if payment frequency is "BiWeekly" */}
              {paymentFrequency === IncomeFrequency.BiWeekly && (
                <>
                  <Text style={styles.helpText}>Last Pay Date</Text>
                  <Pressable
                    onPress={() =>
                      setShowLastPayDatePicker(!showLastPayDatePicker)
                    }
                  >
                    <View style={styles.datePickerButton}>
                      <Text style={styles.dateText}>
                        {lastPayDate ? formatDate(lastPayDate) : "MM/DD/YYYY"}
                      </Text>
                      <FontAwesome name="calendar" size={16} color="#27446F" />
                    </View>
                  </Pressable>

                  {showLastPayDatePicker && (
                    <DateTimePicker
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      value={lastPayDate}
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === "android") {
                          setShowLastPayDatePicker(false);
                        }
                        if (selectedDate) {
                          setLastPayDate(selectedDate);
                        }
                      }}
                      textColor="black"
                    />
                  )}
                </>
              )}

              {paymentFrequency === IncomeFrequency.SemiMonthly && (
                <>
                  <Text style={styles.helpText}>Which days</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={openWhichDaysPicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {whichDays || "Select an option"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showWhichDaysPicker && (
                        <View style={{ zIndex: 1000, position: "relative" }}>
                          <Picker
                            selectedValue={whichDays}
                            onValueChange={(itemValue) => {
                              setWhichDays(itemValue);
                              setShowWhichDaysPicker(false);
                            }}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            {whichDaysOptions.map((option, index) => (
                              <Picker.Item
                                key={index}
                                label={option.name}
                                value={option.value}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={whichDays}
                        onValueChange={(itemValue) => setWhichDays(itemValue)}
                        style={styles.androidPicker}
                        dropdownIconColor="#000000"
                      >
                        {whichDaysOptions.map((option, index) => (
                          <Picker.Item
                            key={index}
                            label={option.name}
                            value={option.value}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}

                  <Text style={styles.helpText}>Pay Day One</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={openPayDayOnePicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {selectedPayDayOne || "Select a day"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showPayDayOnePicker && (
                        <View style={{ zIndex: 1000, position: "relative" }}>
                          <Picker
                            selectedValue={selectedPayDayOne}
                            onValueChange={handlePayDayOneChange}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            {date2.map((day, index) => (
                              <Picker.Item
                                key={index}
                                label={day.name}
                                value={day.value.toString()}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={selectedPayDayOne}
                        onValueChange={handlePayDayOneChange}
                        style={styles.androidPicker}
                        dropdownIconColor="#000000"
                      >
                        {date2.map((day, index) => (
                          <Picker.Item
                            key={index}
                            label={day.name}
                            value={day.value.toString()}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}

                  <Text style={styles.helpText}>Pay Day Two</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={openPayDayTwoPicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {selectedPayDayTwo || "Select a day"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showPayDayTwoPicker && (
                        <View style={{ zIndex: 1000, position: "relative" }}>
                          <Picker
                            selectedValue={selectedPayDayTwo}
                            onValueChange={handlePayDayTwoChange}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            {date3.map((day, index) => (
                              <Picker.Item
                                key={index}
                                label={day.name}
                                value={day.value.toString()}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={selectedPayDayTwo}
                        onValueChange={handlePayDayTwoChange}
                        style={styles.androidPicker}
                        dropdownIconColor="#000000"
                      >
                        {date3.map((day, index) => (
                          <Picker.Item
                            key={index}
                            label={day.name}
                            value={day.value.toString()}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}
                  {!isPayDayTwoValid() && (
                    <Text style={{ color: "red", marginTop: 10 }}>
                      Day Two must be at least 7 days after Day One.
                    </Text>
                  )}
                </>
              )}

              {/* Always render the "Payment Amount" input field */}
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
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ConfigureAutopay;
