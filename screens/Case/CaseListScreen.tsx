import {COLOR} from '@/constants/color';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  item?: {
    name?: string;
    status?: string;
    due?: string;
  };
};

const CaseListScreen = ({item}: Props) => {
  return (
    <View style={styles.caseItem}>
      <View style={{flex: 1}}>
        <Text style={styles.caseName}>{item?.name ?? ''}</Text>
        <Text style={styles.caseStatus}>
          {item?.status ?? 'Chưa có trạng thái'} - Hạn: {item?.due ?? 'Không xác định'}
        </Text>
      </View>
      <TouchableOpacity style={styles.detailBtn}>
        <Text style={styles.detailBtnText}>Chi tiết</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default CaseListScreen;
