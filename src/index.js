import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/antd.min.css'
import "./index.css"
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
// BrowserRouter改为HashRouter
import { HashRouter } from 'react-router-dom'
import store from './redux/store'
import { Provider } from 'react-redux'


//  basename='/client'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </HashRouter>
  </Provider>
)
