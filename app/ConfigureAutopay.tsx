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
import { router } from "expo-router";
import { styles } from "../components/styles/ConfigureAutopayStyles";
import { fetchSavedPaymentMethods } from "./services/savedPaymentMethodService";
import { useSelector } from "react-redux";
import { fetchCustomerData } from "./services/customerService";
import { fetchCreditSummariesWithId } from "./services/creditAccountService";
import { ErrorCode } from "../utils/ErrorCodeUtil";
import { useFocusEffect } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
// Define an interface for the payment method to ensure type safety
interface PaymentMethod {
  id: string;
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
  { name: "Specific Day", value: PaymentSubFrequency.SpecificDay },
  {
    name: "Specific Week And Day",
    value: PaymentSubFrequency.SpecificWeekAndDay,
  },
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

const updateDefaultPaymentMethod = async (
  creditAccountId: string | null,
  selectedPaymentMethodId: string | null,
  accountNumber: string | null,
  routingNumber: string | null,
  cardNumber: string | null,
  token: string,
  expirationMonth: string,
  expirationYear: string
) => {
  if (!creditAccountId || !selectedPaymentMethodId) {
    console.error("creditAccountId or selectedPaymentMethodId is missing");
    return {
      type: "error",
      error: { errorCode: ErrorCode.InvalidPaymentMethod },
    };
  }

  const url = `https://dev.ivitafi.com/api/creditaccount/${creditAccountId}/${selectedPaymentMethodId}/true/update-default-payment-method-customer`;

  let payload;

  if (accountNumber) {
    payload = {
      zipCode: "",
      accountNumber,
      routingNumber,
      cardNumber: null,
      expirationDate: null,
      paymentMethodType: 2,
      securityCode: "",
      truncatedAccountNumber: `****${accountNumber.slice(-4)}`,
      truncatedCardNumber: null,
      truncatedRoutingNumber: `****${routingNumber?.slice(-4)}`,
    };
  } else if (cardNumber) {
    payload = {
      zipCode: "",
      accountNumber: null,
      routingNumber: null,
      cardNumber,
      expirationDate: `${expirationMonth}/${expirationYear}`,
      paymentMethodType: 3,
      securityCode: "",
      truncatedAccountNumber: null,
      truncatedCardNumber: `****${cardNumber.slice(-4)}`,
      truncatedRoutingNumber: null,
    };
  } else {
    console.error("No payment method selected");
    return {
      type: "error",
      error: { errorCode: ErrorCode.InvalidPaymentMethod },
    };
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorData = contentType?.includes("application/json")
        ? await response.json()
        : { errorMessage: await response.text() };

      console.error("Error updating payment method:", errorData);
      return { type: "error", response: errorData };
    }

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return { type: "data", data };
  } catch (error) {
    console.error(
      "Error updating debit card information: payment method:",
      error
    );
    return { type: "error", error: { errorCode: ErrorCode.Unknown } };
  }
};

// Function to update the payment schedule
const updatePaymentSchedule = async (
  creditAccountId: string | null,
  token: string,
  payload: {
    paymentFrequency?: IncomeFrequency;
    paymentSubFrequency?: PaymentSubFrequency;
    paymentDayOne?: number;
    paymentDayTwo?: number;
    paymentWeekOne?: number;
    paymentWeekTwo?: number;
    paymentAmount?: number;
    initialPaymentDate?: Date;
    startDate?: Date;
    autoPayEnabled: boolean;
    paymentType?: number;
    nextPaymentDate?: Date;
    nextPaymentAmount?: number;
  }
) => {
  if (!creditAccountId) {
    console.error("creditAccountId is missing");
    return {
      type: "error",
      error: { errorCode: ErrorCode.InvalidPaymentMethod },
    };
  }

  const url = `https://dev.ivitafi.com/api/CreditAccount/${creditAccountId}/payment-schedule-new`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorData = contentType?.includes("application/json")
        ? await response.json()
        : { errorMessage: await response.text() };

      console.log("Error updating payment schedule:", errorData);
      return { type: "error", response: errorData };
    }

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return { type: "data", data };
  } catch (error) {
    console.log("Error updating payment schedule:", error);
    return { type: "error", error: { errorCode: ErrorCode.Unknown } };
  }
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
  const [selectedWhichDaysValue, setSelectedWhichDaysValue] = useState(1);
  const [whichDaysDisplayName, setWhichDaysDisplayName] =
    useState("Two specific days");
  const [showWhichDaysPicker, setShowWhichDaysPicker] = useState(false);
  const [selectedMonthlyPaymentOption, setSelectedMonthlyPaymentOption] =
    useState("");
  const [
    selectedMonthlyPaymentOptionValue,
    setSelectedMonthlyPaymentOptionValue,
  ] = useState<PaymentSubFrequency | undefined>(undefined);

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);

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
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [creditAccountId, setCreditAccountId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      return true;
    }
    return paymentDayTwo >= paymentDayOne + 7;
  };

  // Replace your useEffect with useFocusEffect
  useFocusEffect(
    React.useCallback(() => {
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
              const creditAccountId =
                creditSummaries[0]?.detail?.creditAccountId;

              setCreditAccountId(creditAccountId);
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

              const paymentSchedule =
                creditSummaries[0]?.detail?.creditAccount?.paymentSchedule;

              if (paymentSchedule) {
                setPaymentSchedule(paymentSchedule);
                setPaymentAmount(
                  formatPaymentAmount(paymentSchedule.paymentAmount)
                );

                const initialPaymentDate = new Date(
                  paymentSchedule.initialPaymentDate
                );
                setLastPayDate(initialPaymentDate);

                if (
                  paymentSchedule.paymentFrequency === IncomeFrequency.Weekly ||
                  paymentSchedule.paymentFrequency ===
                    IncomeFrequency.BiWeekly ||
                  paymentSchedule.paymentFrequency === IncomeFrequency.Monthly
                ) {
                  setPaymentDayOne(paymentSchedule.paymentDayOne);
                  setPaymentDayTwo(undefined);
                } else if (
                  paymentSchedule.paymentFrequency ===
                  IncomeFrequency.SemiMonthly
                ) {
                  setPaymentDayOne(paymentSchedule.paymentDayOne);
                  setPaymentDayTwo(paymentSchedule.paymentDayTwo);
                }

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
                setPaymentWeekTwo(paymentSchedule.paymentWeekTwo);

                setInitialPaymentDate(initialPaymentDate);
                setStartDate(new Date(paymentSchedule.startDate));

                setAutoPayEnabled(paymentSchedule.autoPayEnabled);
                setPaymentType(paymentSchedule.paymentType);

                setNextPaymentDate(new Date(paymentSchedule.nextPaymentDate));
                setNextPaymentAmount(paymentSchedule.nextPaymentAmount);

                if (
                  paymentSchedule.paymentFrequency === IncomeFrequency.Weekly
                ) {
                  setPaymentFrequency(IncomeFrequency.Weekly);
                  const dayOfWeekValue = paymentSchedule.paymentDayOne;
                  setDayOfWeek(
                    daysOfTheWeek.find((day) => day.value === dayOfWeekValue)
                      ?.name || ""
                  );
                } else if (
                  paymentSchedule.paymentFrequency === IncomeFrequency.BiWeekly
                ) {
                  setPaymentFrequency(IncomeFrequency.BiWeekly);
                } else if (
                  paymentSchedule.paymentFrequency ===
                  IncomeFrequency.SemiMonthly
                ) {
                  setPaymentFrequency(IncomeFrequency.SemiMonthly);
                } else if (
                  paymentSchedule.paymentFrequency === IncomeFrequency.Monthly
                ) {
                  setPaymentFrequency(IncomeFrequency.Monthly);
                  if (
                    paymentSchedule.paymentSubFrequency ===
                    PaymentSubFrequency.SpecificDay
                  ) {
                    setPaymentSubFrequency(PaymentSubFrequency.SpecificDay);
                  } else if (
                    paymentSchedule.paymentSubFrequency ===
                    PaymentSubFrequency.SpecificWeekAndDay
                  ) {
                    setPaymentSubFrequency(
                      PaymentSubFrequency.SpecificWeekAndDay
                    );
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      };

      if (token) {
        fetchData();
      } else {
        console.error("Token is missing");
      }
    }, [token])
  );

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

  const formatPaymentAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  // Function to update the payment schedule payment amount
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

    const formattedAmount = formatPaymentAmount(amount);

    setPaymentAmount(formattedAmount);
  };

  // Function to handle form submission

  const getPaymentSummaryMessage = () => {
    if (!paymentSchedule || !paymentAmount) return "";

    const paymentMethodText = paymentMethod.startsWith("Debit Card -")
      ? "from your debit card"
      : "from your checking account";

    if (paymentFrequency === IncomeFrequency.Monthly) {
      if (paymentSubFrequency === PaymentSubFrequency.SpecificDay) {
        return `You have selected to pay ${paymentAmount} on the ${paymentDate} of each month, ${paymentMethodText}.`;
      } else if (
        paymentSubFrequency === PaymentSubFrequency.SpecificWeekAndDay
      ) {
        return `You have selected to pay ${paymentAmount} on the ${paymentWeek} ${dayOfWeek} of each month, ${paymentMethodText}.`;
      }
      return `You have selected to pay ${paymentAmount} monthly, ${paymentMethodText}.`;
    }

    switch (paymentFrequency) {
      case IncomeFrequency.Weekly:
        return `You have selected to pay ${paymentAmount} every week on ${dayOfWeek}, ${paymentMethodText}.`;
      case IncomeFrequency.BiWeekly:
        return `You have selected to pay ${paymentAmount} every other ${dayOfWeek}, ${paymentMethodText}. In months with more than 2 pay periods, you will only make 2 payments.`;
      case IncomeFrequency.SemiMonthly:
        return `You have selected to pay ${paymentAmount} on the ${selectedPayDayOne} and ${selectedPayDayTwo} of each month, ${paymentMethodText}.`;
      default:
        return "";
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

    if (value === "Add Debit Card") {
      router.push("/ManagePayments");
    }

    setShowPaymentMethodPicker(false);
  };

  useEffect(() => {
    if (selectedPaymentMethodId) {
    }
  }, [selectedPaymentMethodId]);

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

  const handlePayDayOneChange = (itemValue: string) => {
    const selectedValue = Number(itemValue);
    setSelectedPayDayOne(date2Map[selectedValue]);
    setPaymentDayOne(selectedValue);

    setShowPayDayOnePicker(false);
  };

  const handlePayDayTwoChange = (itemValue: string) => {
    const selectedValue = Number(itemValue);
    setSelectedPayDayTwo(date3Map[selectedValue]);
    setPaymentDayTwo(selectedValue);

    setShowPayDayTwoPicker(false);
  };

  const handlePaymentSubFrequencyChange = (itemValue: string) => {
    const selectedValue = Number(itemValue);
    const selectedOption = whichDaysOptions.find(
      (option) => option.value === selectedValue
    );

    if (selectedOption) {
      setSelectedWhichDaysValue(selectedOption.value);
      setWhichDaysDisplayName(selectedOption.name);

      if (selectedOption.value === 1) {
        setPaymentSubFrequency(PaymentSubFrequency.SpecificDay);
      } else if (selectedOption.value === 2) {
        setPaymentSubFrequency(PaymentSubFrequency.SpecificWeekAndDay);
      }
    }
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };
  const handleSubmit = async () => {
    if (creditAccountId && selectedPaymentMethodId && token) {
      const result = await updateDefaultPaymentMethod(
        creditAccountId,
        selectedPaymentMethodId,
        accountNumber,
        routingNumber,
        cardNumber,
        token,
        expirationMonth,
        expirationYear
      );

      if (result) {
        if (result.type === "data") {
          const safeNextPaymentAmount = parseFloat(
            paymentAmount.replace(/[^0-9.-]/g, "")
          );

          if (isNaN(safeNextPaymentAmount)) {
            console.error("Invalid payment amount");
            return;
          }

          let safePaymentSubFrequency = paymentSubFrequency;
          let safePaymentDayOne = paymentDayOne;
          let safePaymentDayTwo = paymentDayTwo;
          let safePaymentWeekOne = paymentWeekOne;

          if (paymentFrequency === IncomeFrequency.Monthly) {
            if (paymentSubFrequency === PaymentSubFrequency.SpecificDay) {
              safePaymentDayOne = Number(paymentDate);
            } else if (
              paymentSubFrequency === PaymentSubFrequency.SpecificWeekAndDay
            ) {
              safePaymentDayOne = Number(paymentWeek);
              safePaymentWeekOne = daysOfTheWeek.find(
                (day) => day.name === dayOfWeek
              )?.value;
            }
          } else if (
            paymentFrequency === IncomeFrequency.Weekly ||
            paymentFrequency === IncomeFrequency.BiWeekly
          ) {
            safePaymentSubFrequency = 0;
            safePaymentDayOne =
              daysOfTheWeek.find((day) => day.name === dayOfWeek)?.value || 0;
            safePaymentWeekOne = 0;
          } else if (paymentFrequency === IncomeFrequency.SemiMonthly) {
            safePaymentSubFrequency = PaymentSubFrequency.SpecificDay;
          }

          const payload = {
            autoPayEnabled: true,
            paymentFrequency,
            paymentSubFrequency: safePaymentSubFrequency,
            paymentDayOne: safePaymentDayOne,
            paymentDayTwo: safePaymentDayTwo,
            paymentWeekOne: safePaymentWeekOne,
            paymentWeekTwo: paymentWeekTwo,
            paymentAmount: safeNextPaymentAmount,
            initialPaymentDate: initialPaymentDate
              ? new Date(initialPaymentDate)
              : new Date(),
            startDate: date ? new Date(date) : new Date(),
            paymentType: paymentType ?? 0,
            nextPaymentDate:
              nextPaymentDate && !isNaN(nextPaymentDate.getTime())
                ? new Date(nextPaymentDate)
                : new Date(),
            nextPaymentAmount: safeNextPaymentAmount,
          };

          const scheduleResult = await updatePaymentSchedule(
            creditAccountId,
            token,
            payload
          );

          if (scheduleResult) {
            if (scheduleResult.type === "data") {
              // Show a toast notification on successful update
              Toast.show({
                type: "success",
                text1: "Payment Updated Successfully",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
              });

              // Refresh the page by refetching the data
              const customerResponse = await fetchCustomerData(token, () => {});
              if (customerResponse) {
                const { creditSummaries } = await fetchCreditSummariesWithId(
                  customerResponse,
                  token
                );

                if (creditSummaries && creditSummaries.length > 0) {
                  const paymentSchedule =
                    creditSummaries[0]?.detail?.creditAccount?.paymentSchedule;
                  if (paymentSchedule) {
                    setPaymentAmount(
                      formatPaymentAmount(paymentSchedule.paymentAmount)
                    );
                  }
                }
              }
            } else {
              console.log("Failed to update payment schedule");
            }
          }
        }
      }
    } else {
      console.log(
        "creditAccountId, selectedPaymentMethodId, or token is missing"
      );
    }
  };

  // Function to handle the press event of the "Turn off AutoPay" text
  const handleTurnOffAutoPayPress = () => {
    setIsModalVisible(true);
  };

  // Function to handle the OK button press in the modal
  const handleOKPress = () => {
    setIsModalVisible(false);
  }; // Modal structure
  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        setIsModalVisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Information</Text>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalText}>
            For assistance, please contact Customer Care at (800) 341-2316.
            Support is available Monday through Friday, from 9:00 AM to 7:00 PM
            Eastern Time.
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleOKPress}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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

                          setPaymentFrequency(frequency);
                          setShowFrequencyPicker(false);
                        }}
                        style={styles.iosPicker}
                        itemStyle={{ color: "black" }}
                      >
                        {incomeFrequencies.map((frequency, index) => {
                          return (
                            <Picker.Item
                              key={index}
                              label={frequency.name}
                              value={frequency.name}
                            />
                          );
                        })}
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
                      console.log("Selected Frequency:", frequency);
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
                              console.log("Selected Item Value:", itemValue);
                              const selectedDay = daysOfTheWeek.find(
                                (day) =>
                                  day.value == (itemValue as unknown as number)
                              );
                              if (selectedDay) {
                                setDayOfWeek(selectedDay.name);
                                console.log(
                                  "Selected Day Name:",
                                  selectedDay.name
                                );
                              }
                              setShowDayPicker(false);
                            }}
                            style={styles.iosPicker}
                            itemStyle={{ color: "black" }}
                          >
                            {daysOfTheWeek.map((day, index) => (
                              <Picker.Item
                                key={index}
                                label={day.name}
                                value={day.value}
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
                        onValueChange={(itemValue) => {
                          console.log("Selected Item Value:", itemValue);
                          const selectedDay = daysOfTheWeek.find(
                            (day) => day.value === Number(itemValue)
                          );
                          if (selectedDay) {
                            setDayOfWeek(selectedDay.name);
                            console.log("Selected Day Name:", selectedDay.name);
                          }
                        }}
                        style={styles.iosPicker}
                        itemStyle={{ color: "black" }}
                      >
                        {daysOfTheWeek.map((day, index) => (
                          <Picker.Item
                            key={index}
                            label={day.name}
                            value={String(day.value)}
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
                              if (itemValue === "Specific Week And Day") {
                                setPaymentSubFrequency(
                                  PaymentSubFrequency.SpecificWeekAndDay
                                );
                              } else if (itemValue === "Specific Day") {
                                setPaymentSubFrequency(
                                  PaymentSubFrequency.SpecificDay
                                );
                              }
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
                        onValueChange={(itemValue) => {
                          setSelectedMonthlyPaymentOption(itemValue);
                          if (itemValue === "Specific Week And Day") {
                            setPaymentSubFrequency(
                              PaymentSubFrequency.SpecificWeekAndDay
                            );
                          } else if (itemValue === "Specific Day") {
                            setPaymentSubFrequency(
                              PaymentSubFrequency.SpecificDay
                            );
                          }
                        }}
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
                                    value={week.value}
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
                                value={week.value}
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
                                    value={day.value}
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
                                value={day.value}
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
                                    value={day.value}
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
                                value={day.value}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </>
                  )}
                </>
              )}
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
                              {whichDaysDisplayName || "Select an option"}
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
                            selectedValue={selectedWhichDaysValue.toString()}
                            onValueChange={handlePaymentSubFrequencyChange}
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
                        selectedValue={selectedWhichDaysValue.toString()}
                        onValueChange={handlePaymentSubFrequencyChange}
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

                  <Text style={styles.helpText}>Payday One</Text>
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
                                value={day.value}
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
                            value={day.value}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}

                  <Text style={styles.helpText}>Payday Two</Text>
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
                                value={day.value}
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
                            value={day.value}
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
              <Text style={styles.summaryText}>
                {getPaymentSummaryMessage()}
              </Text>
              <View style={styles.container}>
                {renderModal()}

                <TouchableOpacity onPress={handleTurnOffAutoPayPress}>
                  <Text style={styles.turnOffAutoPayText}>
                    Turn off AutoPay
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
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
