import {globalStyles} from '@/constants/globalStyles';
import HomeScreen from '@/screens/HomeScreen';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const Index = () => {
  return (
    <View style={[globalStyles.container]}>
      <HomeScreen />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Index;
