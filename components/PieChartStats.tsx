import {COLOR} from '@/constants/color';
import React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, Text, View} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

interface PieChartStatsProps {
  open: number;
  closed: number;
  expiring: number;
  loading?: boolean;
}

const PieChartStats: React.FC<PieChartStatsProps> = ({open, closed, expiring, loading}) => {
  return (
    <View style={styles.chartCardWrap}>
      {loading ? (
        <View style={{alignItems: 'center', justifyContent: 'center', height: 180}}>
          <ActivityIndicator size="large" color={COLOR.PRIMARY} />
          <Text style={{marginTop: 8, color: COLOR.PRIMARY}}>Đang tải thống kê...</Text>
        </View>
      ) : open + closed + expiring === 0 ? (
        <View style={{alignItems: 'center', justifyContent: 'center', height: 180}}>
          <View style={styles.emptyCircle} />
          <Text style={{marginTop: 12, color: COLOR.GRAY4}}>Không có dữ liệu</Text>
        </View>
      ) : (
        <PieChart
          data={[
            {
              name: 'Đang xử lý',
              population: open,
              color: COLOR.BLUE,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
            {
              name: 'Đã đóng',
              population: closed,
              color: COLOR.GREEN,
              legendFontColor: '#222',
              legendFontSize: 14,
            },
            {
              name: 'Quá hạn',
              population: expiring,
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartCardWrap: {},
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLOR.GRAY4,
    backgroundColor: '#f8fafc',
  },
});

export default PieChartStats;
