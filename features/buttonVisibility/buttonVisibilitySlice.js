import { createSlice } from '@reduxjs/toolkit';

const buttonVisibilitySlice = createSlice({
  name: 'buttonVisibility',
  initialState: {
    showMakePayment: false,
    showMakeAdditionalPayment: false,
  },
  reducers: {
    setShowMakePayment: (state, action) => {
      state.showMakePayment = action.payload;
    },
    setShowMakeAdditionalPayment: (state, action) => {
      state.showMakeAdditionalPayment = action.payload;
    },
  },
});

export const { setShowMakePayment, setShowMakeAdditionalPayment } = buttonVisibilitySlice.actions;
export default buttonVisibilitySlice.reducer;
