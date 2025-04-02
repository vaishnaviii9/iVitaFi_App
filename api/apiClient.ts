const BASE_URL = "https://dev.ivitafi.com/api";

const apiClient = {
  AUTHENTICATE_USER: `${BASE_URL}/User/authenticate`,
  RESET_PASSWORD: `${BASE_URL}/User/create-reset-password`,
  CURRENT_USER: `${BASE_URL}/User/current-user`,
  CUSTOMER_CURRENT: `${BASE_URL}/customer/current/true`,
  CREDIT_ACCOUNT_SUMMARY: (creditAccountId: string) => `${BASE_URL}/CreditAccount/${creditAccountId}/summary`,
  PENDING_TRANSACTIONS: (creditAccountId: string) => `${BASE_URL}/creditaccount/${creditAccountId}/pending-transactions`,
  STATEMENTS: (creditAccountId: string) => `${BASE_URL}/creditaccount/${creditAccountId}/statements`,
  DOCUMENTS: (creditAccountId: string) => `${BASE_URL}/creditaccount/${creditAccountId}/documents` ,
  STATEMENT_FILE: (creditAccountId: string, fileName: string) => `${BASE_URL}/creditaccount/${creditAccountId}/statements/${fileName}`,
};

export default apiClient;
