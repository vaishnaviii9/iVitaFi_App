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
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isDefault, setIsDefault] = useState(false);

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

  const closePaymentModal = () => {
    setPaymentModalVisible(false);
  };

  const handleSubmit = () => {
    // Handle the submission of the new payment method
    console.log('Routing Number:', routingNumber);
    console.log('Account Number:', accountNumber);
    console.log('Default Payment Method:', isDefault);
    // Add your logic to save the payment method here
    closePaymentModal();
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

        <Text style={styles.sectionTitle}>Add New Payment Method</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setPaymentModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Checking Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setPaymentModalVisible(true)}>
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

      {/* Payment Modal Dialog */}
      <Modal isVisible={isPaymentModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closePaymentModal}
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add New Payment Method</Text>
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
            <TouchableOpacity onPress={() => setIsDefault(!isDefault)}>
              <Ionicons
                name={isDefault ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={isDefault ? '#27446F' : '#CCC'}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Default Payment Method</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ManagePayments;
