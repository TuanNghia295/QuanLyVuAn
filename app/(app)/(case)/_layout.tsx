import {COLOR} from '@/constants/color';
import {Stack} from 'expo-router';
import React from 'react';
import {StyleSheet} from 'react-native';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: 24},
        headerStyle: {backgroundColor: COLOR.GRAY2},
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'default',
        headerBackVisible: true,
      }}>
      <Stack.Screen name="templateList" options={{title: 'Template'}} />
      <Stack.Screen
        name="caseCreate"
        options={{
          title: 'Tạo vụ án',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="caseDetail"
        options={{
          title: 'Chi tiết',
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
