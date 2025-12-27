import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Dashboard from './pages/Dashboard';
import DietLog from './pages/DietLog';
import ExercisePlan from './pages/ExercisePlan';
import './App.css';

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ color: 'white', fontSize: '24px' }}>
          AI智能减重系统
        </Header>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/diet" element={<DietLog />} />
            <Route path="/exercise" element={<ExercisePlan />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
