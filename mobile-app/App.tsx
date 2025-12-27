import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './src/screens/HomeScreen';
import DietScreen from './src/screens/DietScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = 'home';
              
              if (route.name === '首页') {
                iconName = 'home';
              } else if (route.name === '饮食') {
                iconName = 'food-apple';
              } else if (route.name === '运动') {
                iconName = 'run';
              } else if (route.name === '我的') {
                iconName = 'account';
              }
              
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#667eea',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#667eea',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen name="首页" component={HomeScreen} />
          <Tab.Screen name="饮食" component={DietScreen} />
          <Tab.Screen name="运动" component={ExerciseScreen} />
          <Tab.Screen name="我的" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
