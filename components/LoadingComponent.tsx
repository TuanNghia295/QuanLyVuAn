import {COLOR} from '@/constants/color';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const LoadingComponent = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color={COLOR.PRIMARY} />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default LoadingComponent;
