import {Stack} from 'expo-router';
import React from 'react';
import {StyleSheet} from 'react-native';

const Layout = () => {
  return (
    <Stack
      initialRouteName="login"
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="login" options={{headerShown: false}} />
      <Stack.Screen
        name="register"
        options={{
          headerShadowVisible: false,
          headerTitle: '',
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
