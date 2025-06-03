import { logout as authLogout } from './loginSlice';
import { clearCreditAccountId, clearCreditSummaries, clearAutopay } from './creditAccountSlice';
import { router } from 'expo-router';

export const logout = () => (dispatch) => {
  dispatch(clearCreditAccountId());
  dispatch(clearCreditSummaries());
  dispatch(clearAutopay());
  dispatch(authLogout());
  router.push("/(auth)/Login");
};
