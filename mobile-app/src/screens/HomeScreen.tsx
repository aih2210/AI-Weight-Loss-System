import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const [userData, setUserData] = useState({
    currentWeight: 70.5,
    targetWeight: 65,
    todayCalories: 1200,
    targetCalories: 1500,
    todayExercise: 300,
    streak: 7,
  });

  const weightData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        data: [72, 71.5, 71.2, 71, 70.8, 70.6, 70.5],
        color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* 欢迎卡片 */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.welcomeTitle}>你好！继续加油 💪</Title>
          <Paragraph>已连续打卡 {userData.streak} 天</Paragraph>
        </Card.Content>
      </Card>

      {/* 体重进度 */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.statRow}>
            <Icon name="weight" size={30} color="#667eea" />
            <View style={styles.statContent}>
              <Title>当前体重</Title>
              <Paragraph style={styles.statValue}>
                {userData.currentWeight} kg
              </Paragraph>
              <Paragraph style={styles.statTarget}>
                目标: {userData.targetWeight} kg
              </Paragraph>
            </View>
          </View>
          <ProgressBar
            progress={(72 - userData.currentWeight) / (72 - userData.targetWeight)}
            color="#667eea"
            style={styles.progressBar}
          />
        </Card.Content>
      </Card>

      {/* 体重趋势图 */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>本周体重趋势</Title>
          <LineChart
            data={weightData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#667eea',
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* 今日数据 */}
      <View style={styles.todayStats}>
        <Card style={styles.smallCard}>
          <Card.Content style={styles.smallCardContent}>
            <Icon name="fire" size={30} color="#ff6b6b" />
            <Paragraph style={styles.smallCardLabel}>今日摄入</Paragraph>
            <Title style={styles.smallCardValue}>
              {userData.todayCalories}
            </Title>
            <Paragraph style={styles.smallCardUnit}>
              / {userData.targetCalories} kcal
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.smallCard}>
          <Card.Content style={styles.smallCardContent}>
            <Icon name="run" size={30} color="#51cf66" />
            <Paragraph style={styles.smallCardLabel}>今日消耗</Paragraph>
            <Title style={styles.smallCardValue}>
              {userData.todayExercise}
            </Title>
            <Paragraph style={styles.smallCardUnit}>kcal</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* AI建议 */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.aiSuggestion}>
            <Icon name="robot" size={24} color="#667eea" />
            <Title style={styles.aiTitle}>AI智能建议</Title>
          </View>
          <Paragraph style={styles.aiText}>
            🎉 太棒了！你本周已减重0.5kg，保持当前节奏。
          </Paragraph>
          <Paragraph style={styles.aiText}>
            💡 建议今天增加10分钟有氧运动，帮助突破平台期。
          </Paragraph>
          <Paragraph style={styles.aiText}>
            🥗 晚餐可以尝试低卡沙拉，既美味又健康。
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 15,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#667eea',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statContent: {
    marginLeft: 15,
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statTarget: {
    color: '#666',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  smallCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 4,
  },
  smallCardContent: {
    alignItems: 'center',
  },
  smallCardLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  smallCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  smallCardUnit: {
    fontSize: 12,
    color: '#666',
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiTitle: {
    marginLeft: 10,
    fontSize: 18,
  },
  aiText: {
    marginVertical: 5,
    lineHeight: 22,
  },
});
