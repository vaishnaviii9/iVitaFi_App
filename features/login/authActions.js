import { logout as authLogout } from './loginSlice';
import { clearCreditAccountId, clearCreditSummaries, clearAutopay } from './creditAccountSlice';
import { router } from 'expo-router';

export const logout = () => (dispatch) => {
  dispatch(clearCreditAccountId());
  dispatch(clearCreditSummaries());
  dispatch(clearAutopay());
  dispatch(authLogout());
  // Add any other actions to clear state here
  router.push("/(auth)/Login");
};
