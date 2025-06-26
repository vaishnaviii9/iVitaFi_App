import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import {
  CreditAccountTransactionTypeUtil,
  CreditAccountTransactionType,
} from "../../utils/CreditAccountTransactionTypeUtil";
import styles from "../../components/styles/TransactionListStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { deleteTransaction } from "../../app/services/deletePendingTransactionService";
import { approvalTransaction } from "../../app/services/approvalTransactionService";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import FAIcon from 'react-native-vector-icons/FontAwesome'; // Renamed import to FAIcon

// Define types for your props
interface Transaction {
  id: string;
  transactionType: CreditAccountTransactionType;
  pendingTransactionDate?: string;
  executedDate?: string | null;
  paymentType?: string;
  requestedAmount?: number;
  requiresCustomerApproval?: boolean;
  hasCustomerApproval?: boolean | null;
  expirationDate?: string;
}

interface TransactionIconProps {
  transactionType: CreditAccountTransactionType;
  transactionDate?: string;
  executedDate?: string | null;
  paymentType?: string;
  id: string;
  requiresCustomerApproval?: boolean;
  hasCustomerApproval?: boolean | null;
  expirationDate?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  maxTransactions?: number;
  styles?: any;
  fetchTransactions?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const wp = (percentage: number) => {
  return (screenWidth * percentage) / 100;
};

const hp = (percentage: number) => {
  return (screenHeight * percentage) / 100;
};

const compareNow = (expirationDate?: string): number => {
  if (!expirationDate) return -1;
  const now = new Date();
  const expiry = new Date(expirationDate);
  return now > expiry ? -1 : 1;
};

const getPendingTransactionClassification = (
  transaction: Transaction
): number => {
  let classification = 0;

  if (
    transaction.transactionType ===
    CreditAccountTransactionType.ProcedureDischarge
  ) {
    classification = 1;
  } else if (
    transaction.transactionType === CreditAccountTransactionType.CardPayment
  ) {
    classification = 14;
  } else if (
    transaction.transactionType ===
    CreditAccountTransactionType.AchNonDirectedPayment
  ) {
    classification = 15;
  } else {
    if (
      transaction.requiresCustomerApproval === true &&
      transaction.hasCustomerApproval === true
    ) {
      if (
        transaction.transactionType ===
        CreditAccountTransactionType.SubsequentProcedureDischarge
      ) {
        classification = 3;
      } else if (
        transaction.transactionType ===
        CreditAccountTransactionType.UpwardAdjustment
      ) {
        classification = 7;
      } else if (
        transaction.transactionType ===
        CreditAccountTransactionType.DownwardAdjustment
      ) {
        classification = 11;
      }
    } else if (
      transaction.requiresCustomerApproval === true &&
      transaction.hasCustomerApproval === false
    ) {
      if (
        transaction.transactionType ===
        CreditAccountTransactionType.SubsequentProcedureDischarge
      ) {
        classification = 4;
      } else if (
        transaction.transactionType ===
        CreditAccountTransactionType.UpwardAdjustment
      ) {
        classification = 8;
      } else if (
        transaction.transactionType ===
        CreditAccountTransactionType.DownwardAdjustment
      ) {
        classification = 12;
      }
    } else if (
      transaction.requiresCustomerApproval === true &&
      transaction.hasCustomerApproval === null
    ) {
      if (
        transaction.transactionType ===
        CreditAccountTransactionType.SubsequentProcedureDischarge
      ) {
        if (compareNow(transaction.expirationDate) === -1) {
          classification = 5;
        } else {
          classification = 2;
        }
      } else if (
        transaction.transactionType ===
        CreditAccountTransactionType.UpwardAdjustment
      ) {
        if (compareNow(transaction.expirationDate) === -1) {
          classification = 9;
        } else {
          classification = 6;
        }
      } else if (
        transaction.transactionType ===
        CreditAccountTransactionType.DownwardAdjustment
      ) {
        if (compareNow(transaction.expirationDate) === -1) {
          classification = 13;
        } else {
          classification = 10;
        }
      }
    } else if (
      transaction.transactionType ===
      CreditAccountTransactionType.DownwardAdjustment
    ) {
      classification = 11;
    }
  }

  return classification;
};

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  maxTransactions,
  styles: passedStyles,
  fetchTransactions,
}) => {
  const token = useSelector((state: any) => state.auth.token);
  const mergedStyles = { ...styles, ...passedStyles };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [operationMessage, setOperationMessage] = useState({
    title: "",
    message: "",
  });
  const [operationModalVisible, setOperationModalVisible] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (fetchTransactions) {
        fetchTransactions();
      }
    }, [fetchTransactions])
  );

  const showOperationModal = (title: string, message: string) => {
    setOperationMessage({ title, message });
    setOperationModalVisible(true);
  };

  const approvalFunction = async (
    id: string,
    isApproved: boolean,
    transactions: Transaction[]
  ): Promise<void> => {
    const response = await approvalTransaction(id, isApproved, token);

    const transaction = transactions.find((t) => t.id === id);
    const transactionType = transaction
      ? CreditAccountTransactionTypeUtil.toString(transaction.transactionType)
      : "Unknown Type";

    if (response.type === "error") {
      showOperationModal(
        "Error",
        "An error occurred while processing the transaction."
      );
    } else {
      showOperationModal(
        "Success",
        `${transactionType} transaction has been successfully ${
          isApproved ? "approved" : "rejected"
        }.`
      );
      if (fetchTransactions) {
        fetchTransactions();
      }
    }
  };

  const renderTrashIcon = (disable: boolean) => {
    const iconColor = disable ? "#D3D3D3" : "#FF0000";
    return <Ionicons name="trash-sharp" size={24} color={iconColor} />;
  };

  const renderCheckIcon = () => {
    return (
      <View
        style={{
          backgroundColor: "#279412",
          padding: 5,
          borderRadius: 4,
          margin: 4,
          marginLeft: 6,
        }}
      >
        <Icon name="check" size={20} color="white" />
      </View>
    );
  };

  const renderXIcon = () => {
    return (
      <View
        style={{
          backgroundColor: "#e34a25",
          padding: 5,
          borderRadius: 4,
          margin: 4,
          width:30,
          alignItems: 'center'
        }}
      >
        <FAIcon name="remove" size={21} color="white" />
      </View>
    );
  };

 

  const handleTrashIconPress = (id: string, disable: boolean) => {
    if (disable) {
      return;
    }
    setSelectedTransactionId(id);
    setModalVisible(true);
  };

  const handleCheckIconPress = (id: string) => {
    approvalFunction(id, true, transactions);
  };

  const handleXIconPress = (id: string) => {
    approvalFunction(id, false, transactions);
  };

  const handleDeleteConfirmation = async (confirm: boolean) => {
    setModalVisible(false);
    if (confirm && selectedTransactionId) {
      setDeletingTransactionId(selectedTransactionId);
      try {
        const response = await deleteTransaction(selectedTransactionId, token);
        if (response.status === 200) {
          showOperationModal("Success", "Deleted pending transaction.");
          if (fetchTransactions) {
            fetchTransactions();
          }
        } else {
          showOperationModal("Error", "Failed to delete the transaction.");
        }
      } catch (error) {
        showOperationModal(
          "Error",
          "An error occurred while deleting the transaction."
        );
      } finally {
        setDeletingTransactionId(null);
      }
    }
  };

  const TransactionIcon: React.FC<TransactionIconProps> = ({
    transactionType,
    transactionDate,
    executedDate,
    paymentType,
    id,
    requiresCustomerApproval,
    hasCustomerApproval,
    expirationDate,
  }) => {
    const [disable, setDisable] = useState(false);
    const classification = getPendingTransactionClassification({
      id,
      transactionType,
      pendingTransactionDate: transactionDate,
      executedDate,
      paymentType,
      requiresCustomerApproval,
      hasCustomerApproval,
      expirationDate,
    });

    useEffect(() => {
      const givenDate = new Date(transactionDate || 0);
      const currentDate = new Date();

      if (transactionType === CreditAccountTransactionType.ProcedureDischarge) {
        setDisable(true);
      } else if (
        transactionType ===
          CreditAccountTransactionType.AchNonDirectedPayment ||
        transactionType === CreditAccountTransactionType.CardPayment
      ) {
        if (
          !(
            givenDate > currentDate &&
            (executedDate === null || executedDate === undefined)
          )
        ) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      } else if (
        transactionType ===
          CreditAccountTransactionType.SubsequentProcedureDischarge ||
        transactionType === CreditAccountTransactionType.UpwardAdjustment
      ) {
        setDisable(true);
      } else {
        setDisable(true);
      }
    }, [transactionType, transactionDate, executedDate]);

    const shouldShowIcons = [2, 6, 10].includes(classification);

    if (shouldShowIcons) {
      return (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => handleCheckIconPress(id)}>
            {renderCheckIcon()}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleXIconPress(id)}>
            {renderXIcon()}
          </TouchableOpacity>
        </View>
      );
    }

    const isDeleting = deletingTransactionId === id;

    return (
      <TouchableOpacity
        onPress={() => handleTrashIconPress(id, disable || isDeleting)}
        disabled={disable || isDeleting}
      >
        {renderTrashIcon(disable || isDeleting)}
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
          <View
            key={index}
            style={[
              mergedStyles.transactionRow,
              index % 2 === 0 ? mergedStyles.rowLight : mergedStyles.rowDark,
            ]}
          >
            <View style={mergedStyles.transactionDetailsContainer}>
              <Text
                style={[
                  mergedStyles.transactionDetails,
                  mergedStyles.textSmall,
                ]}
              >
                <Text style={mergedStyles.textBold}>{transaction.id}</Text>
                {"\n"}
                <Text style={mergedStyles.textSecondary}>
                  {CreditAccountTransactionTypeUtil.toString(
                    transaction.transactionType
                  ) || "Unknown Type"}
                </Text>
                {"\n"}
                <Text style={mergedStyles.textSecondary}>
                  {transaction.pendingTransactionDate
                    ? new Date(
                        transaction.pendingTransactionDate
                      ).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
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
                requiresCustomerApproval={transaction.requiresCustomerApproval}
                hasCustomerApproval={transaction.hasCustomerApproval}
                expirationDate={transaction.expirationDate}
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
            <TouchableOpacity
              style={mergedStyles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={25} color="#333" />
            </TouchableOpacity>
            <Text style={mergedStyles.modalTitle}>Delete Transaction</Text>
            <Text style={mergedStyles.modalText}>
              Are you sure you want to delete this transaction?
            </Text>
            <View style={mergedStyles.modalButtonContainer}>
              <TouchableOpacity
                style={mergedStyles.modalButton}
                onPress={() => handleDeleteConfirmation(false)}
              >
                <Text style={mergedStyles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={mergedStyles.modalButton}
                onPress={() => handleDeleteConfirmation(true)}
              >
                <Text style={mergedStyles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={operationModalVisible}
        onRequestClose={() => setOperationModalVisible(false)}
      >
        <View style={mergedStyles.centeredView}>
          <View style={mergedStyles.modalView}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: hp(1.5),
              }}
            >
              <TouchableOpacity
                style={mergedStyles.closeIcon}
                onPress={() => setOperationModalVisible(false)}
              >
                <Ionicons name="close" size={34} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={mergedStyles.modalTextStyle}>{operationMessage.title}</Text>
            <Text style={mergedStyles.modalMessageStyle}>
              {operationMessage.message}
            </Text>
            <TouchableOpacity
              style={mergedStyles.modalButtonStyle}
              onPress={() => {
                setOperationModalVisible(!operationModalVisible);
              }}
            >
              <Text style={mergedStyles.modalButtonTextStyle}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
};

export default TransactionList;
