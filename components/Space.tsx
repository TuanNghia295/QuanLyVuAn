import React from 'react';
import {View} from 'react-native';

type Props = {
  width?: number;
  height?: number;
};

const Space: React.FC<Props> = ({width, height}) => {
  return <View style={{width, height}}></View>;
};

export default Space;
