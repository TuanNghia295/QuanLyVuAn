import {COLOR} from '@/constants/color';
import {globalStyles} from '@/constants/globalStyles';
import {buttonStyles} from '@/styles/buttonStyles';
import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import TextComponent from './textComponent';

type ButtonType =
  | 'primary'
  | 'outline'
  | 'shortPrimary'
  | 'shortOutlinePrimary'
  | 'white'
  | 'shortOutline'
  | 'gray'
  | 'shortGray'
  | 'empty';

type IconFlex = 'right' | 'left';

interface ButtonComponentProps {
  type?: ButtonType;
  title: string;
  isDisable?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: React.ReactNode;
  iconFlex?: IconFlex;
  textStyle?: StyleProp<TextStyle>;
  styles?: StyleProp<ViewStyle>;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  type = 'primary',
  title,
  isDisable = false,
  onPress,
  icon,
  iconFlex,
  textStyle,
  styles,
}) => {
  const getButtonStyle = (type: ButtonType) => {
    switch (type) {
      case 'primary':
        return globalStyles.button;
      case 'gray':
        return buttonStyles.gray;
      case 'shortPrimary':
        return buttonStyles.shortPrimary;
      case 'shortOutlinePrimary':
        return buttonStyles.shortOutlinePrimary;
      case 'outline':
        return buttonStyles.outline;
      case 'shortOutline':
        return buttonStyles.shortOutline;
      case 'shortGray':
        return buttonStyles.shortGray;
      case 'white':
        return buttonStyles.white;
      case 'empty':
        return buttonStyles.empty;
      default:
        return globalStyles.button;
    }
  };

  const getTextColor = (type: ButtonType) => {
    switch (type) {
      case 'primary':
      case 'shortPrimary':
        return COLOR.WHITE;
      case 'outline':
      case 'white':
      case 'shortOutlinePrimary':
        return COLOR.PRIMARY;
      case 'shortOutline':
      case 'empty':
        return COLOR.BLACK1;
      case 'gray':
      case 'shortGray':
      default:
        return COLOR.BLACK2;
    }
  };

  const renderIcon = (position: IconFlex) => {
    if (icon && iconFlex === position) {
      return icon;
    }
    return null;
  };

  return (
    <TouchableOpacity onPress={onPress} style={[getButtonStyle(type), styles]} disabled={isDisable}>
      {renderIcon('left')}
      <TextComponent
        color={getTextColor(type)}
        text={title}
        styles={[
          textStyle,
          {
            marginLeft: icon && iconFlex === 'left' ? 12 : 0,
            textAlign: 'center',
            fontWeight: 'bold',
          },
        ]}
        flex={0}
      />
      {renderIcon('right')}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonComponent;
