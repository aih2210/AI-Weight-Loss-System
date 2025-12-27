import React from 'react';
import { Card, Button, Upload } from 'antd';
import { CameraOutlined } from '@ant-design/icons';

const DietLog: React.FC = () => {
  return (
    <div>
      <h1>饮食记录</h1>
      <Card>
        <Upload>
          <Button icon={<CameraOutlined />} size="large">
            拍照识别食物
          </Button>
        </Upload>
      </Card>
    </div>
  );
};

export default DietLog;
