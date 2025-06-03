import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreditAccountState {
  creditAccountId: string | null;
  creditSummaries: any[];
  autopay: boolean;
}

const initialState: CreditAccountState = {
  creditAccountId: null,
  creditSummaries: [],
  autopay: false,
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
    setAutopay: (state, action: PayloadAction<boolean>) => {
      state.autopay = action.payload;
    },
    clearAutopay: (state) => {
      state.autopay = false;
    },
  },
});

export const {
  setCreditAccountId,
  clearCreditAccountId,
  setCreditSummaries,
  clearCreditSummaries,
  setAutopay,
  clearAutopay,
} = creditAccountSlice.actions;
export default creditAccountSlice.reducer;
