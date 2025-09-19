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
      }}>
      <Stack.Screen name="createTemplate" options={{title: 'Tạo mẫu vụ án'}} />
      <Stack.Screen name="templateList" options={{title: 'Danh sách mẫu án'}} />
      <Stack.Screen name="templateDetail" />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
