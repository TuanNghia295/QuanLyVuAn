import ButtonComponent from '@/components/buttonComponent';
import CaseFilterModal from '@/components/Modal/CaseFilterModal';
import {COLOR} from '@/constants/color';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import React from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

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
  {
    id: '1',
    code: 'CA001',
    name: 'Vụ án A',
    type: 'Hình sự',
    decisionDate: '2025-09-01',
    endDate: '2025-09-20',
    officer: {id: '1', name: 'Nguyen Van A'},
    status: 'Đang xử lý',
  },
  {
    id: '2',
    code: 'CA002',
    name: 'Vụ án B',
    type: 'Dân sự',
    decisionDate: '2025-08-10',
    endDate: '2025-09-16',
    officer: {id: '2', name: 'Tran Thi B'},
    status: 'Sắp hết hạn',
  },
  {
    id: '3',
    code: 'CA003',
    name: 'Vụ án C',
    type: 'Hình sự',
    decisionDate: '2025-07-15',
    endDate: '2025-08-30',
    officer: {id: '1', name: 'Nguyen Van A'},
    status: 'Đã đóng',
  },
];

const HomeScreen = () => {
  const isAdmin = currentUser.role === 'admin';
  const router = useRouter();

  // State for filters/search
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('');
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);
  const [pendingType, setPendingType] = React.useState(typeFilter);
  const [pendingStatus, setPendingStatus] = React.useState(statusFilter);
  const [pendingDate, setPendingDate] = React.useState(dateFilter);

  const isCaseCompleted = (c: any) => c.plan && c.stages && c.stages.length > 0;

  const filteredCases = mockRecentCases.filter(
    c =>
      (isAdmin || c.officer.id === currentUser.id) &&
      (!typeFilter || c.type === typeFilter) &&
      (!statusFilter || c.status === statusFilter) &&
      (!dateFilter || c.decisionDate === dateFilter) &&
      (search === '' ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())),
  );

  const typeOptions = Array.from(new Set(mockRecentCases.map(c => c.type)));
  const statusOptions = Array.from(new Set(mockRecentCases.map(c => c.status)));
  const dateOptions = Array.from(new Set(mockRecentCases.map(c => c.decisionDate)));

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#f8f9fa'}}>
      <Text style={styles.title}>Quản lý vụ án</Text>
      <View style={styles.createBtn}>
        <ButtonComponent title="+ Tạo vụ án mới" onPress={() => router.push('/caseCreate')} />
      </View>
      {/* PieChart */}
      <View style={styles.chartPlaceholder}>
        <PieChart
          data={[
            {
              name: 'Chưa xử lý',
              population: mockStats.open,
              color: COLOR.GRAY4,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
            {
              name: 'Đang xử lý',
              population: mockStats.open,
              color: COLOR.BLUE,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
            {
              name: 'Đã đóng',
              population: mockStats.closed,
              color: COLOR.GREEN,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
            {
              name: 'Quá hạn',
              population: mockStats.expiring,
              color: COLOR.PRIMARY,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
          ]}
          width={Dimensions.get('window').width - 32}
          height={180}
          chartConfig={{color: () => '#888'}}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterRow}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={[styles.searchInput, {flex: 1}]}
            placeholder="Tìm kiếm số vụ án / tên vụ án"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            style={styles.filterIconBtn}
            onPress={() => {
              setPendingType(typeFilter);
              setPendingStatus(statusFilter);
              setPendingDate(dateFilter);
              setFilterModalVisible(true);
            }}>
            <Ionicons name="filter" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal lọc */}
      <CaseFilterModal
        visible={filterModalVisible}
        typeOptions={typeOptions}
        statusOptions={statusOptions}
        pendingType={pendingType}
        pendingStatus={pendingStatus}
        pendingDate={pendingDate}
        setPendingType={setPendingType}
        setPendingStatus={setPendingStatus}
        setPendingDate={setPendingDate}
        onCancel={() => setFilterModalVisible(false)}
        onConfirm={() => {
          setTypeFilter(pendingType);
          setStatusFilter(pendingStatus);
          setDateFilter(pendingDate);
          setFilterModalVisible(false);
        }}
      />

      {/* Danh sách vụ án */}
      <Text style={styles.sectionTitle}>Danh sách vụ án</Text>
      <FlatList
        data={filteredCases}
        keyExtractor={item => item.id}
        scrollEnabled={false} // tắt cuộn riêng, scroll theo ScrollView
        contentContainerStyle={{paddingHorizontal: 12, paddingBottom: 24}}
        renderItem={({item, index}) => {
          const completed = isCaseCompleted(item);
          const statusText = completed ? item.status : 'Chưa đủ thông tin';
          const statusColor = completed
            ? item.status === 'Đang xử lý'
              ? '#2563eb'
              : item.status === 'Đã đóng'
              ? '#16a34a'
              : item.status === 'Sắp hết hạn' || item.status === 'Quá hạn'
              ? COLOR.PRIMARY
              : '#000'
            : COLOR.PRIMARY;

          return (
            <TouchableOpacity
              style={styles.caseCard}
              onPress={() => router.push(`/caseDetail?id=${item.id}`)}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                <Text style={styles.caseTitle}>
                  {index + 1}. {item.name}
                </Text>
                <Text style={[styles.caseStatus, {color: statusColor}]}>{statusText}</Text>
              </View>

              <Text style={styles.caseText}>Số vụ án: {item.code}</Text>
              <Text style={styles.caseText}>Loại án: {item.type}</Text>
              <Text style={styles.caseText}>Cán bộ thụ ký: {item.officer.name}</Text>
              <Text style={styles.caseText}>
                Ngày QĐ: {item.decisionDate} | Ngày hết hạn: {item.endDate} | Còn lại:{' '}
                {getDaysLeft(item.endDate)} ngày
              </Text>

              {!completed && <Text style={styles.warningText}>Thiếu thông tin!</Text>}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 16}}>Không có vụ án phù hợp</Text>
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: COLOR.WHITE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
  },
  filterRow: {
    backgroundColor: COLOR.WHITE,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    elevation: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 15,
    backgroundColor: '#f8fafc',
  },
  filterBox: {marginBottom: 8},
  filterIconBtn: {
    marginLeft: 8,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    minWidth: 320,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
  },
  filterLabel: {fontWeight: 'bold', color: '#2563eb', marginBottom: 4},
  filterBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterBtnActive: {backgroundColor: '#2563eb'},
  filterText: {color: '#334155'},
  filterTextActive: {color: '#fff', fontWeight: 'bold'},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginHorizontal: 12,
    color: '#222',
  },
  caseCard: {
    backgroundColor: COLOR.WHITE,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  caseTitle: {fontSize: 16, fontWeight: 'bold', color: '#222', flex: 1, flexWrap: 'wrap'},
  caseText: {fontSize: 13, color: '#334155', marginBottom: 2},
  caseStatus: {fontWeight: 'bold'},
  warningText: {color: COLOR.PRIMARY, fontSize: 12, fontWeight: 'bold', marginTop: 4},
  createBtn: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default HomeScreen;
