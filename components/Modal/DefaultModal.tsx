import {COLOR} from '@/constants/color';
import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type DefaultModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  onClose?: () => void;
};

const DefaultModal: React.FC<DefaultModalProps> = ({
  visible,
  title = 'Thông báo',
  message,
  confirmText = 'Đóng',
  onClose,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLOR.WHITE,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: COLOR.PRIMARY,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLOR.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DefaultModal;
