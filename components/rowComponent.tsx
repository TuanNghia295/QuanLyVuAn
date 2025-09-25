import {globalStyles} from '@/constants/globalStyles';
import React, {ReactNode} from 'react';
import {FlexAlignType, StyleProp, View, ViewStyle} from 'react-native';

type JustifyType =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

type DirectionType = 'row' | 'column';

type WrapType = 'wrap' | 'nowrap';

interface RowComponentProps {
  children?: ReactNode;
  justify?: JustifyType;
  alignItems?: FlexAlignType;
  flexDirection?: DirectionType;
  wrap?: WrapType;
  background?: string;
  styles?: StyleProp<ViewStyle>;
}

const RowComponent: React.FC<RowComponentProps> = ({
  children,
  justify = 'flex-start',
  alignItems = 'center',
  flexDirection = 'row',
  wrap = 'nowrap',
  background,
  styles,
}) => {
  const localStyle: StyleProp<ViewStyle> = [
    globalStyles.row,
    {
      flexDirection,
      justifyContent: justify,
      alignItems,
      flexWrap: wrap,
      backgroundColor: background,
      marginBottom: 5,
    },
    styles,
  ];

  return <View style={localStyle}>{children}</View>;
};

export default RowComponent;
