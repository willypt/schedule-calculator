import React from 'react';
import './App.css';
import { Layout } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import routes from './routes';

const { Header, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header />
        <Content className="content">
          <BrowserRouter>{routes()}</BrowserRouter>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
