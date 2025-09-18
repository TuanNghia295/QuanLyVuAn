import {COLOR} from '@/constants/color';
import {fontFamilies} from '@/constants/fontFamilies';
import {globalStyles} from '@/constants/globalStyles';
import React from 'react';
import {
  GestureResponderEvent,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import Space from './Space';

interface TextComponentProps {
  text: string;
  size?: number;
  flex?: number;
  title?: boolean;
  font?: string;
  color?: string;
  styles?: StyleProp<TextStyle>; // ✅ chỉ nhận TextStyle
  onPress?: (event: GestureResponderEvent) => void;
  required?: boolean;
}

const TextComponent: React.FC<TextComponentProps> = ({
  text,
  size,
  flex,
  title,
  font,
  color,
  styles,
  onPress,
  required,
}) => {
  const fontSizeDefault = Platform.OS === 'ios' ? 14 : 16;

  return (
    <View style={{flex: flex ?? 0}}>
      <Text
        style={[
          globalStyles.text,
          {
            color: color ?? COLOR.BLACK1,
            fontSize: size ? size : title ? 20 : fontSizeDefault,
            fontFamily: font ? font : title ? fontFamilies.bold : fontFamilies.regular,
          },
          styles,
        ]}
        onPress={onPress}>
        {text}
        <Space width={4} />
        {required && <Text style={localStyles.requiredText}>*</Text>}
      </Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  requiredText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default TextComponent;
