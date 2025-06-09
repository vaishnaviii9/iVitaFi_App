// TransactionList.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CreditAccountTransactionTypeUtil, CreditAccountTransactionType } from '../../utils/CreditAccountTransactionTypeUtil';
import styles from '../../components/styles/TransactionListStyles'; // Import the styles from the new file
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';

const TransactionList = ({ transactions, maxTransactions, styles: passedStyles }) => {
  // Merge passed styles with imported styles
  const mergedStyles = { ...styles, ...passedStyles };

  const renderTrashIcon = (disable) => {
    const iconColor = disable ? mergedStyles.trashIconDisabled.color : mergedStyles.trashIconRed.color;
    return <Ionicons name="trash-sharp" size={24} color={iconColor} />;
  };

  const renderCheckIcon = () => {
    return <Feather name="check" size={24} color="green" />;
  };

  const renderXIcon = () => {
    return <Entypo name="cross" size={24} color="red" />;
  };

  const handleTrashIconPress = (disable) => {
    if (disable) {
      console.log('Trash icon is disabled');
      return;
    }
    console.log('Trash icon pressed');
  };

  const handleCheckIconPress = () => {
    console.log('Check icon pressed');
  };

  const handleXIconPress = () => {
    console.log('X icon pressed');
  };

  const TransactionIcon = ({ transactionType, transactionDate, executedDate, paymentType }) => {
    const [disable, setDisable] = useState(false);

    useEffect(() => {
      const givenDate = new Date(transactionDate);
      const currentDate = new Date();

      if (transactionType === CreditAccountTransactionType.ProcedureDischarge) {
        setDisable(true);
      } else if (transactionType === CreditAccountTransactionType.AchNonDirectedPayment ||
                 transactionType === CreditAccountTransactionType.CardPayment) {
        if (!(givenDate > currentDate && (executedDate === null || executedDate === undefined))) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      } else if (transactionType === CreditAccountTransactionType.SubsequentProcedureDischarge ||
                 transactionType === CreditAccountTransactionType.UpwardAdjustment) {
        setDisable(true);
      } else {
        setDisable(true);
      }
    }, [transactionType, transactionDate, executedDate]);

    if (transactionType === CreditAccountTransactionType.SubsequentProcedureDischarge ||
        transactionType === CreditAccountTransactionType.UpwardAdjustment) {
      return (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={handleCheckIconPress}>
            {renderCheckIcon()}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleXIconPress}>
            {renderXIcon()}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => handleTrashIconPress(disable)} disabled={disable}>
        {renderTrashIcon(disable)}
      </TouchableOpacity>
    );
  };

  const transactionsToDisplay = maxTransactions
    ? transactions.slice(-maxTransactions).reverse()
    : [...transactions].reverse();

  return (
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
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default TransactionList;
