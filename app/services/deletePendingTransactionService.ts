import axios from 'axios';
import apiClient from "../../api/apiClient";
import { deleteData } from '../../api/api';
const deleteTransaction = async (transactionId: string, token: string) => {
  try {
    const url = apiClient.DELETE_PENDING_TRANSACTION(transactionId);
    const success = await deleteData(url, token, "Error deleting transaction");

    if (success) {
      console.log("Transaction successfully deleted");
      return { status: 200 };
    } else {
      console.log("Failed to delete the transaction");
      return { status: 500 };
    }
  } catch (error) {
    console.log('Error deleting transaction:', error);
    return { status: 500, data: { message: "Internal Server Error" } };
  }
};

export { deleteTransaction };