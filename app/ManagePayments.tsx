import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import Modal from 'react-native-modal';
import styles from '../components/styles/ManagePaymentsStyles'; // Import the styles

const ManagePayments = () => {
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isCheckingModalVisible, setCheckingModalVisible] = useState(false);
  const [isDebitModalVisible, setDebitModalVisible] = useState(false);
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isDefaultChecking, setIsDefaultChecking] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isDefaultDebit, setIsDefaultDebit] = useState(false);

  // Show info modal every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setInfoModalVisible(true);
    }, [])
  );

  const handleBackPress = () => {
    router.push('/(tabs)/Home');
  };

  const closeInfoModal = () => {
    setInfoModalVisible(false);
  };

  const closeCheckingModal = () => {
    setCheckingModalVisible(false);
  };

  const closeDebitModal = () => {
    setDebitModalVisible(false);
  };

  const handleCheckingSubmit = () => {
    // Handle the submission of the new checking account
    console.log('Routing Number:', routingNumber);
    console.log('Account Number:', accountNumber);
    console.log('Default Payment Method:', isDefaultChecking);
    // Add your logic to save the checking account here
    closeCheckingModal();
  };

  const handleDebitSubmit = () => {
    // Handle the submission of the new debit card
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Card Number:', cardNumber);
    console.log('Expiration Month:', expirationMonth);
    console.log('Expiration Year:', expirationYear);
    console.log('Security Code:', securityCode);
    console.log('Zip Code:', zipCode);
    console.log('Default Payment Method:', isDefaultDebit);
    // Add your logic to save the debit card here
    closeDebitModal();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Payments</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
        <View style={styles.paymentMethod}>
          <Text>Debit Card - 5556 (Default)</Text>
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
        <View style={styles.paymentMethod}>
          <Text>Debit Card - 5556 (Default)</Text>
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
        <View style={styles.paymentMethod}>
          <Text>Debit Card - 5556 (Default)</Text>
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Add New Payment Method</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setCheckingModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Checking Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setDebitModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Debit Card</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Info Modal Dialog */}
      <Modal isVisible={isInfoModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closeInfoModal}
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Update Payment Method</Text>
          <Text style={styles.modalText}>
            1. Locate your expired payment method under the Saved Payment Methods section and click the delete icon to remove it.
          </Text>
          <Text style={styles.modalText}>
            2. Add your new payment method information.
          </Text>
          <TouchableOpacity onPress={closeInfoModal} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Checking Account Modal Dialog */}
      <Modal isVisible={isCheckingModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closeCheckingModal}
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Checking Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Routing Number"
            value={routingNumber}
            onChangeText={setRoutingNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setIsDefaultChecking(!isDefaultChecking)}>
              <Ionicons
                name={isDefaultChecking ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={isDefaultChecking ? '#27446F' : '#CCC'}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Default Payment Method</Text>
          </View>
          <TouchableOpacity onPress={handleCheckingSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Debit Card Modal Dialog */}
      <Modal isVisible={isDebitModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closeDebitModal}
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Debit Card</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiration Month"
            value={expirationMonth}
            onChangeText={setExpirationMonth}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiration Year"
            value={expirationYear}
            onChangeText={setExpirationYear}
          />
          <TextInput
            style={styles.input}
            placeholder="Security Code"
            value={securityCode}
            onChangeText={setSecurityCode}
          />
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            value={zipCode}
            onChangeText={setZipCode}
          />
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setIsDefaultDebit(!isDefaultDebit)}>
              <Ionicons
                name={isDefaultDebit ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={isDefaultDebit ? '#27446F' : '#CCC'}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Default Payment Method</Text>
          </View>
          <TouchableOpacity onPress={handleDebitSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ManagePayments;
