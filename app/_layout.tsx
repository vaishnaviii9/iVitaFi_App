// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './store/store';
import 'react-native-reanimated';
import CustomDrawerContent from '../components/CustomDrawerContent';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <Drawer
          screenOptions={{ headerShown: false }}
          drawerContent={(props: any) => <CustomDrawerContent {...props} />}
        >
          {/* Add your drawer screens here */}
        </Drawer>
        <StatusBar style="dark" />
      </ThemeProvider>
    </Provider>
  );
}
