import { Modal, Radio, Form, Input, Button, Col, Row, Checkbox, message } from 'antd'
import styles from '../css/LoginForm.module.css'
import { useRef, useState, useEffect } from 'react'
import { getCaptcha, userIsExist, addUser, userLogin, getUserById } from '../api/user'
import { initUserInfo, changeLoginStatus } from '../redux/userSlice'
import { useDispatch } from 'react-redux'

function LoginForm(props) {
  const [value, setValue] = useState('login')
  const loginFormRef = useRef()
  const registerFormRef = useRef()
  const dispatch = useDispatch()

  async function fetchCaptchaData() {
    const result = await getCaptcha()
    setCaptcha(result)
  }

  // 验证登录账号是否存在
  async function checkLoginIdIsExist() {
    if (!registerInfo.loginId.trim() && registerInfo.loginId) {
      return Promise.reject('请输入用户名！')
    } else if (registerInfo.loginId.trim() && registerInfo.loginId) {
      const { data } = await userIsExist(registerInfo.loginId)
      if (data) {
        return Promise.reject('该用户已注册！')
      } else {
        return Promise.resolve()
      }
    }
  }

  useEffect(() => {
    fetchCaptchaData()
  }, [props.isShow])

  const clearInfo = () => {
    setRegisterInfo({
      loginId: '',
      nickname: '',
      captcha: ''
    })
    setLoginInfo({
      loginId: '',
      loginPwd: '',
      captcha: '',
      remember: false
    })
    props.closeModal()
  }

  // 登录表单的状态数据
  const [loginInfo, setLoginInfo] = useState({
    loginId: '',
    loginPwd: '',
    captcha: '',
    remember: false
  })
  // 注册表单的状态数据
  const [registerInfo, setRegisterInfo] = useState({
    loginId: '',
    nickname: '',
    captcha: ''
  })


  const [captcha, setCaptcha] = useState(null)

  /**
   * @param {*} oldInfo 之前整体的状态
   * @param {*} newContent 用户输入的新的内容
   * @param {*} key 对应的键名
   * @param {*} setInfo 修改状态值的函数
   */
  const updateInfo = (oldInfo, newContent, key, setInfo) => {
    const obj = { ...oldInfo }
    obj[key] = newContent
    setInfo(obj)
  }

  const loginHandle = async () => {
    const result = await userLogin(loginInfo)
    if (result.data) {
      const data = result.data
      if (!data.data) {
        message.warning('账号或者密码不正确！')
        clearInfo()
      } else if (!data.data.enabled) {
        message.warning('账号密码被禁用！')
        clearInfo()
      } else {
        localStorage.userToken = data.token
        const detailUserInfo = await getUserById(data.data._id)
        dispatch(initUserInfo(detailUserInfo.data))
        dispatch(changeLoginStatus(true))
        props.closeModal()
      }
    } else {
      message.warning(result.msg)
      fetchCaptchaData()
    }
  }

  const captchaClickHandle = () => {
    fetchCaptchaData()
  }

  const registerHandle = async () => {
    const result = await addUser(registerInfo)
    console.log(result)
    if (result.data) {
      message.success('用户注册成功，默认密码为 123456')
      // 将用户的信息存储到用户仓库
      dispatch(initUserInfo(result.data))
      dispatch(changeLoginStatus(true))
      clearInfo()
    } else {
      message.warning(result.msg)
      fetchCaptchaData()
    }
  }

  const handleCancel = () => {
    clearInfo()
  }

  const handleChange = e => {
    fetchCaptchaData()
    setValue(e.target.value)
  }

  let container = ''
  if (value === 'login') {
    container = (
      <div className={styles.container}>
        <Form name="basic1" autoComplete="off" onFinish={loginHandle} ref={loginFormRef}>
          <Form.Item
            label="登录账号"
            name="loginId"
            rules={[
              {
                required: true,
                message: '请输入账号'
              }
            ]}
          >
            <Input placeholder="请输入你的登录账号" value={loginInfo.loginId} onChange={e => updateInfo(loginInfo, e.target.value, 'loginId', setLoginInfo)} />
          </Form.Item>

          <Form.Item
            label="登录密码"
            name="loginPwd"
            rules={[
              {
                required: true,
                message: '请输入密码'
              }
            ]}
          >
            <Input.Password placeholder="请输入你的登录密码，新用户默认为123456" value={loginInfo.loginPwd} onChange={e => updateInfo(loginInfo, e.target.value, 'loginPwd', setLoginInfo)} />
          </Form.Item>

          {/* 验证码 */}
          <Form.Item
            name="logincaptcha"
            label="验证码"
            rules={[
              {
                required: true,
                message: '请输入验证码'
              }
            ]}
          >
            <Row align="middle">
              <Col span={16}>
                <Input placeholder="请输入验证码" value={loginInfo.captcha} onChange={e => updateInfo(loginInfo, e.target.value, 'captcha', setLoginInfo)} />
              </Col>
              <Col span={6}>
                <div className={styles.captchaImg} onClick={captchaClickHandle} dangerouslySetInnerHTML={{ __html: captcha }}></div>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="remember"
            wrapperCol={{
              offset: 5,
              span: 16
            }}
          >
            <Checkbox onChange={e => updateInfo(loginInfo, e.target.checked, 'remember', setLoginInfo)} checked={loginInfo.remember}>
              记住我
            </Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 5,
              span: 16
            }}
          >
            <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
              登录
            </Button>
            <Button
              type="primary"
              htmlType='reset'
              onClick={() => {
                setLoginInfo({
                  loginId: '',
                  loginPwd: '',
                  captcha: '',
                  remember: false
                })
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  } else if (value === 'enroll') {
    container = (
      <div className={styles.container}>
        <Form name="basic2" autoComplete="off" ref={registerFormRef} onFinish={registerHandle}>
          <Form.Item
            label="登录账号"
            name="loginId"
            rules={[
              {
                required: true,
                message: '请输入账号，仅此项为必填项'
              },
              // 验证用户是否已经存在
              { validator: checkLoginIdIsExist }
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="请输入账号" value={registerInfo.loginId} onChange={e => updateInfo(registerInfo, e.target.value, 'loginId', setRegisterInfo)} />
          </Form.Item>

          <Form.Item label="用户昵称" name="nickname">
            <Input placeholder="请输入昵称，不填写默认为新用户xxx" value={registerInfo.nickname} onChange={e => updateInfo(registerInfo, e.target.value, 'nickname', setRegisterInfo)} />
          </Form.Item>

          <Form.Item
            name="registercaptcha"
            label="验证码"
            rules={[
              {
                required: true,
                message: '请输入验证码'
              }
            ]}
          >
            <Row align="middle">
              <Col span={16}>
                <Input placeholder="请输入验证码" value={registerInfo.captcha} onChange={e => updateInfo(registerInfo, e.target.value, 'captcha', setRegisterInfo)} />
              </Col>
              <Col span={6}>
                <div className={styles.captchaImg} onClick={captchaClickHandle} dangerouslySetInnerHTML={{ __html: captcha }}></div>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 5,
              span: 16
            }}
          >
            <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
              注册
            </Button>
            <Button
              type="primary"
              htmlType="reset"
              onClick={() => {
                setRegisterInfo({
                  loginId: '',
                  nickname: '',
                  captcha: ''
                })
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  return (
    <div>
      <Modal title="注册/登录" open={props.isShow} onCancel={handleCancel} footer={null}>
        <Radio.Group value={value} buttonStyle="solid" className={styles.radioGroup} onChange={handleChange}>
          <Radio.Button value="login" className={styles.radioButton}>
            登录
          </Radio.Button>
          <Radio.Button value="enroll" className={styles.radioButton}>
            注册
          </Radio.Button>
        </Radio.Group>
        {/* 对应功能的表单 */}
        {container}
      </Modal>
    </div>
  )
}

export default LoginForm
