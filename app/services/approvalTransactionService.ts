import { ErrorCode } from '../../utils/ErrorCodeUtil';

// Function to handle the PUT request for transaction approval
export const approvalTransaction = async (transactionId: string, isApproved: boolean, token: undefined) => {
  const url = `https://dev.ivitafi.com/api/pendingtransaction/${transactionId}/approval`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({transactionId, isApproved}),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      // Always return a generic error
      const errorData = contentType?.includes("application/json")
        ? await response.json()
        : { errorMessage: await response.text() };

      return { type: "error", error: { errorCode: ErrorCode.Unknown, response: errorData } };
    }

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return { status: response.status, type: "data", data };
  } catch (error) {
    return { type: "error", error: { errorCode: ErrorCode.Unknown } };
  }
};
