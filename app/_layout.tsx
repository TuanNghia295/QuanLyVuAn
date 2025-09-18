import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {useEffect} from 'react';
import {TextInput} from 'react-native';

SplashScreen.preventAutoHideAsync(); // Giữ Splash Screen mặc định

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isLoggedIn = true;
  // 👉 Load nhiều font
  const [loaded] = useFonts({
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
    RobotoItalic: require('../assets/fonts/Roboto-Italic.ttf'),
    RobotoBlack: require('../assets/fonts/Roboto-Black.ttf'),
  });

  useEffect(() => {
    if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
    if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
    (Text as any).defaultProps.allowFontScaling = false;
    (TextInput as any).defaultProps.allowFontScaling = false;

    if (loaded) {
      SplashScreen.hideAsync(); // tự động ẩn splashScreen sau khi load xong
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          // Nếu đã login -> vào app
          <Stack.Screen name="(app)/(tabs)" />
        ) : (
          // Nếu chưa login -> vào nhóm Authentication
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
