import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { CreditAccountTransactionTypeUtil } from '../../utils/CreditAccountTransactionTypeUtil';

const TransactionList = ({ transactions, maxTransactions, styles }) => {
  const renderTransactionIcon = (transactionType) => {
    if (transactionType !== 404 && transactionType !== 481) {
      return <Image source={require('../../assets/images/Trash.png')} style={styles.trashIcon} />;
    }
    return (
      <View style={{ flexDirection: "row" }}>
        <Image source={require('../../assets/images/Check01.png')} style={styles.icon} />
        <Image source={require('../../assets/images/X02.png')} style={styles.icon} />
      </View>
    );
  };
const transactionsToDisplay = maxTransactions
    ? transactions.slice(-maxTransactions).reverse()
    : [...transactions].reverse();
 
return (
    <ScrollView
      style={styles.scrollView}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      {transactionsToDisplay.map((transaction, index) => (
        <View key={index} style={[styles.transactionRow, index % 2 === 0 ? styles.rowLight : styles.rowDark]}>
          <View style={styles.transactionDetailsContainer}>
            <Text style={[styles.transactionDetails, styles.textSmall]}>
              <Text style={styles.textBold}>{transaction.id}</Text>
              {"\n"}
              <Text style={styles.textSecondary}>
                {CreditAccountTransactionTypeUtil.toString(transaction.transactionType) || "Unknown Type"}
              </Text>
              {"\n"}
              <Text style={styles.textSecondary}>
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
            <Text style={styles.amountText}>
              ${transaction.requestedAmount?.toFixed(2) || "0.00"}
            </Text>
          </View>
          <View>
            {renderTransactionIcon(transaction.transactionType)}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default TransactionList;