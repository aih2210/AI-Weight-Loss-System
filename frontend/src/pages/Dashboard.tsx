import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowDownOutlined, FireOutlined, TrophyOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>我的减重仪表盘</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="当前体重"
              value={70.5}
              suffix="kg"
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日消耗"
              value={450}
              suffix="kcal"
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="连续打卡"
              value={7}
              suffix="天"
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
