interface CreditAccountTransactionDto {
  transactionAmount: number;
  transactionDate: string;
  customAmount: number | null;
  useSavedPaymentMethod: boolean;
  enableAutoPay: boolean;
  paymentMethodType: number | null;
  expirationDate: string;
}

interface CreditAccountPendingTransaction {
  id: number;
  status: string;
}

interface ServiceResponse<T> {
  type: 'data' | 'error';
  response: T | { errorMessage: string };
}

export const postCreditAccountTransactionsNew = async (
  creditAccountId: number,
  customerPaymentMethodId: number,
  transaction: CreditAccountTransactionDto,
  token: string
): Promise<ServiceResponse<CreditAccountPendingTransaction>> => {
  try {
    const response = await fetch(
      `https://dev.ivitafi.com/api/creditaccount/${creditAccountId}/transaction/${customerPaymentMethodId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      }
    );

    const contentType = response.headers.get("content-type");
    let result: ServiceResponse<CreditAccountPendingTransaction>;

    if (!response.ok) {
      const errorData = contentType?.includes("application/json")
        ? await response.json()
        : { errorMessage: await response.text() };

      result = { type: "error", response: { errorMessage: errorData.errorMessage || "An error occurred" } };
    } else {
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      result = { type: "data", response: data };
    }

    return result;
  } catch (error) {
    return { type: "error", response: { errorMessage: "Network error occurred." } };
  }
};
