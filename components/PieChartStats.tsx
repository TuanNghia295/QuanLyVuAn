import {COLOR} from '@/constants/color';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

interface PieChartStatsProps {
  open: number;
  closed: number;
  expiring: number;
}

const PieChartStats: React.FC<PieChartStatsProps> = ({open, closed, expiring}) => {
  return (
    <View style={styles.chartCardWrap}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  chartCardWrap: {},
});

export default PieChartStats;
