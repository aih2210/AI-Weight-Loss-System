import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, List, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ExerciseScreen() {
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: '快走',
      duration: 30,
      calories: 120,
      completed: true,
      intensity: 'low',
    },
    {
      id: 2,
      name: '深蹲',
      duration: 15,
      calories: 90,
      completed: false,
      intensity: 'medium',
    },
    {
      id: 3,
      name: '瑜伽',
      duration: 20,
      calories: 60,
      completed: false,
      intensity: 'low',
    },
  ]);

  const toggleComplete = (id: number) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const completedCalories = exercises
    .filter((ex) => ex.completed)
    .reduce((sum, ex) => sum + ex.calories, 0);

  const totalCalories = exercises.reduce((sum, ex) => sum + ex.calories, 0);

  return (
    <ScrollView style={styles.container}>
      {/* 运动总览 */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>今日运动目标</Title>
          <View style={styles.calorieRow}>
            <View style={styles.calorieItem}>
              <Title style={styles.calorieValue}>{completedCalories}</Title>
              <Paragraph style={styles.calorieLabel}>已完成</Paragraph>
            </View>
            <View style={styles.calorieDivider} />
            <View style={styles.calorieItem}>
              <Title style={styles.calorieValue}>{totalCalories}</Title>
              <Paragraph style={styles.calorieLabel}>目标</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 今日计划 */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>今日运动计划</Title>
          {exercises.map((exercise) => (
            <List.Item
              key={exercise.id}
              title={exercise.name}
              description={`${exercise.duration}分钟 · ${exercise.calories} kcal`}
              left={(props) => (
                <Icon
                  name={exercise.completed ? 'check-circle' : 'circle-outline'}
                  size={30}
                  color={exercise.completed ? '#51cf66' : '#ccc'}
                />
              )}
              right={(props) => (
                <Chip
                  mode="outlined"
                  style={[
                    styles.chip,
                    exercise.intensity === 'low' && styles.chipLow,
                    exercise.intensity === 'medium' && styles.chipMedium,
                  ]}
                >
                  {exercise.intensity === 'low' ? '低强度' : '中强度'}
                </Chip>
              )}
              onPress={() => toggleComplete(exercise.id)}
              style={styles.exerciseItem}
            />
          ))}
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
  summaryCard: {
    margin: 15,
    elevation: 4,
    backgroundColor: '#51cf66',
  },
  summaryTitle: {
    color: '#fff',
    textAlign: 'center',
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  calorieItem: {
    alignItems: 'center',
    flex: 1,
  },
  calorieValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  calorieLabel: {
    color: '#fff',
    fontSize: 14,
  },
  calorieDivider: {
    width: 1,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  card: {
    margin: 15,
    marginTop: 0,
    elevation: 4,
  },
  exerciseItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chip: {
    alignSelf: 'center',
  },
  chipLow: {
    backgroundColor: '#e3f2fd',
  },
  chipMedium: {
    backgroundColor: '#fff3e0',
  },
});
