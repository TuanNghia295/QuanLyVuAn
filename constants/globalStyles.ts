import {StyleSheet} from 'react-native';
import {COLOR} from './color';
import {fontFamilies} from './fontFamilies';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: 'f5f6fa',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
  },

  text: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: COLOR.BLACK1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
