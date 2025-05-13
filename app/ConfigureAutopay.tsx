import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from '../components/styles/ConfigureAutopayStyles';

const handleBackPress = () => {
  router.push("/(tabs)/Home");
};

const ConfigureAutopay = () => {
  const [paymentMethod, setPaymentMethod] = useState("Add Checking Account");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("Weekly");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [paymentAmount, setPaymentAmount] = useState("$32.50");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Added states to control iOS picker visibility
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const toggleDatePicker = () => {
    if (Platform.OS === 'android') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(!showDatePicker);
    }
  };

  const onChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Functions to handle iOS picker value changes with auto-close
  const handlePaymentMethodChange = (value: React.SetStateAction<string>) => {
    setPaymentMethod(value);
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        setShowPaymentMethodPicker(false);
      }, 0);
    }
  };

  const handleFrequencyChange = (value: React.SetStateAction<string>) => {
    setPaymentFrequency(value);
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        setShowFrequencyPicker(false);
      }, 0);
    }
  };

  const handleDayChange = (value: React.SetStateAction<string>) => {
    setDayOfWeek(value);
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        setShowDayPicker(false);
      }, 0);
    }
  };

  // Reset all other picker visibility when opening a new one (iOS only)
  const openPaymentMethodPicker = () => {
    if (Platform.OS === 'ios') {
      setShowFrequencyPicker(false);
      setShowDayPicker(false);
      setShowPaymentMethodPicker(!showPaymentMethodPicker);
    }
  };

  const openFrequencyPicker = () => {
    if (Platform.OS === 'ios') {
      setShowPaymentMethodPicker(false);
      setShowDayPicker(false);
      setShowFrequencyPicker(!showFrequencyPicker);
    }
  };

  const openDayPicker = () => {
    if (Platform.OS === 'ios') {
      setShowPaymentMethodPicker(false);
      setShowFrequencyPicker(false);
      setShowDayPicker(!showDayPicker);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Configure AutoPay</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <Text style={styles.helpText}>Payment Method</Text>
            {Platform.OS === 'ios' ? (
              <>
                <Pressable onPress={openPaymentMethodPicker}>
                  <View style={styles.pickerWrapper}>
                    <View style={styles.pickerDisplayContainer}>
                      <Text style={styles.pickerDisplayText}>{paymentMethod}</Text>
                      <FontAwesome name="chevron-down" size={14} color="#27446F" />
                    </View>
                  </View>
                </Pressable>
                {showPaymentMethodPicker && (
                  <View style={{ zIndex: 1000, position: 'relative' }}>
                    <Picker
                      selectedValue={paymentMethod}
                      onValueChange={handlePaymentMethodChange}
                      style={styles.iosPicker}
                    >
                      <Picker.Item label="Add Debit Card" value="Add Debit Card" />
                      <Picker.Item label="Add Checking Account" value="Add Checking Account" />
                      <Picker.Item label="Debit card -5566" value="Debit card -5566" />
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
                  <Picker.Item label="Add Debit Card" value="Add Debit Card" />
                  <Picker.Item label="Add Checking Account" value="Add Checking Account" />
                  <Picker.Item label="Debit card -5566" value="Debit card -5566" />
                </Picker>
              </View>
            )}

            <Text style={styles.helpText}>Routing Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter routing number"
              value={routingNumber}
              onChangeText={setRoutingNumber}
              keyboardType="numeric"
            />

            <Text style={styles.helpText}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.helpLink}>
                Help me find my account information
              </Text>
            </TouchableOpacity>

            <Text style={styles.helpText}>Payment will be</Text>
            {Platform.OS === 'ios' ? (
              <>
                <Pressable onPress={openFrequencyPicker}>
                  <View style={styles.pickerWrapper}>
                    <View style={styles.pickerDisplayContainer}>
                      <Text style={styles.pickerDisplayText}>{paymentFrequency}</Text>
                      <FontAwesome name="chevron-down" size={14} color="#27446F" />
                    </View>
                  </View>
                </Pressable>
                {showFrequencyPicker && (
                  <View style={{ zIndex: 1000, position: 'relative' }}>
                    <Picker
                      selectedValue={paymentFrequency}
                      onValueChange={handleFrequencyChange}
                      style={styles.iosPicker}
                    >
                      <Picker.Item label="Select" value="Select" />
                      <Picker.Item label="Weekly" value="Weekly" />
                      <Picker.Item label="Every Two Weeks" value="Every Two Weeks" />
                      <Picker.Item label="Twice per Month" value="Twice per Month" />
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
                  <Picker.Item label="Every Two Weeks" value="Every Two Weeks" />
                  <Picker.Item label="Twice per Month" value="Twice per Month" />
                  <Picker.Item label="Monthly" value="Monthly" />
                </Picker>
              </View>
            )}

            <Text style={styles.helpText}>Day of Week</Text>
            {Platform.OS === 'ios' ? (
              <>
                <Pressable onPress={openDayPicker}>
                  <View style={styles.pickerWrapper}>
                    <View style={styles.pickerDisplayContainer}>
                      <Text style={styles.pickerDisplayText}>{dayOfWeek}</Text>
                      <FontAwesome name="chevron-down" size={14} color="#27446F" />
                    </View>
                  </View>
                </Pressable>
                {showDayPicker && (
                  <View style={{ zIndex: 1000, position: 'relative' }}>
                    <Picker
                      selectedValue={dayOfWeek}
                      onValueChange={handleDayChange}
                      style={styles.iosPicker}
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
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfigureAutopay;