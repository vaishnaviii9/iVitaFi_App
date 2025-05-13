import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "../components/styles/ConfigureAutopayStyles";

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
  const [isPaymentMethodExpanded, setIsPaymentMethodExpanded] = useState(false);
  const [isPaymentFrequencyExpanded, setIsPaymentFrequencyExpanded] = useState(false);
  const [isDayOfWeekExpanded, setIsDayOfWeekExpanded] = useState(false);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onChange = ({ type }: any, selectedDate: any) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
    } else {
      toggleDatePicker();
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
            <TouchableOpacity
              style={styles.pickerWrapper}
              onPress={() => setIsPaymentMethodExpanded(!isPaymentMethodExpanded)}
            >
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>
                  {paymentMethod || "Select Payment Method"}
                </Text>
                <FontAwesome name="caret-down" size={16} color="#000" />
              </View>
            </TouchableOpacity>
            {isPaymentMethodExpanded && (
              <Picker
                selectedValue={paymentMethod}
                onValueChange={(itemValue) => {
                  setPaymentMethod(itemValue);
                  setIsPaymentMethodExpanded(false);
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Add Debit Card" value="Add Debit Card" />
                <Picker.Item label="Add Checking Account" value="Add Checking Account" />
                <Picker.Item label="Debit card -5566" value="Debit card -5566" />
              </Picker>
            )}

            <Text style={styles.helpText}>Routing Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter routing number"
              value={routingNumber}
              onChangeText={setRoutingNumber}
            />

            <Text style={styles.helpText}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.helpLink}>
                Help me find my account information
              </Text>
            </TouchableOpacity>

            <Text style={styles.helpText}>Payment will be</Text>
            <TouchableOpacity
              style={styles.pickerWrapper}
              onPress={() => setIsPaymentFrequencyExpanded(!isPaymentFrequencyExpanded)}
            >
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>
                  {paymentFrequency || "Select Frequency"}
                </Text>
                <FontAwesome name="caret-down" size={16} color="#000" />
              </View>
            </TouchableOpacity>
            {isPaymentFrequencyExpanded && (
              <Picker
                selectedValue={paymentFrequency}
                onValueChange={(itemValue) => {
                  setPaymentFrequency(itemValue);
                  setIsPaymentFrequencyExpanded(false);
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Select" value="Select" />
                <Picker.Item label="Weekly" value="Weekly" />
                <Picker.Item label="Every Two Weeks" value="Every Two Weeks" />
                <Picker.Item label="Twice per Month" value="Twice per Month" />
                <Picker.Item label="Monthly" value="Monthly" />
              </Picker>
            )}

            <Text style={styles.helpText}>Day of Week</Text>
            <TouchableOpacity
              style={styles.pickerWrapper}
              onPress={() => setIsDayOfWeekExpanded(!isDayOfWeekExpanded)}
            >
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>
                  {dayOfWeek || "Select Day"}
                </Text>
                <FontAwesome name="caret-down" size={16} color="#000" />
              </View>
            </TouchableOpacity>
            {isDayOfWeekExpanded && (
              <Picker
                selectedValue={dayOfWeek}
                onValueChange={(itemValue) => {
                  setDayOfWeek(itemValue);
                  setIsDayOfWeekExpanded(false);
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Monday" value="Monday" />
                <Picker.Item label="Tuesday" value="Tuesday" />
                <Picker.Item label="Wednesday" value="Wednesday" />
                <Picker.Item label="Thursday" value="Thursday" />
                <Picker.Item label="Friday" value="Friday" />
              </Picker>
            )}

            <Text style={styles.helpText}>Payment Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="$32.50"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />

            <Text style={styles.helpText}>Payment Start Date</Text>
            <Pressable onPress={toggleDatePicker}>
              <Text style={styles.input}>{date.toDateString()}</Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
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
