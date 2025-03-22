import { fetchData } from "../../api/api";
import apiClient from "../../api/apiClient";  // Import API endpoints

export const fetchCreditSummariesWithId = async (
  customerResponse: any,
  token: string
) => {
  try {
    if (!customerResponse || !customerResponse.creditAccounts) {
      console.warn("Invalid customer response, creditAccounts missing.");
      return { creditSummaries: [], creditAccountId: null };
    }

    const firstAccount = customerResponse.creditAccounts[0];

    // Check if the first account contains patient episodes and extract the ID
    const creditAccountId = firstAccount?.patientEpisodes?.length > 0
      ? firstAccount.patientEpisodes[0].creditAccountId
      : null;

    const creditSummaries = await Promise.all(
      customerResponse.creditAccounts.map((account: any) => {
        if (account.patientEpisodes && account.patientEpisodes.length > 0) {
          const creditAccountId = account.patientEpisodes[0].creditAccountId;
          return fetchData(
            apiClient.CREDIT_ACCOUNT_SUMMARY(creditAccountId),
            token,
            (data: any) => data,
            "Failed to fetch credit account summary."
          );
        }
        return null;
      })
    );

    return {
      creditSummaries: creditSummaries.filter((summary) => summary !== null),
      creditAccountId, // Return the extracted ID
    };

  } catch (error) {
    console.error("Error fetching credit account summaries:", error);
    return { creditSummaries: [], creditAccountId: null };
  }
};
