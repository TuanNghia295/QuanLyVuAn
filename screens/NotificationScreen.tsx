import LoadingComponent from '@/components/LoadingComponent';
import {COLOR} from '@/constants/color';
import {useDeleteNoti, useListNoti, useMarkAllRead} from '@/hooks/useNotifications';
import {Ionicons} from '@expo/vector-icons';
import {formatDistanceToNow} from 'date-fns';
import {vi} from 'date-fns/locale';
import {useFocusEffect, useRouter} from 'expo-router';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const NotificationScreen = () => {
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const {
    data: listNoti,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch: refetchNotiList,
  } = useListNoti();
  const {mutate: onMarkAllRead} = useMarkAllRead();

  const {mutate: deleteNotification} = useDeleteNoti();

  // State cho refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchNotiList();
    } finally {
      setRefreshing(false);
    }
  };

  // Flatten data từ pages
  const allNotifications = useMemo(() => {
    return listNoti?.pages?.flatMap(page => page.data) || [];
  }, [listNoti]);

  const handleDelete = (id: string) => {
    Alert.alert('Xóa thông báo', 'Bạn có chắc chắn muốn xóa thông báo này không?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => deleteNotification(id),
      },
    ]);
  };

  const renderNotificationItem = ({item}: {item: any}) => {
    const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
      addSuffix: true,
      locale: vi,
    });

    return (
      <View style={[styles.item, !item.isRead && styles.unreadCard]}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="close-circle" size={24} color={COLOR.PRIMARY} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.string && <Text style={styles.itemTitle}>{item.string}</Text>}
          <Text style={styles.itemCase}>Loại: {item.type}</Text>
          <Text style={styles.itemTime}>{timeAgo}</Text>
        </View>
        {item.caseId && (
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => router.push(`/caseDetail?id=${item.caseId}`)}>
            <Text style={styles.detailBtnText}>Xem chi tiết</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLOR.PRIMARY} />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Khi app quay lại foreground
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        refetchNotiList();
        onMarkAllRead();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [refetchNotiList, onMarkAllRead]);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        refetchNotiList();
        onMarkAllRead();
      }, 1000);

      return () => clearTimeout(timer);
    }, [refetchNotiList, onMarkAllRead]),
  );

  return (
    <SafeAreaView>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <Text style={styles.title}>Thông báo vụ án</Text>
          <FlatList
            data={allNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item, index) => (item.id ? String(item.id) : `noti-${index}`)}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<Text style={styles.emptyText}>Không có thông báo nào</Text>}
            contentContainerStyle={{padding: 16}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLOR.PRIMARY]}
                tintColor="red"
              />
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    zIndex: 1,
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
  unreadCard: {
    backgroundColor: '#f0f9ff', // Light blue background for unread notifications
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  itemCase: {
    fontSize: 14,
    color: COLOR.PRIMARY,
    marginBottom: 2,
  },
  itemTime: {
    fontSize: 13,
    color: COLOR.GRAY4,
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: COLOR.GRAY4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: COLOR.GRAY4,
  },
});

export default NotificationScreen;
