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
  cardNumber: string | null; // Card number of the payment method, can be null
  accountNumber: string | null; // Account number of the payment method, can be null
  routingNumber: string | null; // Routing number of the payment method, can be null
}

// Function to handle back button press, navigating back to the Home screen
const handleBackPress = () => {
  router.push("/(tabs)/Home"); // Navigate to the Home screen
};

const ConfigureAutopay = () => {
  // State variables for form fields
  const [paymentMethod, setPaymentMethod] = useState("Add Checking Account"); // Selected payment method, default is "Add Checking Account"
  const [routingNumber, setRoutingNumber] = useState(""); // State for routing number input
  const [accountNumber, setAccountNumber] = useState(""); // State for account number input
  const [cardNumber, setCardNumber] = useState(""); // State for card number input
  const [expirationMonth, setExpirationMonth] = useState(""); // State for expiration month input
  const [expirationYear, setExpirationYear] = useState(""); // State for expiration year input
  const [paymentFrequency, setPaymentFrequency] = useState("Weekly"); // State for payment frequency, default is "Weekly"
  const [dayOfWeek, setDayOfWeek] = useState("Monday"); // State for day of the week for payment, default is "Monday"
  const [paymentAmount, setPaymentAmount] = useState("$32.50"); // State for payment amount, default is "$32.50"
  const [date, setDate] = useState(new Date()); // State for payment start date, default is current date
  const [showDatePicker, setShowDatePicker] = useState(false); // State for visibility of date picker
  const [modalVisible, setModalVisible] = useState(false); // State for visibility of help modal
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]); // State for saved payment methods, initialized as empty array
  const [lastPayDate, setLastPayDate] = useState(new Date()); // State for last pay date
  const [showLastPayDatePicker, setShowLastPayDatePicker] = useState(false); // State for visibility of last pay date picker
  const [paydayOne, setPaydayOne] = useState("1"); // State for payday one
  const [paydayTwo, setPaydayTwo] = useState("15"); // State for payday two
  const [paymentDate, setPaymentDate] = useState("1"); // State for payment date
  const [whichDaysOption, setWhichDaysOption] = useState("Specific day"); // State for which days option
  const [showPaydayOnePicker, setShowPaydayOnePicker] = useState(false); // State for visibility of payday one picker
  const [showPaydayTwoPicker, setShowPaydayTwoPicker] = useState(false); // State for visibility of payday two picker
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false); // State for visibility of payment date picker
  const [paymentWeek, setPaymentWeek] = useState("1st week"); // State for payment week
  const [showWeekPicker, setShowWeekPicker] = useState(false); // State for visibility of week picker

  // States to control iOS picker visibility
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false); // State for visibility of payment method picker on iOS
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false); // State for visibility of payment frequency picker on iOS
  const [showDayPicker, setShowDayPicker] = useState(false); // State for visibility of day picker on iOS
  const [showWhichDaysPicker, setShowWhichDaysPicker] = useState(false); // State for visibility of which days picker on iOS

  // Retrieve token from Redux store to authenticate API requests
  const token = useSelector((state: any) => state.auth.token);

  // Fetch saved payment methods when the component mounts or token changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customer data using the token
        const customerResponse = await fetchCustomerData(token, (data) => {});
        if (customerResponse) {
          // Fetch credit summaries using customer response and token
          const { creditSummaries } = await fetchCreditSummariesWithId(
            customerResponse,
            token
          );
          if (creditSummaries && creditSummaries.length > 0) {
            // Extract customer ID from the first credit summary
            const customerId =
              creditSummaries[0]?.detail?.creditAccount?.customerId;
            if (customerId) {
              // Fetch saved payment methods using customer ID and token
              const methods = await fetchSavedPaymentMethods(token, customerId);
              if (methods && methods.length > 0) {
                // Filter valid payment methods that have either card number or account number
                const validMethods = methods.filter(
                  (method: PaymentMethod) =>
                    method.cardNumber !== null || method.accountNumber !== null
                );
                setSavedMethods(validMethods); // Update state with valid payment methods
                console.log("validMethods", validMethods);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error); // Log any errors during data fetching
      }
    };

    if (token) {
      fetchData(); // Call fetchData if token is available
    }
  }, [token]); // Dependency array ensures effect runs when token changes

  // Function to toggle date picker visibility based on platform
  const toggleDatePicker = () => {
    if (Platform.OS === "android") {
      setShowDatePicker(true); // Show date picker on Android
    } else {
      setShowDatePicker(!showDatePicker); // Toggle date picker visibility on iOS
    }
  };

  // Function to handle date change in the date picker
  const onChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false); // Hide date picker on Android after selection
    }

    if (selectedDate) {
      setDate(selectedDate); // Update date state with selected date
    }
  };

  // Function to toggle last pay date picker visibility based on platform
  const toggleLastPayDatePicker = () => {
    if (Platform.OS === "android") {
      setShowLastPayDatePicker(true); // Show last pay date picker on Android
    } else {
      setShowLastPayDatePicker(!showLastPayDatePicker); // Toggle last pay date picker visibility on iOS
    }
  };

  // Function to handle last pay date change in the date picker
  const onLastPayDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowLastPayDatePicker(false); // Hide last pay date picker on Android after selection
    }

    if (selectedDate) {
      setLastPayDate(selectedDate); // Update last pay date state with selected date
    }
  };

  // Function to toggle payday one picker visibility
  const togglePaydayOnePicker = () => {
    setShowPaydayOnePicker(!showPaydayOnePicker);
  };

  // Function to toggle payday two picker visibility
  const togglePaydayTwoPicker = () => {
    setShowPaydayTwoPicker(!showPaydayTwoPicker);
  };

  // Function to toggle payment date picker visibility
  const togglePaymentDatePicker = () => {
    setShowPaymentDatePicker(!showPaymentDatePicker);
  };

  // Function to toggle week picker visibility
  const toggleWeekPicker = () => {
    setShowWeekPicker(!showWeekPicker);
  };

  // Function to toggle which days picker visibility
  const toggleWhichDaysPicker = () => {
    if (Platform.OS === "ios") {
      setShowWhichDaysPicker(!showWhichDaysPicker); // Toggle which days picker visibility on iOS
    }
  };

  // Functions to handle iOS picker value changes with auto-close
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value); // Update payment method state

    // Check if the selected payment method is a saved debit card
    if (value.startsWith("Debit Card -")) {
      // Extract the card number from the value
      const cardNumberFromValue = value.split(" - ")[1];

      // Find the selected method from savedMethods
      const selectedMethod = savedMethods.find(
        (method) =>
          method.cardNumber && method.cardNumber.endsWith(cardNumberFromValue)
      );

      if (selectedMethod && selectedMethod.cardNumber) {
        // Format the card number to display only the last four digits
        const formattedCardNumber =
          "x".repeat(selectedMethod.cardNumber.length - 4) +
          selectedMethod.cardNumber.slice(-4);

        // Set the formatted card number
        setCardNumber(formattedCardNumber);

        // Parse the expiration date to get month and year
        const expirationDate = new Date(selectedMethod.expirationDate);
        const expirationMonth = expirationDate.getMonth() + 1; // Months are zero-based
        const expirationYear = expirationDate.getFullYear();

        // Format the expiration month
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

        // Set the formatted expiration month and year
        setExpirationMonth(formattedExpirationMonth);
        setExpirationYear(expirationYear.toString());
      }
    }

    // Check if the selected payment method is a saved checking account
    if (value.startsWith("Checking Account -")) {
      // Extract the account number from the value
      const accountNumberFromValue = value.split(" - ")[1];

      // Find the selected method from savedMethods
      const selectedMethod = savedMethods.find(
        (method) =>
          method.accountNumber &&
          method.accountNumber.endsWith(accountNumberFromValue)
      );

      if (selectedMethod) {
        // Set the account number and routing number
        setAccountNumber(selectedMethod.accountNumber || "");
        setRoutingNumber(selectedMethod.routingNumber || "");
      }
    }

    if (value === "Add Debit Card") {
      router.push("/ManagePayments"); // Navigate to the Manage Payment page if "Add Debit Card" is selected
    }

    setShowPaymentMethodPicker(false); // Close the payment method picker
  };

  const handleFrequencyChange = (value: React.SetStateAction<string>) => {
    setPaymentFrequency(value); // Update payment frequency state
    setShowFrequencyPicker(false); // Close the frequency picker
  };

  const handleDayChange = (value: React.SetStateAction<string>) => {
    setDayOfWeek(value); // Update day of week state
    setShowDayPicker(false); // Close the day picker
  };

  const handleWeekChange = (value: React.SetStateAction<string>) => {
    setPaymentWeek(value); // Update payment week state
    setShowWeekPicker(false); // Close the week picker
  };

  const handleWhichDaysChange = (value: React.SetStateAction<string>) => {
    setWhichDaysOption(value); // Update which days option state
    setShowWhichDaysPicker(false); // Close the which days picker
  };

  // Functions to open iOS pickers and reset other picker visibility
  const openPaymentMethodPicker = () => {
    if (Platform.OS === "ios") {
      setShowFrequencyPicker(false); // Hide frequency picker
      setShowDayPicker(false); // Hide day picker
      setShowWhichDaysPicker(false); // Hide which days picker
      setShowWeekPicker(false); // Hide week picker
      setShowPaymentMethodPicker(!showPaymentMethodPicker); // Toggle payment method picker visibility
    }
  };

  const openFrequencyPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false); // Hide payment method picker
      setShowDayPicker(false); // Hide day picker
      setShowWhichDaysPicker(false); // Hide which days picker
      setShowWeekPicker(false); // Hide week picker
      setShowFrequencyPicker(!showFrequencyPicker); // Toggle frequency picker visibility
    }
  };

  const openDayPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false); // Hide payment method picker
      setShowFrequencyPicker(false); // Hide frequency picker
      setShowWhichDaysPicker(false); // Hide which days picker
      setShowWeekPicker(false); // Hide week picker
      setShowDayPicker(!showDayPicker); // Toggle day picker visibility
    }
  };

  const openWeekPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false); // Hide payment method picker
      setShowFrequencyPicker(false); // Hide frequency picker
      setShowDayPicker(false); // Hide day picker
      setShowWhichDaysPicker(false); // Hide which days picker
      setShowWeekPicker(!showWeekPicker); // Toggle week picker visibility
    }
  };

  const openWhichDaysPicker = () => {
    if (Platform.OS === "ios") {
      setShowPaymentMethodPicker(false); // Hide payment method picker
      setShowFrequencyPicker(false); // Hide frequency picker
      setShowDayPicker(false); // Hide day picker
      setShowWeekPicker(false); // Hide week picker
      setShowWhichDaysPicker(!showWhichDaysPicker); // Toggle which days picker visibility
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
                          {paymentMethod}
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
                    editable={paymentMethod === "Add Debit Card"} // Make read-only if not "Add Debit Card"
                  />

                  <Text style={styles.helpText}>Expiration Month</Text>
                  <TextInput
                    style={styles.specificInput}
                    placeholder="Enter expiration month"
                    placeholderTextColor="black"
                    value={expirationMonth}
                    onChangeText={setExpirationMonth}
                    keyboardType="numeric"
                    editable={paymentMethod === "Add Debit Card"} // Make read-only if not "Add Debit Card"
                  />

                  <Text style={styles.helpText}>Expiration Year</Text>
                  <TextInput
                    style={styles.specificInput}
                    placeholder="Enter expiration year"
                    placeholderTextColor="black"
                    value={expirationYear}
                    onChangeText={setExpirationYear}
                    keyboardType="numeric"
                    editable={paymentMethod === "Add Debit Card"} // Make read-only if not "Add Debit Card"
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
                    editable={paymentMethod === "Add Checking Account"} // Make read-only if not "Add Checking Account"
                  />

                  <Text style={styles.helpText}>Account Number</Text>
                  <TextInput
                    style={styles.specificInput}
                    placeholder="Enter account number"
                    placeholderTextColor="black"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    keyboardType="numeric"
                    editable={paymentMethod === "Add Checking Account"} // Make read-only if not "Add Checking Account"
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
                    <Text>
                      {paymentMethod.startsWith("Debit Card -")
                        ? "Here you can provide information or steps to help the user find their card information."
                        : "Here you can provide information or steps to help the user find their account information."}
                    </Text>
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
                          {paymentFrequency}
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
                        itemStyle={{ color: "black" }} // Ensure picker items are black
                      >
                        <Picker.Item label="Select" value="Select" />
                        <Picker.Item label="Weekly" value="Weekly" />
                        <Picker.Item
                          label="Every Two Weeks"
                          value="Every Two Weeks"
                        />
                        <Picker.Item
                          label="Twice per Month"
                          value="Twice per Month"
                        />
                        <Picker.Item label="Monthly" value="Monthly" />
                      </Picker>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={paymentFrequency}
                    onValueChange={setPaymentFrequency}
                    style={styles.androidPicker}
                    dropdownIconColor="#000000"
                  >
                    <Picker.Item label="Select" value="Select" />
                    <Picker.Item label="Weekly" value="Weekly" />
                    <Picker.Item
                      label="Every Two Weeks"
                      value="Every Two Weeks"
                    />
                    <Picker.Item
                      label="Twice per Month"
                      value="Twice per Month"
                    />
                    <Picker.Item label="Monthly" value="Monthly" />
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
                              {dayOfWeek}
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
                            itemStyle={{ color: "black" }} // Ensure picker items are black
                          >
                            <Picker.Item label="Monday" value="Monday" />
                            <Picker.Item label="Tuesday" value="Tuesday" />
                            <Picker.Item label="Wednesday" value="Wednesday" />
                            <Picker.Item label="Thursday" value="Thursday" />
                            <Picker.Item label="Friday" value="Friday" />
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
                        <Picker.Item label="Monday" value="Monday" />
                        <Picker.Item label="Tuesday" value="Tuesday" />
                        <Picker.Item label="Wednesday" value="Wednesday" />
                        <Picker.Item label="Thursday" value="Thursday" />
                        <Picker.Item label="Friday" value="Friday" />
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
                              {dayOfWeek}
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
                            itemStyle={{ color: "black" }} // Ensure picker items are black
                          >
                            <Picker.Item label="Monday" value="Monday" />
                            <Picker.Item label="Tuesday" value="Tuesday" />
                            <Picker.Item label="Wednesday" value="Wednesday" />
                            <Picker.Item label="Thursday" value="Thursday" />
                            <Picker.Item label="Friday" value="Friday" />
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
                        <Picker.Item label="Monday" value="Monday" />
                        <Picker.Item label="Tuesday" value="Tuesday" />
                        <Picker.Item label="Wednesday" value="Wednesday" />
                        <Picker.Item label="Thursday" value="Thursday" />
                        <Picker.Item label="Friday" value="Friday" />
                      </Picker>
                    </View>
                  )}

                  <Text style={styles.helpText}>Last Pay Date</Text>
                  <Pressable onPress={toggleLastPayDatePicker}>
                    <View style={styles.datePickerButton}>
                      <Text style={styles.dateText}>
                        {lastPayDate.toDateString()}
                      </Text>
                      <FontAwesome name="calendar" size={16} color="#27446F" />
                    </View>
                  </Pressable>

                  {showLastPayDatePicker && (
                    <DateTimePicker
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      value={lastPayDate}
                      onChange={onLastPayDateChange}
                      textColor="black" // Ensure text color is black
                    />
                  )}
                </>
              )}

              {paymentFrequency === "Twice per Month" && (
                <>
                  <Text style={styles.helpText}>Which Days</Text>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable
                        onPress={() => setWhichDaysOption("Two specific days")}
                      >
                        <View style={styles.pickerWrapper}>
                          <View style={styles.pickerDisplayContainer}>
                            <Text style={styles.pickerDisplayText}>
                              {whichDaysOption}
                            </Text>
                            <FontAwesome
                              name="chevron-down"
                              size={14}
                              color="#27446F"
                            />
                          </View>
                        </View>
                      </Pressable>
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
                          label="Two specific days"
                          value="Two specific days"
                        />
                      </Picker>
                    </View>
                  )}

                  {whichDaysOption === "Two specific days" && (
                    <>
                      <Text style={styles.helpText}>Payday One</Text>
                      {Platform.OS === "ios" ? (
                        <>
                          <Pressable onPress={togglePaydayOnePicker}>
                            <View style={styles.pickerWrapper}>
                              <View style={styles.pickerDisplayContainer}>
                                <Text style={styles.pickerDisplayText}>
                                  {paydayOne === "End of the Month"
                                    ? "End of the Month"
                                    : getOrdinalSuffix(parseInt(paydayOne))}
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
                            <View
                              style={{ zIndex: 1000, position: "relative" }}
                            >
                              <Picker
                                selectedValue={paydayOne}
                                onValueChange={(value) => setPaydayOne(value)}
                                style={styles.iosPicker}
                                itemStyle={{ color: "black" }}
                              >
                                {Array.from({ length: 18 }, (_, i) => (
                                  <Picker.Item
                                    key={i}
                                    label={getOrdinalSuffix(i + 1)}
                                    value={`${i + 1}`}
                                  />
                                ))}
                              </Picker>
                            </View>
                          )}
                        </>
                      ) : (
                        <View style={styles.pickerWrapper}>
                          <Picker
                            selectedValue={paydayOne}
                            onValueChange={(value) => setPaydayOne(value)}
                            style={styles.androidPicker}
                            dropdownIconColor="#000000"
                          >
                            {Array.from({ length: 18 }, (_, i) => (
                              <Picker.Item
                                key={i}
                                label={getOrdinalSuffix(i + 1)}
                                value={`${i + 1}`}
                              />
                            ))}
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
                                  {paydayTwo === "End of the Month"
                                    ? "End of the Month"
                                    : getOrdinalSuffix(paydayTwo)}
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
                            <View
                              style={{ zIndex: 1000, position: "relative" }}
                            >
                              <Picker
                                selectedValue={paydayTwo}
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
                            selectedValue={paydayTwo}
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
                              {whichDaysOption}
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
                                  {paymentWeek}
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
                                <Picker.Item
                                  label="1st week"
                                  value="1st week"
                                />
                                <Picker.Item
                                  label="2nd week"
                                  value="2nd week"
                                />
                                <Picker.Item
                                  label="3rd week"
                                  value="3rd week"
                                />
                                <Picker.Item
                                  label="4th week"
                                  value="4th week"
                                />
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
                            <Picker.Item label="1st week" value="1st week" />
                            <Picker.Item label="2nd week" value="2nd week" />
                            <Picker.Item label="3rd week" value="3rd week" />
                            <Picker.Item label="4th week" value="4th week" />
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
                                  {dayOfWeek}
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
                                itemStyle={{ color: "black" }} // Ensure picker items are black
                              >
                                <Picker.Item label="Monday" value="Monday" />
                                <Picker.Item label="Tuesday" value="Tuesday" />
                                <Picker.Item
                                  label="Wednesday"
                                  value="Wednesday"
                                />
                                <Picker.Item
                                  label="Thursday"
                                  value="Thursday"
                                />
                                <Picker.Item label="Friday" value="Friday" />
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
                            <Picker.Item label="Monday" value="Monday" />
                            <Picker.Item label="Tuesday" value="Tuesday" />
                            <Picker.Item label="Wednesday" value="Wednesday" />
                            <Picker.Item label="Thursday" value="Thursday" />
                            <Picker.Item label="Friday" value="Friday" />
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
                placeholder="$32.50"
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
                  textColor="black" // Ensure text color is black
                />
              )}

              <Text style={styles.summaryText}>
                You have selected to pay {paymentAmount} every{" "}
                {paymentFrequency.toLowerCase()} on {dayOfWeek}, from your{" "}
                {paymentMethod.toLowerCase()} account.
              </Text>

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
