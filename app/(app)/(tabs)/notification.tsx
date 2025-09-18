import {globalStyles} from '@/constants/globalStyles';
import NotificationScreen from '@/screens/NotificationScreen';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const Notification = () => {
  return (
    <View style={[globalStyles.container]}>
      <NotificationScreen />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Notification;
