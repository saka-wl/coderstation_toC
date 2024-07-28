import './css/App.css'
import NavHeader from './components/NavHeader'
import PageFooter from './components/PageFooter'
import { Layout, message } from 'antd'
import RouteBefore from './router/RouteBefore'
import LoginForm from './components/LoginForm'
import { useState, useEffect } from 'react'
import { getInfo, getUserById } from './api/user'
import { initUserInfo, changeLoginStatus } from './redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getTypeListAsync } from './redux/typeSlice'

function App() {
  const { Header, Footer, Content } = Layout
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const {typeList} = useSelector(state => state.type)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    async function fetchData() {
      const result = await getInfo()
      if (result?.data === null) {
        message.warning(result.msg)
      } else {
        const {data} = await getUserById(result.data._id)
        // console.log(data, 'data')
        dispatch(initUserInfo(data))
        dispatch(changeLoginStatus(true))
      }
    }
    if(localStorage.getItem("userToken")) fetchData();
    if(typeList?.length === 0) dispatch(getTypeListAsync());
  }, [])

  function loginHandle() {
    setIsModalOpen(true)
  }
  return (
    <div className="App">
      {/* 头部导航 */}
      <Header className="header">
        <NavHeader loginHandle={loginHandle} />
      </Header>
      {/* 匹配上的路由 */}
      <Content className="content">
        <RouteBefore />
      </Content>
      {/* 底部 */}
      <Footer className="footer">
        <PageFooter />
      </Footer>
      {/* 登录弹窗 */}
      <LoginForm isShow={isModalOpen} closeModal={closeModal} />
    </div>
  )
}

export default App
