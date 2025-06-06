import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../../features/login/loginSlice';
import creditAccountReducer from '../../features/creditAccount/creditAccountSlice';
import buttonVisibilityReducer from '../../features/buttonVisibility/buttonVisibilitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    creditAccount: creditAccountReducer,
    buttonVisibility: buttonVisibilityReducer,
  },
});
