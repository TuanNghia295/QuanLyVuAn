import {globalStyles} from '@/constants/globalStyles';
import ProfileScreen from '@/screens/ProfileScreen';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const Profile = () => {
  return (
    <View style={[globalStyles.container]}>
      <ProfileScreen />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Profile;
