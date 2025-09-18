import {globalStyles} from '@/constants/globalStyles';
import UserManagementScreen from '@/screens/ManageUser/UserManagementScreen';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const Users = () => {
  return (
    <View style={[globalStyles.container]}>
      <UserManagementScreen />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Users;
