import {useColorScheme} from '@/hooks/use-color-scheme';
import {useUserStore} from '@/store/userStore';
import {DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useFonts} from 'expo-font';
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import {Text, TextInput} from 'react-native';
import 'react-native-reanimated';

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const {loadToken, checkToken} = useUserStore();
  const [loaded] = useFonts({
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
    RobotoItalic: require('../assets/fonts/Roboto-Italic.ttf'),
    RobotoBlack: require('../assets/fonts/Roboto-Black.ttf'),
  });

  // Set default font scaling for Text and TextInput
  useEffect(() => {
    if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
    if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
    (Text as any).defaultProps.allowFontScaling = false;
    (TextInput as any).defaultProps.allowFontScaling = false;
  }, []);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Check token and redirect if not valid
  useEffect(() => {
    const checkLogin = async () => {
      await loadToken();
      const valid = await checkToken();
      if (!valid) router.push('/(auth)/login');
    };
    checkLogin();
  }, [router, loadToken, checkToken]);

  if (!loaded) return null;

  // Determine theme and navigation stack
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DefaultTheme}>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(app)/(tabs)" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
