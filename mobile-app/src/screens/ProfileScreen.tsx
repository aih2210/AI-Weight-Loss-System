import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, List, Avatar, Button } from 'react-native-paper';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* 用户信息 */}
      <Card style={styles.card}>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Text size={80} label="张三" style={styles.avatar} />
          <View style={styles.userInfo}>
            <Title>张三</Title>
            <Paragraph>30岁 · 男 · 170cm</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* 统计数据 */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>我的成就</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Title style={styles.statValue}>7</Title>
              <Paragraph>连续打卡</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statValue}>1.5</Title>
              <Paragraph>已减重(kg)</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statValue}>21</Title>
              <Paragraph>使用天数</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 设置选项 */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="个人资料"
            left={(props) => <List.Icon {...props} icon="account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="目标设置"
            left={(props) => <List.Icon {...props} icon="target" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="提醒设置"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="关于我们"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={() => {}}
        style={styles.logoutButton}
      >
        退出登录
      </Button>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#667eea',
  },
  userInfo: {
    marginLeft: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    color: '#667eea',
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: 15,
  },
});
