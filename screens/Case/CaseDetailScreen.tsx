import {COLOR} from '@/constants/color';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

// Mock case data
const caseData = {
  id: 'CA001',
  lawArticle: 'Điều 123',
  content: 'Giết người',
  decisionDate: '2025-09-01',
  endDate: '2025-10-01',
  officer: {id: '1', name: 'Nguyen Van A'},
  crimeType: 'Hình sự',
  status: 'processing',
  stages: [
    {name: 'Khởi tố', timeline: '2025-09-01'},
    {name: 'Điều tra', timeline: '2025-09-10'},
    {name: 'Xét xử', timeline: '2025-09-25'},
  ],
};

const statusMap = {
  pending: 'Chưa xử lý',
  processing: 'Đang xử lý',
  completed: 'Đã hoàn thành',
  overdue: 'Quá hạn',
};

const statusColorMap = {
  pending: COLOR.BLACK1,
  processing: COLOR.BLUE,
  completed: COLOR.GREEN,
  overdue: COLOR.PRIMARY,
};

const CaseDetailScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Chi tiết vụ án</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Mã vụ án:</Text>
          <Text style={styles.value}>{caseData.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Điều luật:</Text>
          <Text style={styles.value}>{caseData.lawArticle}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nội dung:</Text>
          <Text style={styles.value}>{caseData.content}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày ra quyết định:</Text>
          <Text style={styles.value}>{caseData.decisionDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày hết hạn:</Text>
          <Text style={styles.value}>{caseData.endDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cán bộ thụ lý:</Text>
          <Text style={styles.value}>{caseData.officer.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Loại tội phạm:</Text>
          <Text style={styles.value}>{caseData.crimeType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Text
            style={[
              styles.value,
              {color: statusColorMap[caseData.status as keyof typeof statusColorMap]},
              {fontWeight: 'bold'},
            ]}>
            {statusMap[caseData.status as keyof typeof statusMap]}
          </Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Các giai đoạn</Text>
      {caseData.stages.map((stage, idx) => (
        <View key={idx} style={styles.stageBox}>
          <Text style={styles.stageName}>{stage.name}</Text>
          <Text style={styles.stageTimeline}>{stage.timeline}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#f8f9fa'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
  label: {fontWeight: 'bold', color: '#334155', fontSize: 14},
  value: {color: '#334155', fontSize: 14},
  status: {fontWeight: 'bold', color: '#2563eb'},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#2563eb', marginLeft: 16, marginTop: 18},
  stageBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageName: {fontWeight: 'bold', color: '#334155', fontSize: 15},
  stageTimeline: {color: '#64748b', fontSize: 14},
});

export default CaseDetailScreen;
