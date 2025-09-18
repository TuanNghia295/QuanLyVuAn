import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import usersData from '../../data/users.json';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

const UserManagementScreen = () => {
  const renderItem = ({item}: {item: User}) => (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Tên:</Text>
        <Text style={styles.value}>{item.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{item.email}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Vai trò:</Text>
        <Text style={styles.value}>{item.role === 'admin' ? 'Admin' : 'Người dùng'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Trạng thái:</Text>
        <Text style={[styles.value, item.status === 'active' ? styles.active : styles.locked]}>
          {item.status === 'active' ? 'Hoạt động' : 'Khóa'}
        </Text>
      </View>
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Quản lý người dùng</Text>
      <FlatList
        data={usersData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 24}}
      />
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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    marginBottom: 8,
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 15,
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
  active: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  locked: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
});

export default UserManagementScreen;
