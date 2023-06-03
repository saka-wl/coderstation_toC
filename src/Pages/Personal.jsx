import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'
import styles from '../css/Personal.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Form, Image, Input, Modal, Upload, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PersonalInfoItem from '../components/PersonalInfoItem'
import { formatDate } from '../utils/tools'
import { changeLoginStatus, clearUserInfo, updateUserInfoAsync } from '../redux/userSlice'
import { userPasswordCheck } from '../api/user'
import { useNavigate } from 'react-router-dom'

/**
 * 个人中心
 * @param {*} props
 * @returns
 */
function Personal(props) {
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [panelName, setPanelName] = useState('')
  const [passwordInfo, setPasswordInfo] = useState({
    oldpassword: '',
    newpassword: '',
    passwordConfirm: ''
  })
  const [editInfo, setEditInfo] = useState({}) // 存储用户修改的项目，（qq，wechat等）

  const showModal = () => {
    setIsModalOpen(true)
    setEditInfo({})
  }

  const handleOk = () => {
    setIsModalOpen(false)
    dispatch(
      updateUserInfoAsync({
        userId: userInfo._id,
        newInfo: editInfo
      })
    )
    if(editInfo.loginPwd) {
      localStorage.removeItem("userToken")
      dispatch(clearUserInfo())
      dispatch(changeLoginStatus(false))
      navigate('/')
      message.success('修改用户信息成功！，已退出登录')
      return
    }
    message.success('修改用户信息成功！')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleAvatar = (newUrl, key) => {
    dispatch(
      updateUserInfoAsync({
        userId: userInfo._id,
        newInfo: {
          [key]: newUrl
        }
      })
    )
    message.success('修改头像成功！')
  }

  const handleEditorClick = val => {
    setPanelName(val)
    showModal()
  }

  const updateInfo = (val, key) => {
    if (key === 'nickname' && !val) {
      message.warning('用户昵称不能为空！')
      return
    }
    const newUserInfo = { ...editInfo }
    newUserInfo[key] = val
    setEditInfo(newUserInfo)
  }

  const updatePasswordInfo = (val, key) => {
    let password = { ...passwordInfo }
    password[key] = val.trim()
    setPasswordInfo(password)
    if (key === 'newpassword') {
      updateInfo(val, 'loginPwd')
    }
  }

  /**
   * 验证用户输入的旧密码是否正确
   */
  const checkPassword = async () => {
    if (passwordInfo.oldpassword) {
      const { data } = await userPasswordCheck({
        userId: userInfo._id,
        loginPwd: passwordInfo.oldpassword
      })
      if (!data) {
        return Promise.reject('密码不正确！')
      }
    }
  }

  let modalContent = null
  switch (panelName) {
    case '基本信息': {
      modalContent = (
        <>
          <Form name="basic1" autoComplete="off" initialValues={userInfo} onFinish={handleOk}>
            {/* 登录密码 */}
            <Form.Item
              label="登录密码"
              name="oldpassword"
              rules={[
                { required: true },
                {
                  validator: checkPassword
                }
              ]}
              validateTrigger="onBlur"
            >
              <Input.Password rows={6} value={passwordInfo.oldpassword} placeholder="如果要修改密码，请先输入旧密码" onChange={e => updatePasswordInfo(e.target.value, 'oldpassword')} />
            </Form.Item>

            {/* 新的登录密码 */}
            <Form.Item label="新密码" name="newpassword" rules={[{ required: true }]}>
              <Input.Password rows={6} value={passwordInfo.newpassword} placeholder="请输入新密码" onChange={e => updatePasswordInfo(e.target.value, 'newpassword')} />
            </Form.Item>

            {/* 确认密码 */}
            <Form.Item
              label="确认密码"
              name="passwordConfirm"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newpassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次密码不一致'))
                  }
                }),
                { required: true }
              ]}
              validateTrigger="onBlur"
            >
              <Input.Password rows={6} placeholder="请确认密码" value={passwordInfo.passwordConfirm} onChange={e => updatePasswordInfo(e.target.value, 'passwordConfirm')} />
            </Form.Item>

            {/* 用户昵称 */}
            <Form.Item label="用户昵称" name="nickname">
              <Input placeholder="昵称可选，默认为新用户" value={userInfo.nickname} onBlur={e => updateInfo(e.target.value, 'nickname')} />
            </Form.Item>

            {/* 确认修改按钮 */}
            <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>

              <Button type="link" htmlType="submit" className="resetBtn">
                重置
              </Button>
            </Form.Item>
          </Form>
        </>
      )
      break
    }
    case '社交账号': {
      modalContent = (
        <>
          <Form name="basic2" initialValues={userInfo} autoComplete="off" onFinish={handleOk}>
            <Form.Item label="邮箱" name="mail">
              <Input value={userInfo.mail} placeholder="请填写邮箱" onChange={e => updateInfo(e.target.value, 'mail')} />
            </Form.Item>
            <Form.Item label="QQ号" name="qq">
              <Input value={userInfo.qq} placeholder="请填写 QQ 号" onChange={e => updateInfo(e.target.value, 'qq')} />
            </Form.Item>
            <Form.Item label="微信" name="wechat">
              <Input value={userInfo.wechat} placeholder="请填写微信号" onChange={e => updateInfo(e.target.value, 'wechat')} />
            </Form.Item>
            <Form.Item label="github" name="github">
              <Input value={userInfo.github} placeholder="请填写 github " onChange={e => updateInfo(e.target.value, 'github')} />
            </Form.Item>

            {/* 确认修改按钮 */}
            <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>

              <Button type="link" htmlType="submit" className="resetBtn">
                重置
              </Button>
            </Form.Item>
          </Form>
        </>
      )
      break
    }
    case '个人简介': {
      modalContent = (
        <>
          <Form name="basic3" initialValues={userInfo} autoComplete="off" onFinish={handleOk}>
            {/* 自我介绍 */}
            <Form.Item label="自我介绍" name="intro">
              <Input.TextArea rows={6} value={userInfo.intro} placeholder="选填" onChange={e => updateInfo(e.target.value, 'intro')} />
            </Form.Item>

            {/* 确认修改按钮 */}
            <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>

              <Button type="link" htmlType="submit" className="resetBtn">
                重置
              </Button>
            </Form.Item>
          </Form>
        </>
      )
      break
    }
  }

  return (
    <div>
      <PageHeader title="个人中心" />
      {/* 信息展示 */}
      <div className={styles.container}>
        {/* 基本信息 */}
        <div className={styles.row}>
          <Card
            title="基本信息"
            extra={
              <div className={styles.edit} onClick={() => handleEditorClick('基本信息')}>
                编辑
              </div>
            }
          >
            <PersonalInfoItem info={{ itemName: '登录账号', itemValue: userInfo.loginId }} />
            <PersonalInfoItem info={{ itemName: '账号密码', itemValue: '***' }} />
            <PersonalInfoItem info={{ itemName: '用户昵称', itemValue: userInfo.nickname }} />
            <PersonalInfoItem info={{ itemName: '用户积分', itemValue: userInfo.points }} />
            <PersonalInfoItem info={{ itemName: '注册时间', itemValue: formatDate(userInfo.registerDate) }} />
            <PersonalInfoItem info={{ itemName: '上次登录时间', itemValue: formatDate(userInfo.lastLoginDate) }} />
            <div
              style={{
                fontWeight: 100,
                height: 50
              }}
            >
              当前头像
            </div>
            <Image src={userInfo.avatar} width={100}></Image>
            <div
              style={{
                fontWeight: 100,
                height: 50
              }}
            >
              上传新头像
            </div>
            <Upload
              action="/api/upload"
              maxCount={1}
              listType="picture-card"
              onChange={e => {
                if (e.file.status === 'done') {
                  const url = e.file.response.data
                  // 处理用户头像的更新
                  handleAvatar(url, 'avatar')
                }
              }}
            >
              <PlusOutlined />
            </Upload>
          </Card>
        </div>
        {/* 社交账号 */}
        <div className={styles.row}>
          <Card
            title="社交账号"
            extra={
              <div className={styles.edit} onClick={() => handleEditorClick('社交账号')}>
                编辑
              </div>
            }
          >
            <PersonalInfoItem
              info={{
                itemName: '邮箱',
                itemValue: userInfo.mail ? userInfo.mail : '未填写'
              }}
            />
            <PersonalInfoItem
              info={{
                itemName: 'QQ号',
                itemValue: userInfo.qq ? userInfo.qq : '未填写'
              }}
            />
            <PersonalInfoItem
              info={{
                itemName: '微信号',
                itemValue: userInfo.wechat ? userInfo.wechat : '未填写'
              }}
            />
            <PersonalInfoItem
              info={{
                itemName: 'github',
                itemValue: userInfo.github ? userInfo.github : '未填写'
              }}
            />
          </Card>
        </div>
        {/* 个人简介 */}
        <div className={styles.row}>
          <Card
            title="个人简介"
            extra={
              <div className={styles.edit} onClick={() => handleEditorClick('个人简介')}>
                编辑
              </div>
            }
          >
            <p className={styles.intro}>{userInfo.intro ? userInfo.intro : '未填写'}</p>
          </Card>
        </div>
      </div>
      {/* 修改信息的对话框 */}
      <Modal title={panelName} footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {modalContent}
      </Modal>
    </div>
  )
}

export default Personal
