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
      <Stack.Screen
        name="caseCreate"
        options={{
          title: 'Tạo vụ án',
        }}
      />
      <Stack.Screen
        name="caseDetail"
        options={{
          title: '',
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
