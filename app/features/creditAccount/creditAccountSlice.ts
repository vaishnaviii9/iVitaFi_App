import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreditAccountState {
  creditAccountId: string | null;
  creditSummaries: any[]; // Add a new state property for credit summaries
}

const initialState: CreditAccountState = {
  creditAccountId: null,
  creditSummaries: [], // Initialize with an empty array
};

const creditAccountSlice = createSlice({
  name: "creditAccount",
  initialState,
  reducers: {
    setCreditAccountId: (state, action: PayloadAction<string | null>) => {
      state.creditAccountId = action.payload;
    },
    clearCreditAccountId: (state) => {
      state.creditAccountId = null;
    },
    setCreditSummaries: (state, action: PayloadAction<any[]>) => {
      state.creditSummaries = action.payload;
    },
    clearCreditSummaries: (state) => {
      state.creditSummaries = [];
    },
  },
});

export const { setCreditAccountId, clearCreditAccountId, setCreditSummaries, clearCreditSummaries } = creditAccountSlice.actions;
export default creditAccountSlice.reducer;
