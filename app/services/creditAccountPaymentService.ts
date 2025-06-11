import { ErrorCode } from "../../utils/ErrorCodeUtil";

// Function to update the credit account payment method
export const updateCreditAccountPaymentMethodWithDefaultPaymentMethodAsync = async (
  creditAccountId: number,
  paymentMethodData: any,
  customerPaymentMethodId: number,
  isDefaultPayment: boolean,
  token: string
) => {
  try {
    const response = await fetch(
      `https://dev.ivitafi.com/api/creditAccount/${creditAccountId}/${customerPaymentMethodId}/${isDefaultPayment}/default-payment-method-customer`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ Add token here
        },
        body: JSON.stringify(paymentMethodData),
      }
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorData = contentType?.includes("application/json")
        ? await response.json()
        : { errorMessage: await response.text() };

      return { type: "error", response: errorData };
    }

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return { type: "data", data };
  } catch (error) {
    return { type: "error", error: { errorCode: ErrorCode.Unknown } };
  }
};
