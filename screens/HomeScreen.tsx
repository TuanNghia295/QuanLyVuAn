import ButtonComponent from '@/components/buttonComponent';
import Space from '@/components/Space';
import {COLOR} from '@/constants/color';
import {useRouter} from 'expo-router';
import React from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import CaseListScreen from './Case/CaseListScreen';

// Mock: role hiện tại
const currentUser = {
  id: '1',
  name: 'Nguyen Van A',
  role: 'admin', // hoặc 'user'
};

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
  const isAdmin = currentUser.role === 'admin';
  const router = useRouter();
  return (
    <View>
      <Text style={styles.title}>Quản lý vụ án</Text>
      <FlatList
        data={mockRecentCases}
        keyExtractor={item => item.id}
        renderItem={({item}) => <CaseListScreen item={item} />}
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

            {/* Chỉ hiện cho Admin */}
            {isAdmin && (
              <>
                <ButtonComponent
                  title="+ Tạo vụ án mới"
                  onPress={() => router.push('/caseCreate')}
                />

                <Space height={12} />

                {/* <ButtonComponent
                  title="+ Quản lý mẫu vụ án"
                  onPress={() => router.push('/createTemplate')}
                /> */}
              </>
            )}
            <Space height={12} />
            <Text style={styles.sectionTitle}>Danh sách vụ án</Text>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
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
});

export default HomeScreen;
