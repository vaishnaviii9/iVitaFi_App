import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../../features/login/loginSlice';
import creditAccountReducer from '../../features/creditAccount/creditAccountSlice';  // Import the new slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    creditAccount: creditAccountReducer,  // Add the new reducer
  },
});
