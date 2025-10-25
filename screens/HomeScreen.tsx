import {Ionicons} from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {useFocusEffect, useRouter} from 'expo-router';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import ButtonComponent from '@/components/buttonComponent';
import LoadingComponent from '@/components/LoadingComponent';
import CaseFilterModal from '@/components/Modal/CaseFilterModal';
import PieChartStats from '@/components/PieChartStats';
import RowComponent from '@/components/rowComponent';
import Space from '@/components/Space';
import TextComponent from '@/components/textComponent';
import {COLOR} from '@/constants/color';
import {useListCase} from '@/hooks/useCase';
import usePushNotifications, {useCreateExpoToken} from '@/hooks/usePushNotifications';
import {useMyReport} from '@/hooks/useReport';
import {useUserInfo} from '@/hooks/useUser';
import {useUserStore} from '@/store/userStore';

const HomeScreen = (): React.ReactNode => {
  const router = useRouter();
  const {userInfo, setUserInfo} = useUserStore();
  const {data: userInfor, isFetching: loadingUserInfo, isSuccess} = useUserInfo();

  const isAdmin = userInfor?.role === 'admin';

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
  const {expoPushToken, notification} = usePushNotifications();
  const {mutate: onAddToken} = useCreateExpoToken();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const {
    data: listCase,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch: refetchListCase,
  } = useListCase(10, debouncedSearch?.trim());
  // State cho refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchListCase();
    } finally {
      setRefreshing(false);
    }
  };

  // Flatten data từ pages
  const allCases = useMemo(() => {
    return listCase?.pages?.flatMap(page => page) || [];
  }, [listCase]);

  // Mapping status từ API sang hiển thị
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      // PENDING: 'Chưa xử lý',
      // IN_PROGRESS: 'Đang xử lý',
      // COMPLETED: 'Đã đóng',
      // EXPIRING: 'Sắp hết hạn',
      // OVERDUE: 'Quá hạn',

      PENDING: 'Chưa xử lý', // Chưa xử lý
      IN_PROGRESS: 'Đang xử lý', // Đang xử lý
      COMPLETED: 'Hoàn thành', // Đã đóng
      ON_HOLD: 'Tạm hoãn', // Tạm hoãn
      CANCELLED: 'Hủy bỏ', // Hủy bỏ
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: COLOR.GRAY4,
      IN_PROGRESS: COLOR.BLUE,
      COMPLETED: COLOR.GREEN,
      EXPIRING: COLOR.PRIMARY,
      OVERDUE: COLOR.PRIMARY,
    };
    return colorMap[status] || COLOR.BLACK1;
  };

  // Lọc danh sách vụ án
  const filteredCases = useMemo(() => {
    return allCases.filter(c => {
      const matchesUser = isAdmin || c.userId === userInfo?.id;
      const matchesType = !typeFilter || c.template?.title === typeFilter;
      const matchesStatus = !statusFilter || getStatusText(c.status) === statusFilter;
      const matchesDate = !dateFilter || c.startedAt?.startsWith(dateFilter);

      return matchesUser && matchesType && matchesStatus && matchesDate;
    });
  }, [allCases, isAdmin, userInfo?.id, typeFilter, statusFilter, dateFilter]);

  // Lấy unique options cho filter
  const typeOptions = useMemo(() => {
    return Array.from(new Set(allCases.map(c => c.template?.title).filter(Boolean)));
  }, [allCases]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(allCases.map(c => getStatusText(c.status))));
  }, [allCases]);

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Tính startDate và endDate cho tháng được chọn
  const startDate = useMemo(() => {
    return new Date(selectedYear, selectedMonth - 1, 1).toISOString().slice(0, 10);
  }, [selectedYear, selectedMonth]);
  const endDate = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).toISOString().slice(0, 10);
  }, [selectedYear, selectedMonth]);

  // Gọi API lấy thống kê
  const {data: reportStats, isLoading: loadingStats} = useMyReport(startDate, endDate);
  useEffect(() => {
    if (isSuccess) {
      console.log('isSuccess', isSuccess);
      setUserInfo(userInfor);
    }
  }, [isSuccess]);

  useFocusEffect(
    useCallback(() => {
      if (expoPushToken) {
        onAddToken({tokenExpo: expoPushToken, userId: userInfor?.id});
      }
    }, [expoPushToken]),
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  console.log('debouncedSearch', debouncedSearch);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLOR.PRIMARY} />
        <Text style={styles.footerLoaderText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderCaseItem = ({item, index}: {item: any; index: number}) => {
    const statusText = getStatusText(item.status);
    const statusColor = getStatusColor(item.status);
    const hasRequiredInfo = item.fields && item.fields.length > 0;

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
        </View>

        <Space height={4} />

        <RowComponent justify="flex-end">
          <TextComponent text="Trạng thái:" title size={14} flex={1} />
          <TextComponent styles={[styles.caseStatus, {color: statusColor}]} text={statusText} />
        </RowComponent>

        <RowComponent wrap="wrap">
          <TextComponent text="Mẫu:" title size={14} flex={1} />
          <TextComponent numberOfLine={6} text={`${item.template?.title || 'Chưa có'}`} />
        </RowComponent>

        <RowComponent wrap="wrap">
          <TextComponent text="Mô tả:" title size={14} flex={!item?.description ? 1 : 0} />
          <TextComponent numberOfLine={6} text={`${item.description || 'Không có mô tả'}`} />
        </RowComponent>

        {item.assignee && (
          <RowComponent wrap="wrap">
            <TextComponent text="Cán bộ thụ lý:" title size={14} flex={1} />
            <TextComponent numberOfLine={6} text={`${item.assignee.fullName}`} />
          </RowComponent>
        )}

        <RowComponent wrap="wrap">
          <TextComponent text="Ngày bắt đầu:" flex={1} title size={14} />
          <TextComponent text={`${formatDate(item.startDate)}`} />
        </RowComponent>

        <RowComponent>
          <TextComponent text="Ngày hết hạn:" flex={1} title size={14} />
          <TextComponent text={`${formatDate(item.endDate)}`} />
        </RowComponent>
        <RowComponent>
          <TextComponent text="Còn lại:" flex={1} title size={14} />
          <TextComponent text={`${getDaysLeft(item.endDate)} ngày`} />
        </RowComponent>
        {!hasRequiredInfo && <Text style={styles.warningText}>Thiếu thông tin!</Text>}
      </TouchableOpacity>
    );
  };

  const renderHeader = useMemo(
    () => (
      <View>
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

          <PieChartStats
            open={reportStats?.pending || 0}
            closed={reportStats?.completed || 0}
            expiring={reportStats?.inProgress || 0}
            loading={loadingStats}
          />
        </View>

        {/* Bộ lọc danh sách vụ án */}
        <View style={styles.filterRow}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[styles.searchInput, {flex: 1}]}
              placeholder="Tìm kiếm số vụ án / tên vụ án"
              value={search}
              onChangeText={value => setSearch(value)}
              placeholderTextColor={COLOR.GRAY4}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
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
        <RowComponent justify="center" styles={styles.createRowWrap}>
          <ButtonComponent
            icon={<Ionicons name="add-circle" size={18} color="#fff" />}
            iconFlex="left"
            styles={[styles.createBtn, styles.createCaseBtn]}
            title={'Tạo vụ án mới'}
            onPress={() => router.navigate('/caseCreate')}
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
      </View>
    ),
    [
      search,
      debouncedSearch,
      typeFilter,
      statusFilter,
      dateFilter,
      pendingType,
      pendingStatus,
      pendingDate,
      filterModalVisible,
      selectedMonth,
      selectedYear,
      showPicker,
      reportStats,
      loadingStats,
      isAdmin,
      router,
      statusOptions,
      typeOptions,
    ],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View>
      {loadingUserInfo && <LoadingComponent />}

      <FlatList
        data={filteredCases}
        keyExtractor={item => item.id}
        renderItem={renderCaseItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={COLOR.PRIMARY} />
              <Text style={styles.emptyText}>Đang tải dữ liệu...</Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>Không có vụ án phù hợp</Text>
          )
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={true}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLOR.PRIMARY]}
            tintColor="red"
          />
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoaderText: {
    marginTop: 8,
    fontSize: 14,
    color: COLOR.GRAY4,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    color: COLOR.GRAY4,
  },
});

export default HomeScreen;
