// src/services/creditService.ts
import { fetchData } from "../../api/api";

export const fetchCreditSummaries = async (
  customerResponse: any,
  token: string
) => {
  try {
    if (!customerResponse || !customerResponse.creditAccounts) {
      console.warn("Invalid customer response, creditAccounts missing.");
      return [];
    }

    const creditSummaries = await Promise.all(
      customerResponse.creditAccounts.map((account: any) => {
        if (account.patientEpisodes && account.patientEpisodes.length > 0) {
          const creditAccountId = account.patientEpisodes[0].creditAccountId;
          return fetchData(
            `https://dev.ivitafi.com/api/CreditAccount/${creditAccountId}/summary`,
            token,
            (data: any) => data, // Directly return the data
            "Failed to fetch credit account summary."
          );
        }
        return null;
      })
    );

    return creditSummaries.filter((summary) => summary !== null); // Remove null values
  } catch (error) {
    console.error("Error fetching credit account summaries:", error);
    return [];
  }
};
