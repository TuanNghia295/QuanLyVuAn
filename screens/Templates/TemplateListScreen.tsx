import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Mock data
const mockTemplates = [
  {
    id: '1',
    type: 'DBNT',
    name: 'Mẫu vụ án Lừa đảo chiếm đoạt tài sản',
    columns: [
      'STT',
      'Điều',
      'Nội dung vụ án',
      'Số bị can',
      'Ngày ra quyết định',
      'Ngày hết hạn',
      'Cán bộ thụ lý',
      'Loại TP',
    ],
    rows: [
      ['1', '174', 'Vụ lừa đảo ...', '0', '19/09/2024', '19/09/2025', 'Nguyễn Xuân Đức', 'DBNT'],
      ['2', '174', 'Vụ lừa đảo ...', '0', '08/10/2024', '09/10/2025', 'Hồ Xuân Chung', 'DBNT'],
    ],
  },
  {
    id: '2',
    type: 'RNT',
    name: 'Mẫu vụ án Mua bán người dưới 16 tuổi',
    columns: [
      'STT',
      'Điều',
      'Nội dung vụ án',
      'Số bị can',
      'Ngày ra quyết định',
      'Ngày hết hạn',
      'Cán bộ thụ lý',
      'Loại TP',
    ],
    rows: [['1', '151', 'Vụ mua bán ...', '0', '12/12/2024', '12/12/2025', 'Hồ Xuân Chung', 'RNT']],
  },
];

const TemplateListScreen = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const openDeleteModal = (template: any) => {
    setSelectedTemplate(template);
    setDeleteModalVisible(true);
  };
  const confirmDeleteTemplate = () => {
    if (!selectedTemplate) return;
    setTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id));
    setDeleteModalVisible(false);
    setSelectedTemplate(null);
  };

  return (
    <View style={{flex: 1}}>
      {/* <TouchableOpacity
        style={{
          backgroundColor: '#2563eb',
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 24,
          margin: 16,
          alignSelf: 'flex-end',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
        onPress={() => router.push('/templates/templateCreate')}>
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>Tạo mẫu vụ án</Text>
      </TouchableOpacity> */}
      <FlatList
        data={templates}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <View style={styles.card}>
            <Text style={styles.stt}>{index + 1}</Text>
            <View style={{flex: 1}}>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() => {
                router.push({pathname: '/templates/templateDetail', params: {id: item.id}});
              }}>
              <Ionicons name="eye-outline" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => openDeleteModal(item)}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{padding: 16}}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', color: '#888', marginTop: 32}}>
            Không có mẫu vụ án nào
          </Text>
        }
      />
      {/* Modal xác nhận xóa */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận xóa mẫu vụ án</Text>
            <Text style={{textAlign: 'center', marginBottom: 16}}>
              Bạn có chắc chắn muốn xóa mẫu{' '}
              <Text style={{fontWeight: 'bold'}}>{selectedTemplate?.name}</Text>?
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12}}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={styles.modalBtnCancel}>
                <Text style={{color: '#64748b'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDeleteTemplate} style={styles.modalBtnDelete}>
                <Text style={{color: '#ef4444'}}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  stt: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2563eb',
    width: 32,
    textAlign: 'center',
  },
  type: {
    fontSize: 14,
    color: '#2980b9',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  detailBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2563eb',
    textAlign: 'center',
  },
  modalBtnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  modalBtnDelete: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
});

export default TemplateListScreen;
