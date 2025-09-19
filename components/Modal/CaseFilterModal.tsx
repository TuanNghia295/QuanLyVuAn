// CaseFilterModal.tsx
import {COLOR} from '@/constants/color';
import {Ionicons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {FlatList, Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface CaseFilterModalProps {
  visible: boolean;
  typeOptions: string[];
  statusOptions: string[];
  pendingType: string;
  pendingStatus: string;
  pendingDate: string; // định dạng 'YYYY-MM-DD'
  setPendingType: (val: string) => void;
  setPendingStatus: (val: string) => void;
  setPendingDate: (val: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const CaseFilterModal: React.FC<CaseFilterModalProps> = ({
  visible,
  typeOptions,
  statusOptions,
  pendingType,
  pendingStatus,
  pendingDate,
  setPendingType,
  setPendingStatus,
  setPendingDate,
  onCancel,
  onConfirm,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS giữ picker mở
    if (selectedDate) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      setPendingDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bộ lọc vụ án</Text>

          {/* Loại án */}
          <Text style={styles.filterLabel}>Loại án:</Text>
          <FlatList
            horizontal
            data={typeOptions}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[styles.filterBtn, pendingType === item && styles.filterBtnActive]}
                onPress={() => setPendingType(pendingType === item ? '' : item)}>
                <Text style={pendingType === item ? styles.filterTextActive : styles.filterText}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Trạng thái */}
          <Text style={styles.filterLabel}>Trạng thái:</Text>
          <FlatList
            horizontal
            data={statusOptions}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[styles.filterBtn, pendingStatus === item && styles.filterBtnActive]}
                onPress={() => setPendingStatus(pendingStatus === item ? '' : item)}>
                <Text style={pendingStatus === item ? styles.filterTextActive : styles.filterText}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Ngày ra quyết định */}
          <Text style={styles.filterLabel}>Ngày ra quyết định:</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={[styles.datePickerBtn, {flex: 1}]}
              onPress={() => setShowDatePicker(true)}>
              <Text style={{color: pendingDate ? '#334155' : '#888'}}>
                {pendingDate || 'Chọn ngày'}
              </Text>
            </TouchableOpacity>

            {pendingDate ? (
              <TouchableOpacity
                style={{marginLeft: 8, padding: 6}}
                onPress={() => setPendingDate('')}>
                {/* Bạn có thể dùng Ionicons hoặc bất kỳ thư viện icon nào */}
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            ) : null}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={pendingDate ? new Date(pendingDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date(2100, 12, 31)}
              minimumDate={new Date(2000, 0, 1)}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.modalBtn} onPress={onCancel}>
              <Text style={{color: COLOR.PRIMARY, fontWeight: 'bold'}}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, {backgroundColor: COLOR.PRIMARY}]}
              onPress={onConfirm}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLOR.WHITE,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center'},
  filterLabel: {fontWeight: 'bold', color: COLOR.PRIMARY, marginVertical: 6},
  filterBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterBtnActive: {backgroundColor: COLOR.PRIMARY},
  filterText: {color: '#334155'},
  filterTextActive: {color: '#fff', fontWeight: 'bold'},
  datePickerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: '#f8fafc',
  },
  buttonRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 18},
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    alignItems: 'center',
  },
});

export default CaseFilterModal;
