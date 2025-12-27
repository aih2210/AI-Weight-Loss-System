import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, List } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DietScreen() {
  const [meals, setMeals] = useState([
    {
      id: 1,
      type: '早餐',
      time: '08:30',
      foods: ['燕麦粥', '鸡蛋', '牛奶'],
      calories: 350,
      icon: 'weather-sunset-up',
    },
    {
      id: 2,
      type: '午餐',
      time: '12:30',
      foods: ['鸡胸肉', '西兰花', '糙米饭'],
      calories: 520,
      icon: 'weather-sunny',
    },
  ]);

  const [showFAB, setShowFAB] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('识别中', '正在使用AI识别食物...');
      // 这里调用后端API进行食物识别
      setTimeout(() => {
        Alert.alert('识别成功', '检测到：鸡胸肉沙拉 (约350卡路里)');
      }, 2000);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('识别中', '正在使用AI识别食物...');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 今日摄入总览 */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title>今日摄入</Title>
            <View style={styles.calorieRow}>
              <View style={styles.calorieItem}>
                <Paragraph style={styles.calorieLabel}>已摄入</Paragraph>
                <Title style={styles.calorieValue}>870</Title>
                <Paragraph style={styles.calorieUnit}>kcal</Paragraph>
              </View>
              <View style={styles.calorieDivider} />
              <View style={styles.calorieItem}>
                <Paragraph style={styles.calorieLabel}>剩余</Paragraph>
                <Title style={[styles.calorieValue, { color: '#51cf66' }]}>
                  630
                </Title>
                <Paragraph style={styles.calorieUnit}>kcal</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* 营养成分 */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>营养成分</Title>
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientItem}>
                <Icon name="food-drumstick" size={24} color="#ff6b6b" />
                <Paragraph style={styles.nutrientLabel}>蛋白质</Paragraph>
                <Paragraph style={styles.nutrientValue}>45g</Paragraph>
              </View>
              <View style={styles.nutrientItem}>
                <Icon name="bread-slice" size={24} color="#ffd93d" />
                <Paragraph style={styles.nutrientLabel}>碳水</Paragraph>
                <Paragraph style={styles.nutrientValue}>120g</Paragraph>
              </View>
              <View style={styles.nutrientItem}>
                <Icon name="water" size={24} color="#4dabf7" />
                <Paragraph style={styles.nutrientLabel}>脂肪</Paragraph>
                <Paragraph style={styles.nutrientValue}>25g</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* 用餐记录 */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>今日用餐</Title>
            {meals.map((meal) => (
              <List.Item
                key={meal.id}
                title={meal.type}
                description={`${meal.foods.join('、')} · ${meal.calories} kcal`}
                left={(props) => (
                  <List.Icon {...props} icon={meal.icon} color="#667eea" />
                )}
                right={(props) => (
                  <Paragraph {...props} style={styles.mealTime}>
                    {meal.time}
                  </Paragraph>
                )}
                style={styles.mealItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* AI食谱推荐 */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.recipeHeader}>
              <Icon name="chef-hat" size={24} color="#667eea" />
              <Title style={styles.recipeTitle}>AI推荐食谱</Title>
            </View>
            <Paragraph style={styles.recipeText}>
              🥗 低卡鸡胸肉沙拉
            </Paragraph>
            <Paragraph style={styles.recipeDesc}>
              热量: 320 kcal | 蛋白质: 35g
            </Paragraph>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('食谱详情', '查看完整制作步骤')}
              style={styles.recipeButton}
            >
              查看详情
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* 浮动按钮 */}
      <FAB.Group
        open={showFAB}
        visible
        icon={showFAB ? 'close' : 'plus'}
        actions={[
          {
            icon: 'camera',
            label: '拍照识别',
            onPress: pickImage,
          },
          {
            icon: 'image',
            label: '从相册选择',
            onPress: pickFromGallery,
          },
          {
            icon: 'pencil',
            label: '手动输入',
            onPress: () => Alert.alert('手动输入', '打开输入表单'),
          },
        ]}
        onStateChange={({ open }) => setShowFAB(open)}
        fabStyle={styles.fab}
      />
    </View>
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
    backgroundColor: '#667eea',
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
  calorieLabel: {
    color: '#fff',
    fontSize: 14,
  },
  calorieValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  calorieUnit: {
    color: '#fff',
    fontSize: 12,
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
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  nutrientValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  mealItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealTime: {
    alignSelf: 'center',
    color: '#666',
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeTitle: {
    marginLeft: 10,
    fontSize: 18,
  },
  recipeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  recipeDesc: {
    color: '#666',
    marginBottom: 10,
  },
  recipeButton: {
    marginTop: 5,
  },
  fab: {
    backgroundColor: '#667eea',
  },
});
