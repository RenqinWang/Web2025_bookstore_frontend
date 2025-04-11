import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './App.css';
import Routers from './router/router'



function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Routers/>
    </ConfigProvider>
  );
}

export default App;
