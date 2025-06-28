import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import Colors from '../../constants/Colors';

const MODES = ['Day', 'Week', 'Month', 'Year'] as const;
type Mode = typeof MODES[number];

type DataPoint = { x: string; y: number };
const DATA: Record<Mode, DataPoint[]> = {
  Day: [
    { x: '6am', y: 500 },
    { x: '9am', y: 1200 },
    { x: '12pm', y: 2000 },
    { x: '3pm', y: 1500 },
    { x: '6pm', y: 1800 },
    { x: '9pm', y: 900 },
  ],
  Week: [
    { x: 'Mon', y: 4000 },
    { x: 'Tue', y: 6000 },
    { x: 'Wed', y: 7000 },
    { x: 'Thu', y: 5000 },
    { x: 'Fri', y: 8000 },
    { x: 'Sat', y: 9000 },
    { x: 'Sun', y: 7500 },
  ],
  Month: [
    { x: 'W1', y: 25000 },
    { x: 'W2', y: 30000 },
    { x: 'W3', y: 28000 },
    { x: 'W4', y: 32000 },
  ],
  Year: [
    { x: 'Jan', y: 100000 },
    { x: 'Feb', y: 95000 },
    { x: 'Mar', y: 110000 },
    { x: 'Apr', y: 120000 },
    { x: 'May', y: 105000 },
    { x: 'Jun', y: 98000 },
    { x: 'Jul', y: 115000 },
    { x: 'Aug', y: 123000 },
    { x: 'Sep', y: 119000 },
    { x: 'Oct', y: 125000 },
    { x: 'Nov', y: 117000 },
    { x: 'Dec', y: 130000 },
  ],
};

export const StepBarGraph: React.FC = () => {
  const [mode, setMode] = useState<Mode>('Day');
  const data = DATA[mode];
  const maxY = Math.max(...data.map((d) => d.y));

  return (
    <View style={styles.container}>
      {/* Y-axis label */}
      <View style={styles.yAxisLabelRow}>
        <RNText style={styles.axisLabel}>Steps</RNText>
      </View>
      {/* Custom Bar Graph */}
      <View style={styles.graphArea}>
        <View style={styles.yAxisLabels}>
          {[4, 3, 2, 1, 0].map((i) => (
            <RNText key={i} style={styles.yAxisText}>
              {Math.round((maxY * i) / 4)}
            </RNText>
          ))}
        </View>
        <View style={styles.barsArea}>
          {data.map((d: DataPoint, idx: number) => (
            <View key={d.x} style={styles.barItem}>
              <View style={[
                styles.bar,
                {
                  height: Math.max(8, (d.y / maxY) * 140), // always at least 8px tall, max 140px
                },
              ]} />
              <RNText style={styles.xAxisText}>{d.x}</RNText>
            </View>
          ))}
        </View>
      </View>
      {/* Segmented Control BELOW the graph */}
      <View style={styles.segmentedControl}>
        {MODES.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.segment, mode === m && styles.segmentActive]}
            onPress={() => setMode(m)}
            activeOpacity={0.7}
          >
            <RNText style={[styles.segmentText, mode === m && styles.segmentTextActive]}>{m}</RNText>
          </TouchableOpacity>
        ))}
      </View>
      {/* X-axis label */}
      <View style={styles.xAxisLabelRow}>
        <RNText style={styles.axisLabel}>Time</RNText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // margin: 18,
    backgroundColor: 'transparent',
  },
  yAxisLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginLeft: 8,
  },
  xAxisLabelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  axisLabel: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 14,
    opacity: 0.8,
  },
  segmentedControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 0,
    borderRadius: 12,
    padding: 0,
  },
  segment: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  segmentActive: {
    backgroundColor: Colors.accent,
  },
  segmentText: {
    color: Colors.primaryText,
    fontWeight: '400',
    fontSize: 13,
  },
  segmentTextActive: {
    color: Colors.primaryText,
    fontWeight: '400',
  },
  graphArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    marginTop: 8,
    marginHorizontal: 0,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    marginRight: 8,
    width: 36,
  },
  yAxisText: {
    color: Colors.primaryText,
    fontSize: 12,
    opacity: 0.7,
  },
  barsArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
  },
  barItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    width: 18,
    backgroundColor: Colors.accent,
    borderRadius: 6,
    marginBottom: 4,
    minHeight: 8,
  },
  xAxisText: {
    color: Colors.primaryText,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
}); 