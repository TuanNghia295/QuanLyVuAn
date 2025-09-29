import React, {useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Props = {
  label: string;
  value?: string;
  onChange: (val: string) => void;
};

export default function StageDatePicker({label, value, onChange}: Props) {
  const [show, setShow] = useState(false);
  const dateValue = value ? new Date(value) : new Date();

  return (
    <>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderRadius: 6,
          padding: 10,
          marginVertical: 4,
        }}
        onPress={() => setShow(true)}>
        <Text style={{color: value ? '#334155' : '#64748b'}}>
          {value ? dateValue.toLocaleDateString() : label}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePickerModal
          isVisible={show}
          mode="date"
          onConfirm={selectedDate => {
            setShow(false);
            if (selectedDate) onChange(selectedDate.toISOString());
          }}
          onCancel={() => setShow(false)}
        />
      )}
    </>
  );
}
