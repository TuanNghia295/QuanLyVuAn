import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type OptionType = {label: string; value: string};

type RenderModalDropdownProps = {
  label: string;
  options: OptionType[];
  value: string;
  onChange: (val: string) => void;
  visible: boolean;
  setVisible: (v: boolean) => void;
};

export default function RenderModalDropdown({
  label,
  options,
  value,
  onChange,
  visible,
  setVisible,
}: RenderModalDropdownProps) {
  return (
    <>
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={{color: value ? '#334155' : '#64748b'}}>
          {options.find(opt => opt.value === value)?.label || `Chọn ${label}`}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={styles.modalOption}
                onPress={() => {
                  onChange(opt.value);
                  setVisible(false);
                }}>
                <Text style={styles.modalOptionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#334155',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#334155',
  },
});
