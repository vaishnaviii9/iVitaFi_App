import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreditAccountState {
  creditAccountId: string | null;
}

const initialState: CreditAccountState = {
  creditAccountId: null,
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
  },
});

export const { setCreditAccountId, clearCreditAccountId } = creditAccountSlice.actions;
export default creditAccountSlice.reducer;
