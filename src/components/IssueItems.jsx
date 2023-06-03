import { useEffect, useState } from 'react'
import styles from '../css/IssueItem.module.css'
import { formatDate } from '../utils/tools'
import { useDispatch, useSelector } from 'react-redux'
import { getTypeListAsync } from '../redux/typeSlice'
import { getUserById } from '../api/user'
import { Tag } from 'antd'
import { useNavigate } from 'react-router-dom'

/**
 * 每一条问答项目
 * @param {} props
 * @returns
 */
function IssueItems(props) {
  const { typeList } = useSelector(state => state.type)
  const [userInfo, setUserInfo] = useState({})
  const dispatch = useDispatch()
  const navigator = useNavigate()

  const getIssueInfo = async () => {
    const resp = await getUserById(props.issueInfo.userId)
    setUserInfo(resp.data)
  }

  useEffect(() => {
    if (typeList.length === 0) {
      dispatch(getTypeListAsync())
    }
    getIssueInfo()
  }, [])

  const type = typeList.find(it => it._id === props.issueInfo.typeId)
  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']

  return (
    <div className={styles.container}>
      {/* 回答数 */}
      <div className={styles.issueNum}>
        <div>{props.issueInfo.commentNumber}</div>
        <div>回答</div>
      </div>
      {/* 浏览数 */}
      <div className={styles.issueNum}>
        <div>{props.issueInfo.scanNumber}</div>
        <div>浏览</div>
      </div>
      {/* 问题内容 */}
      <div className={styles.issueContainer}>
        <div className={styles.top} onClick={() => navigator('/issue/' + props.issueInfo._id)}>{props.issueInfo.issueTitle}</div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <Tag color={colorArr[typeList.indexOf(type) % colorArr.length]}>{type?.typeName}</Tag>
          </div>
          <div className={styles.right}>
            <Tag color="volcano">{userInfo?.nickname}</Tag>
            <span>{formatDate(props.issueInfo.issueDate, 'year')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueItems
