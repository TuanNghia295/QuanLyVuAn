import {COLOR} from '@/constants/color';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const mockNotifications = [
  {
    id: '1',
    title: 'Có vụ án sắp hết hạn',
    caseName: 'Vụ án A',
    time: '2025-09-19 08:00',
    read: false,
  },
  {
    id: '2',
    title: 'Vụ án B đã cập nhật timeline',
    caseName: 'Vụ án B',
    time: '2025-09-17 14:30',
    read: true,
  },
  {
    id: '3',
    title: 'Có vụ án mới được giao',
    caseName: 'Vụ án C',
    time: '2025-09-16 09:15',
    read: false,
  },
];

const NotificationScreen = () => {
  return (
    <View>
      <Text style={styles.title}>Thông báo vụ án</Text>
      <FlatList
        data={mockNotifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={[styles.item]}>
            <View style={{flex: 1}}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemCase}>{item.caseName}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={styles.detailBtnText}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{padding: 16}}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', color: '#888', marginTop: 32}}>
            Không có thông báo nào
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  itemCase: {
    fontSize: 14,
    color: '#2980b9',
    marginBottom: 2,
  },
  itemTime: {
    fontSize: 13,
    color: '#888',
  },
  detailBtn: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  detailBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
