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

// Helper function to append ordinal suffix to a number
const getOrdinalSuffix = (day: number | string) => {
  if (day === "End of the Month") {
    return day;
  }

  const numDay = typeof day === "string" ? parseInt(day, 10) : day;
  const j = numDay % 10,
    k = numDay % 100;
  if (j === 1 && k !== 11) {
    return numDay + "st";
  }
  if (j === 2 && k !== 12) {
    return numDay + "nd";
  }
  if (j === 3 && k !== 13) {
    return numDay + "rd";
  }
  return numDay + "th";
};

// Define an interface for the payment method to ensure type safety
interface PaymentMethod {
  expirationDate: string | number | Date;
  cardNumber: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
}

const daysOfTheWeek = [
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
];

const weeksOfTheMonth = [
  { name: "1st Week", value: 1 },
  { name: "2nd Week", value: 2 },
  { name: "3rd Week", value: 3 },
  { name: "4th Week", value: 4 },
];

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

// Array of income frequencies for the dropdown
const incomeFrequencies = [
  { name: "Select", value: IncomeFrequency.Unknown },
  { name: "Weekly", value: IncomeFrequency.Weekly },
  { name: "Every Two Weeks", value: IncomeFrequency.BiWeekly },
  { name: "Twice per Month", value: IncomeFrequency.SemiMonthly },
  { name: "Monthly", value: IncomeFrequency.Monthly },
];

// Array of payment sub-frequencies for the dropdown
const paymentSubFrequencies = [
  { name: "Specific Day", value: PaymentSubFrequency.SpecificDay },
  {
    name: "Specific Week And Day",
    value: PaymentSubFrequency.SpecificWeekAndDay,
  },
  {
    name: "Business Days After Day",
    value: PaymentSubFrequency.BusinessDaysAfterDay,
  },
];

// Function to handle back button press, navigating back to the Home screen
const handleBackPress = () => {
  router.push("/(tabs)/Home");
};

const ConfigureAutopay = () => {
  // State variables for form fields
  const [paymentMethod, setPaymentMethod] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("");
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
  const [whichDaysOption, setWhichDaysOption] = useState("");
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

  // States to control iOS picker visibility
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showWhichDaysPicker, setShowWhichDaysPicker] = useState(false);
  const [showSubFrequencyPicker, setShowSubFrequencyPicker] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Retrieve token from Redux store to authenticate API requests
  const token = useSelector((state: any) => state.auth.token);

  // Fetch saved payment methods and credit summaries when the component mounts or token changes
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
            const amountDue =
              creditSummaries[0]?.detail?.creditAccount?.amountDueMonthly;
            const paymentAmount =
              creditSummaries[0]?.detail?.creditAccount?.paymentSchedule
                ?.paymentAmount;
            const paymentFrequency =
              creditSummaries[0]?.detail?.creditAccount?.paymentSchedule
                ?.paymentFrequency;

            setAmountDueMonthly(amountDue);
            setPaymentAmount(formatPaymentAmount(paymentAmount));

            const frequencyMap: Record<IncomeFrequency, string> = {
              [IncomeFrequency.Unknown]: "Select",
              [IncomeFrequency.Weekly]: "Weekly",
              [IncomeFrequency.BiWeekly]: "Every Two Weeks",
              [IncomeFrequency.SemiMonthly]: "Twice per Month",
              [IncomeFrequency.Monthly]: "Monthly",
            };

            const paymentFrequencyString =
              frequencyMap[paymentFrequency as IncomeFrequency] || "Select";
            setPaymentFrequency(paymentFrequencyString);

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

            const paymentSchedule =
              creditSummaries[0]?.detail?.creditAccount?.paymentSchedule;
            if (paymentSchedule) {
              setPaymentSchedule(paymentSchedule);
              updatePaymentSchedulePaymentAmount(
                paymentSchedule,
                Number(amountDue)
              );
              const mappedSchedule = mapPaymentSchedule(paymentSchedule);
              setDayOfWeek(mappedSchedule.paymentDayOneLabel);
              setPaydayOne(mappedSchedule.paymentDayOneLabel);
              setPaydayTwo(mappedSchedule.paymentDayTwoLabel);
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
  };

  // Function to map payment schedule data
  const mapPaymentSchedule = (paymentSchedule: {
    paymentFrequency: number;
    paymentSubFrequency: number;
    paymentDayOne: number;
    paymentDayTwo: number;
    paymentWeekOne: number;
    paymentWeekTwo: number;
  }) => {
    let paymentFrequencyLabel = "";
    let paymentSubFrequencyLabel = "";
    let paymentDayOneLabel = "";
    let paymentDayTwoLabel = "";
    let paymentWeekOneLabel = "";
    let paymentWeekTwoLabel = "";

    // Map payment frequency
    switch (paymentSchedule.paymentFrequency) {
      case IncomeFrequency.Weekly:
        paymentFrequencyLabel = "Weekly";
        break;
      case IncomeFrequency.BiWeekly:
        paymentFrequencyLabel = "Every Two Weeks";
        break;
      case IncomeFrequency.SemiMonthly:
        paymentFrequencyLabel = "Twice per Month";
        break;
      case IncomeFrequency.Monthly:
        paymentFrequencyLabel = "Monthly";
        break;
      default:
        paymentFrequencyLabel = "Unknown";
    }

    // Map payment sub-frequency
    switch (paymentSchedule.paymentSubFrequency) {
      case PaymentSubFrequency.SpecificDay:
        paymentSubFrequencyLabel = "Specific Day";
        break;
      case PaymentSubFrequency.SpecificWeekAndDay:
        paymentSubFrequencyLabel = "Specific Week And Day";
        break;
      case PaymentSubFrequency.BusinessDaysAfterDay:
        paymentSubFrequencyLabel = "Business Days After Day";
        break;
      default:
        paymentSubFrequencyLabel = "Unknown";
    }

    // Map payment day one
    const dayOne = daysOfTheWeek.find(
      (day) => day.value === paymentSchedule.paymentDayOne
    );
    paymentDayOneLabel = dayOne ? dayOne.name : "Unknown";

    // Map payment day two
    const dayTwo = daysOfTheWeek.find(
      (day) => day.value === paymentSchedule.paymentDayTwo
    );
    paymentDayTwoLabel = dayTwo ? dayTwo.name : "Unknown";

    // Map payment week one
    const weekOne = weeksOfTheMonth.find(
      (week) => week.value === paymentSchedule.paymentWeekOne
    );
    paymentWeekOneLabel = weekOne ? weekOne.name : "Unknown";

    // Map payment week two
    const weekTwo = weeksOfTheMonth.find(
      (week) => week.value === paymentSchedule.paymentWeekTwo
    );
    paymentWeekTwoLabel = weekTwo ? weekTwo.name : "Unknown";

    return {
      paymentFrequencyLabel,
      paymentSubFrequencyLabel,
      paymentDayOneLabel,
      paymentDayTwoLabel,
      paymentWeekOneLabel,
      paymentWeekTwoLabel,
    };
  };

  const examplePaymentSchedule = {
    paymentFrequency: 3,
    paymentSubFrequency: 2,
    paymentDayOne: 1,
    paymentDayTwo: 5,
    paymentWeekOne: 1,
    paymentWeekTwo: 2,
  };

  const {
    paymentFrequencyLabel,
    paymentSubFrequencyLabel,
    paymentDayOneLabel,
    paymentDayTwoLabel,
    paymentWeekOneLabel,
    paymentWeekTwoLabel,
  } = mapPaymentSchedule(examplePaymentSchedule);

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

  const toggleLastPayDatePicker = () => {
    if (Platform.OS === "android") {
      setShowLastPayDatePicker(true);
    } else {
      setShowLastPayDatePicker(!showLastPayDatePicker);
    }
  };

  const onLastPayDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowLastPayDatePicker(false);
    }

    if (selectedDate) {
      setLastPayDate(selectedDate);
    }
  };

  const togglePaydayOnePicker = () => {
    setShowPaydayOnePicker(!showPaydayOnePicker);
  };

  const togglePaydayTwoPicker = () => {
    setShowPaydayTwoPicker(!showPaydayTwoPicker);
  };

  const togglePaymentDatePicker = () => {
    setShowPaymentDatePicker(!showPaymentDatePicker);
  };

  const toggleWeekPicker = () => {
    setShowWeekPicker(!showWeekPicker);
  };

  const toggleWhichDaysPicker = () => {
    if (Platform.OS === "ios") {
      setShowWhichDaysPicker(!showWhichDaysPicker);
    }
  };

  const toggleSubFrequencyPicker = () => {
    if (Platform.OS === "ios") {
      setShowSubFrequencyPicker(!showSubFrequencyPicker);
    }
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

  const handleFrequencyChange = (value: string) => {
    setPaymentFrequency(value);

    const frequencyMap: { [key: string]: IncomeFrequency } = {
      Weekly: IncomeFrequency.Weekly,
      "Every Two Weeks": IncomeFrequency.BiWeekly,
      "Twice per Month": IncomeFrequency.SemiMonthly,
      Monthly: IncomeFrequency.Monthly,
    };

    const selectedFrequency = frequencyMap[value] || IncomeFrequency.Unknown;

    if (paymentSchedule) {
      paymentSchedule.paymentFrequency = selectedFrequency;
      updatePaymentSchedulePaymentAmount(
        paymentSchedule,
        Number(amountDueMonthly)
      );
    }

    setShowFrequencyPicker(false);
  };

  const handleDayChange = (value: React.SetStateAction<string>) => {
    setDayOfWeek(value);
    setShowDayPicker(false);
  };

  const handleWeekChange = (value: React.SetStateAction<string>) => {
    setPaymentWeek(value);
    setShowWeekPicker(false);
  };

  const handleWhichDaysChange = (value: React.SetStateAction<string>) => {
    setWhichDaysOption(value);
    setShowWhichDaysPicker(false);
  };

  const handleSubFrequencyChange = (value: PaymentSubFrequency) => {
    setPaymentSubFrequency(value);

    if (paymentSchedule) {
      paymentSchedule.paymentSubFrequency = value;
    }

    setShowSubFrequencyPicker(false);
  };

  const openPaymentMethodPicker = () => {
    if (Platform.OS === "ios") {
      setShowFrequencyPicker(false);
      setShowDayPicker(false);
      setShowWhichDaysPicker(false);
      setShowWeekPicker(false);
      setShowSubFrequencyPicker(false);
      setShowPaymentMethodPicker(!showPaymentMethodPicker);
    }
  };

  const openFrequencyPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false);
      setShowDayPicker(false);
      setShowWhichDaysPicker(false);
      setShowWeekPicker(false);
      setShowSubFrequencyPicker(false);
      setShowFrequencyPicker(!showFrequencyPicker);
    }
  };

  const openDayPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false);
      setShowFrequencyPicker(false);
      setShowWhichDaysPicker(false);
      setShowWeekPicker(false);
      setShowSubFrequencyPicker(false);
      setShowDayPicker(!showDayPicker);
    }
  };

  const openWeekPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false);
      setShowFrequencyPicker(false);
      setShowDayPicker(false);
      setShowWhichDaysPicker(false);
      setShowSubFrequencyPicker(false);
      setShowWeekPicker(!showWeekPicker);
    }
  };

  const openWhichDaysPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false);
      setShowFrequencyPicker(false);
      setShowDayPicker(false);
      setShowWeekPicker(false);
      setShowSubFrequencyPicker(false);
      setShowWhichDaysPicker(!showWhichDaysPicker);
    }
  };

  const openSubFrequencyPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false);
      setShowFrequencyPicker(false);
      setShowDayPicker(false);
      setShowWhichDaysPicker(false);
      setShowWeekPicker(false);
      setShowSubFrequencyPicker(!showSubFrequencyPicker);
    }
  };

  const generateConfirmationMessage = (
    paymentFrequency: string,
    paymentAmount: string,
    dayOfWeek: string,
    paymentMethod: string
  ) => {
    switch (paymentFrequency) {
      case "Weekly":
        return `You have selected to pay ${paymentAmount} every week on ${dayOfWeek}, from your ${paymentMethod}.`;
      case "Every Two Weeks":
        return `You have selected to pay ${paymentAmount} every other ${dayOfWeek}, from your ${paymentMethod}. In months with more than 2 pay periods, you will only make 2 payments.`;
      case "Twice per Month":
        return `You have selected to pay ${paymentAmount} on the 1st and 5th of each month, from your ${paymentMethod}.`;
      case "Monthly":
        return `You have selected to pay ${paymentAmount} on the 1st of each month, from your ${paymentMethod}.`;
      default:
        return "";
    }
  };

  const confirmationMessage = generateConfirmationMessage(
    paymentFrequency,
    paymentAmount,
    dayOfWeek,
    paymentMethod.startsWith("Debit Card -") ? "debit card" : "checking account"
  );

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

              <Text style={styles.helpText}>Payment will be</Text>
              {Platform.OS === "ios" ? (
                <>
                  <Pressable onPress={openFrequencyPicker}>
                    <View style={styles.pickerWrapper}>
                      <View style={styles.pickerDisplayContainer}>
                        <Text style={styles.pickerDisplayText}>
                          {paymentFrequency || "Select frequency"}
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
                        selectedValue={paymentFrequency}
                        onValueChange={handleFrequencyChange}
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
                    selectedValue={paymentFrequency}
                    onValueChange={handleFrequencyChange}
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

              {paymentFrequency === "Weekly" && (
                <>
                  <Text style={styles.helpText}>Day of Week</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={openDayPicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {dayOfWeek || "Select day"}
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
                            onValueChange={handleDayChange}
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
                        onValueChange={setDayOfWeek}
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

              {paymentFrequency === "Every Two Weeks" && (
                <>
                  <Text style={styles.helpText}>Day of Week</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={openDayPicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {dayOfWeek || "Select day"}
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
                            onValueChange={handleDayChange}
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
                        onValueChange={setDayOfWeek}
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

                  {/* Last Pay Date Picker */}
                  <Text style={styles.helpText}>Last Pay Date</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={toggleLastPayDatePicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {lastPayDate
                                ? lastPayDate.toDateString()
                                : "Select date"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showLastPayDatePicker && (
                        <DateTimePicker
                          value={lastPayDate || new Date()}
                          mode="date"
                          display="default"
                          onChange={onLastPayDateChange}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Pressable onPress={toggleLastPayDatePicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {lastPayDate
                                ? lastPayDate.toDateString()
                                : "Select date"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showLastPayDatePicker && (
                        <DateTimePicker
                          value={lastPayDate || new Date()}
                          mode="date"
                          display="default"
                          onChange={onLastPayDateChange}
                        />
                      )}
                    </>
                  )}
                </>
              )}

              {paymentFrequency === "Twice per Month" && (
                <>
                  <Text style={styles.helpText}>Payday One</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={togglePaydayOnePicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {paymentDayOneLabel || "Select day"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showPaydayOnePicker && (
                        <View style={{ zIndex: 1000, position: "relative" }}>
                          <Picker
                            selectedValue={paymentDayOneLabel}
                            onValueChange={(value) => setPaydayOne(value)}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            {Array.from({ length: 31 }, (_, i) => (
                              <Picker.Item
                                key={i}
                                label={getOrdinalSuffix(i + 1)}
                                value={`${i + 1}`}
                              />
                            ))}
                            <Picker.Item
                              label="End of the Month"
                              value="End of the Month"
                            />
                          </Picker>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={paymentDayOneLabel}
                        onValueChange={(value) => setPaydayOne(value)}
                        style={styles.androidPicker}
                        dropdownIconColor="#000000"
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <Picker.Item
                            key={i}
                            label={getOrdinalSuffix(i + 1)}
                            value={`${i + 1}`}
                          />
                        ))}
                        <Picker.Item
                          label="End of the Month"
                          value="End of the Month"
                        />
                      </Picker>
                    </View>
                  )}

                  <Text style={styles.helpText}>Payday Two</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={togglePaydayTwoPicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {paymentDayTwoLabel || "Select day"}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
                      {showPaydayTwoPicker && (
                        <View style={{ zIndex: 1000, position: "relative" }}>
                          <Picker
                            selectedValue={paymentDayTwoLabel}
                            onValueChange={(value) => setPaydayTwo(value)}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            {Array.from({ length: 31 }, (_, i) => (
                              <Picker.Item
                                key={i}
                                label={getOrdinalSuffix(i + 1)}
                                value={`${i + 1}`}
                              />
                            ))}
                            <Picker.Item
                              label="End of the Month"
                              value="End of the Month"
                            />
                          </Picker>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={paymentDayTwoLabel}
                        onValueChange={(value) => setPaydayTwo(value)}
                        style={styles.androidPicker}
                        dropdownIconColor="#000000"
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <Picker.Item
                            key={i}
                            label={getOrdinalSuffix(i + 1)}
                            value={`${i + 1}`}
                          />
                        ))}
                        <Picker.Item
                          label="End of the Month"
                          value="End of the Month"
                        />
                      </Picker>
                    </View>
                  )}
                </>
              )}

              {paymentFrequency === "Monthly" && (
                <>
                  <Text style={styles.helpText}>Which Days</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable onPress={openWhichDaysPicker}>
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {whichDaysOption || "Select days option"}
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
                            selectedValue={whichDaysOption}
                            onValueChange={handleWhichDaysChange}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            <Picker.Item
                              label="Specific day"
                              value="Specific day"
                            />
                            <Picker.Item
                              label="Specific week and day"
                              value="Specific week and day"
                            />
                          </Picker>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={whichDaysOption}
                        onValueChange={(value) => setWhichDaysOption(value)}
                        style={styles.androidPicker}
                        dropdownIconColor="#000000"
                      >
                        <Picker.Item
                          label="Specific day"
                          value="Specific day"
                        />
                        <Picker.Item
                          label="Specific week and day"
                          value="Specific week and day"
                        />
                      </Picker>
                    </View>
                  )}

                  {whichDaysOption === "Specific day" && (
                    <>
                      <Text style={styles.helpText}>Payment Date</Text>
                      {Platform.OS === "ios" ? (
                        <>
                          <Pressable onPress={togglePaymentDatePicker}>
                            <View style={styles.pickerWrapper}>
                              <View style={styles.pickerDisplayContainer}>
                                <Text style={styles.pickerDisplayText}>
                                  {paymentDate === "End of the Month"
                                    ? "End of the Month"
                                    : getOrdinalSuffix(parseInt(paymentDate))}
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
                                onValueChange={(value) => setPaymentDate(value)}
                                style={styles.iosPicker}
                                itemStyle={{ color: "black" }}
                              >
                                {Array.from({ length: 31 }, (_, i) => (
                                  <Picker.Item
                                    key={i}
                                    label={getOrdinalSuffix(i + 1)}
                                    value={`${i + 1}`}
                                  />
                                ))}
                                <Picker.Item
                                  label="End of the Month"
                                  value="End of the Month"
                                />
                              </Picker>
                            </View>
                          )}
                        </>
                      ) : (
                        <View style={styles.pickerWrapper}>
                          <Picker
                            selectedValue={paymentDate}
                            onValueChange={(value) => setPaymentDate(value)}
                            style={styles.androidPicker}
                            dropdownIconColor="#000000"
                          >
                            {Array.from({ length: 31 }, (_, i) => (
                              <Picker.Item
                                key={i}
                                label={getOrdinalSuffix(i + 1)}
                                value={`${i + 1}`}
                              />
                            ))}
                            <Picker.Item
                              label="End of the Month"
                              value="End of the Month"
                            />
                          </Picker>
                        </View>
                      )}
                    </>
                  )}

                  {whichDaysOption === "Specific week and day" && (
                    <>
                      <Text style={styles.helpText}>Payment Week</Text>
                      {Platform.OS === "ios" ? (
                        <>
                          <Pressable onPress={openWeekPicker}>
                            <View style={styles.pickerWrapper}>
                              <View style={styles.pickerDisplayContainer}>
                                <Text style={styles.pickerDisplayText}>
                                  {paymentWeek || "Select week"}
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
                                onValueChange={handleWeekChange}
                                style={styles.iosPicker}
                                itemStyle={{ color: "black" }}
                              >
                                {weeksOfTheMonth.map((week, index) => (
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
                            onValueChange={setPaymentWeek}
                            style={styles.androidPicker}
                            dropdownIconColor="#000000"
                          >
                            {weeksOfTheMonth.map((week, index) => (
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
                          <Pressable onPress={openDayPicker}>
                            <View style={styles.pickerWrapper}>
                              <View style={styles.pickerDisplayContainer}>
                                <Text style={styles.pickerDisplayText}>
                                  {dayOfWeek || "Select day"}
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
                                onValueChange={handleDayChange}
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
                            onValueChange={setDayOfWeek}
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
                </>
              )}

              <Text style={styles.helpText}>Payment Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Payment amount"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="decimal-pad"
              />

              <Text style={styles.helpText}>Payment Start Date</Text>
              <Pressable onPress={toggleDatePicker}>
                <View style={styles.datePickerButton}>
                  <Text style={styles.dateText}>{date.toDateString()}</Text>
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

              <Text style={styles.confirmationText}>{confirmationMessage}</Text>

              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

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
              <Text style={styles.modalText}>Account Information Help</Text>
              <Text>
                Here you can provide information or steps to help the user find
                their account information.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              ></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ConfigureAutopay;
