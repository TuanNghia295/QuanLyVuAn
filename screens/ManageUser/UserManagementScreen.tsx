import ButtonComponent from '@/components/buttonComponent';
import {COLOR} from '@/constants/color';
import {useGetUserList} from '@/hooks/useUser';
import {Ionicons} from '@expo/vector-icons';
import React, {useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

type User = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  caseCount: number;
  role: string;
  status: string;
  password: string;
};

const UserManagementScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const {data: usersList, fetchNextPage, hasNextPage, isFetchingNextPage} = useGetUserList();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFields, setEditFields] = useState({name: '', phone: '', password: ''});
  const [addFields, setAddFields] = useState({name: '', phone: '', password: ''});
  // console.log('usersList', JSON.stringify(usersList, null, 2));

  // Lấy data thật từ API
  // Sử dụng useInfiniteQuery trả về usersList.pages
  const userData = usersList?.pages?.flatMap(page => page.data) || [];

  // Sort: newest first
  const sortedUsers = [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // Delete
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };
  const confirmDeleteUser = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    setDeleteModalVisible(false);
    setSelectedUser(null);
  };

  // Edit
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditFields({name: user.name, phone: user.phone, password: user.password});
    setEditModalVisible(true);
  };
  const handleSaveEdit = () => {
    if (!selectedUser) return;
    setUsers(prev =>
      prev.map(u =>
        u.id === selectedUser.id
          ? {...u, name: editFields.name, phone: editFields.phone, password: editFields.password}
          : u,
      ),
    );
    setEditModalVisible(false);
  };

  // Add
  const openAddModal = () => {
    setAddFields({name: '', phone: '', password: ''});
    setAddModalVisible(true);
  };
  const handleSaveAdd = () => {
    if (!addFields.name || !addFields.phone || !addFields.password) return;
    setUsers(prev => [
      {
        id: (prev.length + 1).toString(),
        name: addFields.name,
        phone: addFields.phone,
        createdAt: new Date().toISOString().slice(0, 10),
        caseCount: 0,
        role: 'user',
        status: 'active',
        password: addFields.password,
      },
      ...prev,
    ]);
    setAddModalVisible(false);
  };

  // Render item cho data thật
  const renderItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Ngày tạo:</Text>
        <Text style={styles.value}>{item.createdAt?.slice(0, 10)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Họ tên:</Text>
        <Text style={styles.value}>{item.fullName}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>SĐT:</Text>
        <Text style={styles.value}>{item.phone}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Vai trò:</Text>
        <Text style={styles.value}>{item.role}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Trạng thái:</Text>
        <Text style={[styles.value, {color: COLOR.GREEN}]}>
          {item.role ? 'Đang hoạt động' : 'Bị khóa'}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
          <Ionicons name="create-outline" size={20} color="#2563eb" />
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openDeleteModal(item)}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={[styles.actionText, {color: '#ef4444'}]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Infinite scroll (giả lập, vì API trả về nextPage)
  const handleLoadMore = () => {
    // Nếu có nextPage thì gọi API lấy thêm
    // TODO: Nếu dùng useInfiniteQuery thì gọi fetchNextPage
  };

  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Quản lý người dùng</Text>
      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Ionicons name="person-add-outline" size={20} color="#fff" />
        <Text style={styles.addBtnText}>Thêm</Text>
      </TouchableOpacity>
      <FlatList
        data={userData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 24}}
        onEndReached={({distanceFromEnd}) => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isFetchingNextPage ? <Text style={{textAlign: 'center'}}>Đang tải thêm...</Text> : null
        }
      />

      {/* Delete Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận xóa người dùng</Text>
            <Text style={{textAlign: 'center', marginBottom: 16}}>
              Bạn có chắc chắn muốn xóa{' '}
              <Text style={{fontWeight: 'bold'}}>{selectedUser?.name}</Text>?
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12}}>
              <ButtonComponent
                title="Hủy"
                type="shortGray"
                onPress={() => setDeleteModalVisible(false)}
              />
              <ButtonComponent title="Xóa" type="shortPrimary" onPress={confirmDeleteUser} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa thông tin người dùng</Text>

            <Text style={styles.inputLabel}>Họ tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ tên"
              value={editFields.name}
              onChangeText={v => setEditFields(f => ({...f, name: v}))}
            />

            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              value={editFields.phone}
              onChangeText={v => setEditFields(f => ({...f, phone: v}))}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={editFields.password}
              onChangeText={v => setEditFields(f => ({...f, password: v}))}
              secureTextEntry
            />

            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12}}>
              <ButtonComponent
                title="Hủy"
                type="shortGray"
                onPress={() => setEditModalVisible(false)}
              />
              <ButtonComponent title="Lưu" type="shortPrimary" onPress={handleSaveEdit} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm người dùng mới</Text>

            <Text style={styles.inputLabel}>Họ tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ tên"
              value={addFields.name}
              onChangeText={v => setAddFields(f => ({...f, name: v}))}
            />

            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              value={addFields.phone}
              onChangeText={v => setAddFields(f => ({...f, phone: v}))}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={addFields.password}
              onChangeText={v => setAddFields(f => ({...f, password: v}))}
              secureTextEntry
            />

            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12}}>
              <ButtonComponent
                onPress={() => setAddModalVisible(false)}
                title="Hủy"
                type="shortGray"
              />

              <ButtonComponent onPress={handleSaveAdd} title="Thêm" type="shortPrimary" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e293b',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#64748b',
    width: 90,
    fontSize: 15,
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.BLUE,
    marginLeft: 4,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
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
    color: COLOR.BLUE,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 6,
    color: COLOR.GRAY5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: COLOR.GRAY2,
  },
  modalBtnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  modalBtnSave: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLOR.PRIMARY,
  },
  active: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  locked: {
    color: COLOR.PRIMARY,
    fontWeight: 'bold',
  },
});

export default UserManagementScreen;
