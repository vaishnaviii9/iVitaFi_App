import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { CreditAccountTransactionTypeUtil, CreditAccountTransactionType } from '../../utils/CreditAccountTransactionTypeUtil';
import styles from '../../components/styles/TransactionListStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { deleteTransaction } from '../../app/services/deletePendingTransactionService';
import Toast from 'react-native-toast-message';
import { useSelector } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';

// Define types for your props
interface Transaction {
  id: string;
  transactionType: CreditAccountTransactionType;
  pendingTransactionDate?: string;
  executedDate?: string | null;
  paymentType?: string;
  requestedAmount?: number;
}

interface TransactionIconProps {
  transactionType: CreditAccountTransactionType;
  transactionDate?: string;
  executedDate?: string | null;
  paymentType?: string;
  id: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  maxTransactions?: number;
  styles?: any;
  fetchTransactions?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, maxTransactions, styles: passedStyles, fetchTransactions }) => {
  const token = useSelector((state: any) => state.auth.token);
  const mergedStyles = { ...styles, ...passedStyles };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (fetchTransactions) {
        fetchTransactions();
      }
    }, [fetchTransactions])
  );

const renderTrashIcon = (disable: boolean) => {
  const iconColor = disable ? '#D3D3D3' : '#FF0000'; // Try a different shade of red
  return <Ionicons name="trash-sharp" size={24} color={iconColor} />;
};

  const renderCheckIcon = () => {
    return <Feather name="check" size={24} color="green" />;
  };

  const renderXIcon = () => {
    return <Entypo name="cross" size={24} color="red" />;
  };

  const handleTrashIconPress = (id: string, disable: boolean) => {
    if (disable) {
      console.log('Trash icon is disabled');
      return;
    }
    setSelectedTransactionId(id);
    setModalVisible(true);
  };

  const handleCheckIconPress = (id: string) => {
    console.log('Check icon pressed for ID:', id);
  };

  const handleXIconPress = (id: string) => {
    console.log('X icon pressed for ID:', id);
  };

  const handleDeleteConfirmation = async (confirm: boolean) => {
    setModalVisible(false);
    if (confirm && selectedTransactionId) {
      console.log('Attempting to delete transaction with ID:', selectedTransactionId);
      try {
        const response = await deleteTransaction(selectedTransactionId, token);
        if (response.status === 200) {
          console.log('Transaction successfully deleted');
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Transaction has been successfully deleted.',
          });
          if (fetchTransactions) {
            fetchTransactions();
          }
        } else {
          console.error('Failed to delete the transaction');
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to delete the transaction.',
          });
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An error occurred while deleting the transaction.',
        });
      }
    }
  };

  const TransactionIcon: React.FC<TransactionIconProps> = ({ transactionType, transactionDate, executedDate, paymentType, id }) => {
    const [disable, setDisable] = useState(false);

    useEffect(() => {
      const givenDate = new Date(transactionDate || 0);
      const currentDate = new Date();

      if (transactionType === CreditAccountTransactionType.ProcedureDischarge) {
        setDisable(true);
      } else if (
        transactionType === CreditAccountTransactionType.AchNonDirectedPayment ||
        transactionType === CreditAccountTransactionType.CardPayment
      ) {
        if (!(givenDate > currentDate && (executedDate === null || executedDate === undefined))) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      } 
       else if (
        transactionType === CreditAccountTransactionType.SubsequentProcedureDischarge ||
        transactionType === CreditAccountTransactionType.UpwardAdjustment
      ) {
        setDisable(true);
      } else {
        setDisable(true);
      }
    }, [transactionType, transactionDate, executedDate]);

    if (
      transactionType === CreditAccountTransactionType.SubsequentProcedureDischarge ||
      transactionType === CreditAccountTransactionType.UpwardAdjustment
    ) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => handleCheckIconPress(id)}>
            {renderCheckIcon()}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleXIconPress(id)}>
            {renderXIcon()}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => handleTrashIconPress(id, disable)} disabled={disable}>
        {renderTrashIcon(disable)}
      </TouchableOpacity>
    );
  };

  const transactionsToDisplay = maxTransactions
    ? transactions.slice(-maxTransactions).reverse()
    : [...transactions].reverse();

  return (
    <View style={mergedStyles.container}>
      <ScrollView
        style={mergedStyles.scrollView}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {transactionsToDisplay.map((transaction, index) => (
          <View key={index} style={[mergedStyles.transactionRow, index % 2 === 0 ? mergedStyles.rowLight : mergedStyles.rowDark]}>
            <View style={mergedStyles.transactionDetailsContainer}>
              <Text style={[mergedStyles.transactionDetails, mergedStyles.textSmall]}>
                <Text style={mergedStyles.textBold}>{transaction.id}</Text>
                {"\n"}
                <Text style={mergedStyles.textSecondary}>
                  {CreditAccountTransactionTypeUtil.toString(transaction.transactionType) || "Unknown Type"}
                </Text>
                {"\n"}
                <Text style={mergedStyles.textSecondary}>
                  {transaction.pendingTransactionDate
                    ? new Date(transaction.pendingTransactionDate).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })
                    : "---"}
                </Text>
              </Text>
            </View>
            <View>
              <Text style={mergedStyles.amountText}>
                ${transaction.requestedAmount?.toFixed(2) || "0.00"}
              </Text>
            </View>
            <View>
              <TransactionIcon
                transactionType={transaction.transactionType}
                transactionDate={transaction.pendingTransactionDate}
                executedDate={transaction.executedDate}
                paymentType={transaction.paymentType}
                id={transaction.id}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={mergedStyles.modalContainer}>
          <View style={mergedStyles.modalView}>
            <TouchableOpacity style={mergedStyles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={mergedStyles.modalTitle}>Delete Transaction</Text>
            <Text style={mergedStyles.modalText}>
              Are you sure you want to delete this transaction?
            </Text>
            <View style={mergedStyles.modalButtonContainer}>
              <TouchableOpacity style={mergedStyles.modalButton} onPress={() => handleDeleteConfirmation(false)}>
                <Text style={mergedStyles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={mergedStyles.modalButton} onPress={() => handleDeleteConfirmation(true)}>
                <Text style={mergedStyles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

export default TransactionList;
