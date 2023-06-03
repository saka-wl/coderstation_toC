import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Input, Select } from 'antd'
import LoginAvatar from './LoginAvatar'
import { useNavigate } from 'react-router-dom'

function NavHeader(props) {

  const navigate = useNavigate()
  const [searchOption, setSearchOption] = useState('issue')

  const handleSearch = (val) => {
    if(val) {
      // 搜索框有内容，需要进行搜索操作
      navigate('/searchpage', {
        state: {
          value: val,
          searchOption
        }
      })
    }else {
      // 搜索框没有内容，跳转到首页
      navigate('/')
    }
  }
  const handleSelectChange = (val) => {
    setSearchOption(val)
  }

  return (
    <div className="headerContainer">
      {/* 头部 logo */}
      <div className="logoContainer">
        <div className="logo"></div>
      </div>
      {/* 头部导航 */}
      <nav className="navContainer">
        <NavLink className="navigation" to="/">
          问答
        </NavLink>
        <NavLink className="navigation" to="/books">
          书籍
        </NavLink>
        <NavLink className="navigation" to="/interviews">
          面试题
        </NavLink>
        <a className="navigation" href="https://search.bilibili.com/all?vt=53938560&keyword=%E9%BB%91%E9%A9%AC%E7%A8%8B%E5%BA%8F%E5%91%98&from_source=webtop_search&spm_id_from=333.1007&search_source=5" target="_blank">
          视频教程
        </a>
      </nav>
      {/* 搜索框 */}
      <div className="searchContainer">
        <Input.Group compact>
          <Select defaultValue="issue" size="large" style={{ width: '20%' }} onChange={handleSelectChange}>
            <Select.Option value="issue">问答</Select.Option>
            <Select.Option value="book">书籍</Select.Option>
          </Select>
          <Input.Search
            placeholder="请输入要搜索的内容"
            allowClear
            enterButton="搜索"
            size="large"
            style={{
              width: '80%'
            }}
            onSearch={handleSearch}
          />
        </Input.Group>
      </div>
      {/* 登录按钮 */}
      <div className="loginBtnContainer">
        {/* 自定义头像 */}
        <LoginAvatar loginHandle={props.loginHandle} />
      </div>
    </div>
  )
}

export default NavHeader
