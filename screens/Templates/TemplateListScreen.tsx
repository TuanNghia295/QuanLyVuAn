import {useGetTemplateList} from '@/hooks/useTemPlates';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TemplateListScreen = () => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError} =
    useGetTemplateList({limit: 10});

  // Flatten data from react-query infinite
  const templates = data?.pages?.flatMap(page => page.data) || [];

  const openDeleteModal = (template: any) => {
    setSelectedTemplate(template);
    setDeleteModalVisible(true);
  };
  const confirmDeleteTemplate = () => {
    // TODO: Call API to delete template
    setDeleteModalVisible(false);
    setSelectedTemplate(null);
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={templates}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <View style={styles.card}>
            <Text style={styles.stt}>{index + 1}</Text>
            <View style={{flex: 1}}>
              <Text style={styles.type}>{item.title}</Text>
              <Text style={styles.name}>{item.description || 'Không có mô tả'}</Text>
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
          isLoading ? (
            <ActivityIndicator size="large" color="#2563eb" style={{marginTop: 32}} />
          ) : (
            <Text style={{textAlign: 'center', color: '#888', marginTop: 32}}>
              Không có mẫu vụ án nào
            </Text>
          )
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#2563eb" style={{marginVertical: 16}} />
          ) : null
        }
      />
      {/* Modal xác nhận xóa */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận xóa mẫu vụ án</Text>
            <Text style={{textAlign: 'center', marginBottom: 16}}>
              Bạn có chắc chắn muốn xóa mẫu{' '}
              <Text style={{fontWeight: 'bold'}}>{selectedTemplate?.title}</Text>?
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
