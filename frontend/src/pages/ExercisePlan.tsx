import React from 'react';
import { Card, List, Button } from 'antd';

const ExercisePlan: React.FC = () => {
  const exercises = [
    { name: '快走', duration: 30, calories: 120 },
    { name: '深蹲', duration: 15, calories: 90 },
  ];

  return (
    <div>
      <h1>我的运动计划</h1>
      <Card>
        <List
          dataSource={exercises}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`${item.duration}分钟 · ${item.calories}卡路里`}
              />
              <Button type="primary">开始运动</Button>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ExercisePlan;
