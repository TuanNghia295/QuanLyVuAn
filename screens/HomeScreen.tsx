import {COLOR} from '@/constants/color';
import React from 'react';
import {Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
const mockStats = {
  total: 120,
  expiring: 8,
  closed: 40,
  open: 80,
};

const mockRecentCases = [
  {id: '1', name: 'Vụ án A', status: 'Đang xử lý', due: '2025-09-20'},
  {id: '2', name: 'Vụ án B', status: 'Sắp hết hạn', due: '2025-09-16'},
  {id: '3', name: 'Vụ án C', status: 'Đã đóng', due: '2025-08-30'},
];

const HomeScreen = () => {
  return (
    <View>
      <Text style={styles.title}>Quản lý vụ án</Text>
      <FlatList
        data={mockRecentCases}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.caseItem}>
            <View style={{flex: 1}}>
              <Text style={styles.caseName}>{item.name}</Text>
              <Text style={styles.caseStatus}>
                {item.status} - Hạn: {item.due}
              </Text>
            </View>
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={styles.detailBtnText}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.statsRow}>{/* ...stats UI... */}</View>
            <View style={styles.chartPlaceholder}>
              <PieChart
                data={[
                  {
                    name: 'Đang xử lý',
                    population: mockStats.open,
                    color: '#3498db',
                    legendFontColor: '#222',
                    legendFontSize: 14,
                  },
                  {
                    name: 'Đã đóng',
                    population: mockStats.closed,
                    color: '#27ae60',
                    legendFontColor: '#222',
                    legendFontSize: 14,
                  },
                ]}
                width={Dimensions.get('window').width - 32}
                height={180}
                chartConfig={{
                  color: () => '#888',
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
            <TouchableOpacity style={styles.createBtn}>
              <Text style={styles.createBtnText}>+ Tạo vụ án mới</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Danh sách vụ án</Text>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: COLOR.WHITE,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: COLOR.WHITE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  createBtn: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  createBtnText: {
    color: COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  caseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  caseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  caseStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  detailBtn: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  detailBtnText: {
    color: COLOR.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
