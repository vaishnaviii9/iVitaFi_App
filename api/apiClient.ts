// Base URL for the API endpoints
const BASE_URL = "https://dev.ivitafi.com/api";

// Object containing API endpoint URLs for various functionalities
const apiClient = {
  // Endpoint for user authentication
  AUTHENTICATE_USER: `${BASE_URL}/User/authenticate`,

  // Endpoint to initiate a password reset
  RESET_PASSWORD: `${BASE_URL}/User/create-reset-password`,

  // Endpoint to fetch the current user's details
  CURRENT_USER: `${BASE_URL}/User/current-user`,

  // Endpoint to fetch the current customer's details
  CUSTOMER_CURRENT: `${BASE_URL}/customer/current/true`,

  // Endpoint to fetch the credit account summary for a specific account
  CREDIT_ACCOUNT_SUMMARY: (creditAccountId: string) => `${BASE_URL}/CreditAccount/${creditAccountId}/summary`,

  // Endpoint to fetch pending transactions for a specific credit account
  PENDING_TRANSACTIONS: (creditAccountId: string) => `${BASE_URL}/creditaccount/${creditAccountId}/pending-transactions`,

  // Endpoint to fetch posted transactions for a specific credit account
  POSTED_TRANSACTIONS: (creditAccountId: string) => `${BASE_URL}/creditaccount/${creditAccountId}/transactions`,

  // Endpoint to fetch statements for a specific credit account
  STATEMENTS: (creditAccountId: string) => `${BASE_URL}/creditaccount/${creditAccountId}/statements`,

  // Endpoint to fetch documents for a specific credit account
  DOCUMENTS: (creditAccountId: string) => `${BASE_URL}/creditaccount/${creditAccountId}/documents`,

  //Endpoint to fetch top three saved payment methods
  TOP_THREE_SAVED_PAYMENT_METHODS: (customerId: string) =>
    `${BASE_URL}/admin/credit-account/${customerId}/top-three`,

   // Endpoint to delete a payment method
   DELETE_PAYMENT_METHOD: (methodId: string) =>
    `${BASE_URL}/admin/credit-account/${methodId}/delete-payment-method`,
};

export default apiClient;
