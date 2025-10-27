import {COLOR} from '@/constants/color';
import {globalStyles} from '@/constants/globalStyles';
import {useGetTemplateList} from '@/hooks/useTemPlates';
import {router} from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ChooseTemplateScreen = () => {
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch} =
    useGetTemplateList({limit: 10});

  const templates = data?.pages?.flatMap(page => page.data) || [];

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch?.();
    setRefreshing(false);
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={
        () =>
          router.push({
            pathname: '/(app)/(case)/caseCreate',
            params: {caseId: item?.id},
          })
        // console.log('caseId: item?.id', item?.id)
      }>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description || 'Không có mô tả'}</Text>
      </View>
      <View style={styles.startBtn}>
        <Text style={styles.startText}>Chọn</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[globalStyles.container]}>
      <Text style={styles.headerSubtitle}>Hãy chọn một mẫu phù hợp để bắt đầu tạo vụ án mới</Text>
      <FlatList
        data={templates}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLOR.PRIMARY]}
            tintColor="red"
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={COLOR.PRIMARY} style={{marginTop: 40}} />
          ) : (
            <Text style={styles.emptyText}>Không có mẫu vụ án nào</Text>
          )
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color={COLOR.PRIMARY} style={{marginVertical: 20}} />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerSubtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 16,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: COLOR.PRIMARY,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#475569',
  },
  startBtn: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 48,
    fontSize: 15,
  },
});

export default ChooseTemplateScreen;
