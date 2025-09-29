import {Ionicons} from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {useRouter} from 'expo-router';
import React, {useState} from 'react';
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

import ButtonComponent from '@/components/buttonComponent';
import CaseFilterModal from '@/components/Modal/CaseFilterModal';
import RowComponent from '@/components/rowComponent';
import {COLOR} from '@/constants/color';

// Mock: role hiện tại
const currentUser = {
  id: '1',
  name: 'Nguyen Van A',
  role: 'admin', // hoặc 'user'
};

// Mock thống kê theo tháng
const mockStatsByMonth: Record<string, {open: number; closed: number; expiring: number}> = {
  '2025-09': {open: 80, closed: 40, expiring: 8},
  '2025-08': {open: 60, closed: 30, expiring: 5},
  '2025-07': {open: 50, closed: 20, expiring: 12},
};

// Mock case list
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
  {
    id: '4',
    code: 'CA004',
    name: 'Vụ án D',
    type: 'Dân sự',
    decisionDate: '2025-07-15',
    endDate: '2025-08-30',
    officer: {id: '1', name: 'Nguyen Van A'},
    status: 'Chưa xử lý',
  },
];

const HomeScreen = () => {
  const router = useRouter();
  const isAdmin = currentUser.role === 'admin';

  // State filter thống kê theo tháng/năm
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [showPicker, setShowPicker] = useState(false);

  // State filters/search case list
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [pendingType, setPendingType] = useState(typeFilter);
  const [pendingStatus, setPendingStatus] = useState(statusFilter);
  const [pendingDate, setPendingDate] = useState(dateFilter);

  const isCaseCompleted = (c: any) => c.plan && c.stages && c.stages.length > 0;

  // Lọc danh sách vụ án
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
    const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // Lấy dữ liệu thống kê theo tháng
  const key = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const currentStats = mockStatsByMonth[key] || {
    open: 0,
    closed: 0,
    expiring: 0,
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedMonth(date.getMonth() + 1);
      setSelectedYear(date.getFullYear());
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Text style={styles.title}>Quản lý vụ án</Text>

      {/* Bộ lọc tháng/năm cho PieChart */}
      <View style={styles.chartCardWrap}>
        <TouchableOpacity style={styles.monthCenterWrap} onPress={() => setShowPicker(true)}>
          <Text style={styles.monthTextLabel}>Tháng</Text>
          <Text style={styles.monthTextValue}>{selectedMonth}</Text>
          <Text style={styles.monthTextLabel}>/</Text>
          <Text style={styles.monthTextValue}>{selectedYear}</Text>
          <Ionicons name="calendar" size={20} color={COLOR.PRIMARY} style={{marginLeft: 6}} />
        </TouchableOpacity>

        {showPicker && (
          <DateTimePickerModal
            isVisible={showPicker}
            mode="date"
            onConfirm={date => {
              setSelectedMonth(date.getMonth() + 1);
              setSelectedYear(date.getFullYear());
              setShowPicker(false);
            }}
            onCancel={() => setShowPicker(false)}
          />
        )}

        <PieChart
          data={[
            {
              name: 'Đang xử lý',
              population: currentStats.open,
              color: COLOR.BLUE,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
            {
              name: 'Đã đóng',
              population: currentStats.closed,
              color: COLOR.GREEN,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
            {
              name: 'Quá hạn',
              population: currentStats.expiring,
              color: COLOR.PRIMARY,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
          ]}
          width={Dimensions.get('window').width - 48}
          height={180}
          chartConfig={{color: () => '#888'}}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Bộ lọc danh sách vụ án */}
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
            <Ionicons name="filter" size={24} color={COLOR.BLUE} />
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
      <RowComponent justify="flex-end" styles={styles.createRowWrap}>
        <ButtonComponent
          icon={<Ionicons name="add-circle" size={18} color="#fff" />}
          iconFlex="left"
          styles={[styles.createBtn, styles.createCaseBtn]}
          title={'Tạo vụ án mới'}
          onPress={() => router.push('/caseCreate')}
          type="shortPrimary"
        />
        {isAdmin && (
          <ButtonComponent
            icon={<Ionicons name="document-text-outline" size={18} color="#fff" />}
            iconFlex="left"
            styles={[styles.createBtn, styles.createTemplateBtn]}
            title={' Mẫu vụ án'}
            onPress={() => router.push('/templates/templateList')}
            type="shortPrimary"
          />
        )}
      </RowComponent>

      <FlatList
        data={filteredCases}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        contentContainerStyle={{paddingHorizontal: 12, paddingBottom: 24}}
        renderItem={({item, index}) => {
          const completed = isCaseCompleted(item);
          const statusText = completed ? item.status : 'Chưa đủ thông tin';
          const statusColor = completed
            ? item.status === 'Đang xử lý'
              ? COLOR.BLUE
              : item.status === 'Đã đóng'
              ? COLOR.GREEN
              : item.status === 'Sắp hết hạn' || item.status === 'Quá hạn'
              ? COLOR.PRIMARY
              : COLOR.BLACK1
            : COLOR.PRIMARY;

          return (
            <TouchableOpacity
              style={styles.caseCard}
              onPress={() => router.push(`/caseDetail?id=${item.id}`)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}>
                <Text style={styles.caseTitle}>
                  {index + 1}. {item.name}
                </Text>
                <Text style={[styles.caseStatus, {color: statusColor}]}>{statusText}</Text>
              </View>

              <Text style={styles.caseText}>Số vụ án: {item.code}</Text>
              <Text style={styles.caseText}>Loại án: {item.type}</Text>
              <Text style={styles.caseText}>Cán bộ thụ lý: {item.officer.name}</Text>
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
  chartCardWrap: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 12,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  monthCenterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 12,
  },
  monthTextLabel: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
    marginHorizontal: 2,
  },
  monthTextValue: {
    fontSize: 18,
    color: COLOR.PRIMARY,
    fontWeight: 'bold',
    marginHorizontal: 2,
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
  filterIconBtn: {
    marginLeft: 8,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  caseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    flexWrap: 'wrap',
  },
  caseText: {fontSize: 13, color: '#334155', marginBottom: 2},
  caseStatus: {fontWeight: 'bold'},
  warningText: {
    color: COLOR.PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  createRowWrap: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  createBtn: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 18,
    elevation: 2,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  createCaseBtn: {
    backgroundColor: COLOR.PRIMARY,
  },
  createTemplateBtn: {
    backgroundColor: '#2563eb',
  },
});

export default HomeScreen;
