import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import Colors from '../../constants/Colors';

const data = [
  { week: 'W1', bpm: 72 },
  { week: 'W2', bpm: 75 },
  { week: 'W3', bpm: 70 },
  { week: 'W4', bpm: 78 },
  { week: 'W5', bpm: 74 },
];

const CHART_WIDTH = 220;
const CHART_HEIGHT = 80;
const PADDING = 8;

export const HeartbeatLineChart: React.FC = () => {
  const minBpm = Math.min(...data.map(d => d.bpm));
  const maxBpm = Math.max(...data.map(d => d.bpm));

  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = PADDING + (i / (data.length - 1)) * (CHART_WIDTH - 2 * PADDING);
    const y = PADDING + ((maxBpm - d.bpm) / (maxBpm - minBpm || 1)) * (CHART_HEIGHT - 2 * PADDING);
    return { x, y };
  });
  const polylinePoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Weekly Heartbeat Trend</Text>
      <View style={styles.chartArea}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          <Text style={styles.yAxisText}>{maxBpm} bpm</Text>
          <Text style={styles.yAxisText}>{minBpm} bpm</Text>
        </View>
        {/* Chart */}
        <View style={styles.svgArea}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Polyline
              points={polylinePoints}
              fill="none"
              stroke={Colors.accent}
              strokeWidth={3}
            />
            {points.map((pt, i) => (
              <Circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={5}
                fill={Colors.gold}
                stroke={Colors.primaryText}
                strokeWidth={2}
              />
            ))}
          </Svg>
          {/* X-axis labels */}
          <View style={styles.xAxisLabels}>
            {data.map((d, i) => (
              <Text key={i} style={styles.xAxisText}>{d.week}</Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  heading: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    marginRight: 8,
    width: 40,
  },
  yAxisText: {
    color: Colors.primaryText,
    fontSize: 12,
    opacity: 0.7,
  },
  svgArea: {
    flex: 1,
    height: CHART_HEIGHT,
    position: 'relative',
    marginRight: 8,
  },
  xAxisLabels: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingLeft: 8,
  },
  xAxisText: {
    color: Colors.primaryText,
    fontSize: 12,
    opacity: 0.7,
    minWidth: 24,
    textAlign: 'center',
  },
}); 