import React from 'react'
import { useSelector } from 'react-redux'
import { Button, List, Popover, Avatar, Image, message } from 'antd'
import styles from "../css/LoginAvatar.module.css"
import { UserOutlined } from '@ant-design/icons'
import { changeLoginStatus, clearUserInfo } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// 该组件用于显示用户的头像，如果用户没有登录，那么就显示登录注册按钮
function LoginAvatar(props) {
  const { isLogin, userInfo } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let loginStatus = null

  const listClickHandle = (item) => {
    if(item === "退出登录") {
      localStorage.removeItem("userToken")
      dispatch(clearUserInfo())
      dispatch(changeLoginStatus(false))
      message.warning("退出登录成功！")
    }else {
      // 跳转到个人中心
      navigate('/personal')
    }
  }

  if (isLogin) {
    let content = (
      <List
        dataSource={['个人中心', '退出登录']}
        size="large"
        renderItem={item => {
          return <List.Item style={{ cursor: 'pointer' }} onClick={() => listClickHandle(item)} >{item}</List.Item>
        }}
      />
    )
    loginStatus = (
    <Popover content={content} trigger="hover" placement='bottom'>
      <div className={styles.avatarContainer} style={{
        cursor: "pointer"
      }}>
        <Avatar src={<Image preview={true} src={userInfo?.avatar} />} size="large" icon={<UserOutlined />} ></Avatar>
      </div>
    </Popover>
    )
  } else {
    loginStatus = (
      <Button type="primary" size="large" onClick={props.loginHandle}>
        登录/注册
      </Button>
    )
  }
  return loginStatus
}

export default LoginAvatar
