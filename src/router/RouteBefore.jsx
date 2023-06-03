
import RouteConfig from "."
import { useLocation, useNavigate } from "react-router-dom"
import RouteBeforeConfig from "./RouteBeforeConfig"
import { useSelector } from "react-redux"
import { Alert } from "antd"


/**
 * 模拟导航守卫
 */
function RouteBefore() {
  const location = useLocation()
  const navigate = useNavigate()
  const {isLogin} = useSelector(state => state.user)

  const handleClose = () => {
    navigate('/')
  }

  const currPath = RouteBeforeConfig.filter(it => it.path === location.pathname)[0]

  if(currPath?.needLogin && !isLogin) {
    return <Alert 
      message="请先登录"
      type="warning"
      closable
      onClose={handleClose}
      style={{
        marginTop: 30,
        marginBottom: 30
      }}
    />
  }

  return <RouteConfig />
}

export default RouteBefore